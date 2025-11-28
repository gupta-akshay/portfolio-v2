import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { generateKeyPairSync } from 'node:crypto';

import chalk from './chalk';
import { Server, ServerChannel } from 'ssh2';

import { resumeData } from './resumeData';
import {
  renderEducation,
  renderExperience,
  renderFullResume,
  renderHelp,
  renderLinks,
  renderPrompt,
  renderSkills,
  renderSummary,
  renderWelcome,
} from './renderer';

type SizedServerChannel = ServerChannel & { columns?: number };

type CommandHandler = (shell: ResumeShell) => void;

const DEFAULT_WIDTH = 100;
const CTRL_C = '\u0003';
const NEWLINE = '\n';
const CARRIAGE_RETURN = '\r';
const BACKSPACE_CHARS = new Set(['\u0008', '\u007f']);

const helpCommand: CommandHandler = (shell) =>
  shell.print(renderHelp(shell.width));
const summaryCommand: CommandHandler = (shell) =>
  shell.print(renderSummary(resumeData, shell.width));
const skillsCommand: CommandHandler = (shell) =>
  shell.print(renderSkills(resumeData, shell.width));
const experienceCommand: CommandHandler = (shell) =>
  shell.print(renderExperience(resumeData, shell.width));
const educationCommand: CommandHandler = (shell) =>
  shell.print(renderEducation(resumeData, shell.width));
const linksCommand: CommandHandler = (shell) =>
  shell.print(renderLinks(resumeData, shell.width));
const resumeCommand: CommandHandler = (shell) =>
  shell.print(renderFullResume(resumeData, shell.width));
const clearCommand: CommandHandler = (shell) => shell.clear();
const exitCommand: CommandHandler = (shell) => shell.close();

const commander: Record<string, CommandHandler> = {
  help: helpCommand,
  '?': helpCommand,
  summary: summaryCommand,
  tldr: summaryCommand,
  skills: skillsCommand,
  stack: skillsCommand,
  experience: experienceCommand,
  xp: experienceCommand,
  shiplog: experienceCommand,
  education: educationCommand,
  edu: educationCommand,
  links: linksCommand,
  urls: linksCommand,
  resume: resumeCommand,
  ship: resumeCommand,
  deploy: resumeCommand,
  clear: clearCommand,
  cls: clearCommand,
  reset: clearCommand,
  exit: exitCommand,
  quit: exitCommand,
  q: exitCommand,
  bye: exitCommand,
};

class ResumeShell {
  private buffer = '';
  width: number;

  constructor(private readonly stream: SizedServerChannel) {
    this.width = this.extractInitialWidth(stream);
    this.resetScreen();
    this.print(renderWelcome(resumeData, this.width));
    this.prompt();
    this.registerStreamHandlers();
  }

  prompt() {
    this.stream.write(`${NEWLINE}${renderPrompt()}`);
  }

  print(content: string) {
    this.stream.write(`${NEWLINE}${content}${NEWLINE}`);
  }

  clear() {
    this.stream.write('\x1bc');
  }

  close() {
    this.stream.write('\n' + chalk.dim('Goodbye!') + '\n');
    this.stream.close();
  }

  private extractInitialWidth(stream: SizedServerChannel) {
    return typeof stream.columns === 'number' ? stream.columns : DEFAULT_WIDTH;
  }

  private resetScreen() {
    this.stream.write('\x1bc');
  }

  private registerStreamHandlers() {
    this.stream.on('data', (data: Buffer) => this.handleData(data));
    this.stream.on('close', () => this.stream.end());
    this.stream.on(
      'window-change',
      (cols?: number, rows?: number, width?: number, height?: number) => {
        void rows;
        void width;
        void height;
        if (typeof cols === 'number' && cols > 0) {
          this.width = cols;
        }
      },
    );
  }

  private handleData(data: Buffer) {
    for (const char of data.toString('utf8')) {
      if (this.processControlCharacter(char)) continue;
      this.buffer += char;
      this.stream.write(char);
    }
  }

  private processControlCharacter(char: string) {
    if (char === CTRL_C) {
      this.close();
      return true;
    }
    if (char === CARRIAGE_RETURN) {
      return true;
    }
    if (BACKSPACE_CHARS.has(char)) {
      this.removeLastCharacter();
      return true;
    }
    if (char === NEWLINE) {
      this.handleCommandSubmission();
      return true;
    }
    return false;
  }

  private removeLastCharacter() {
    if (this.buffer.length === 0) return;
    this.buffer = this.buffer.slice(0, -1);
    this.stream.write('\b \b');
  }

  private handleCommandSubmission() {
    const command = this.buffer.trim().toLowerCase();
    this.stream.write(NEWLINE);
    this.buffer = '';
    if (command.length) {
      this.execute(command);
    }
    this.prompt();
  }

  private execute(command: string) {
    const handler = commander[command];
    if (handler) {
      handler(this);
      return;
    }
    this.stream.write(
      chalk.hex('#ff6b6b')(
        `Unknown command: ${command}. Type "help" to see options.`,
      ) + NEWLINE,
    );
  }
}

const loadHostKey = () => {
  const customPath = process.env.TERMINAL_SSH_HOST_KEY;
  if (customPath) {
    const resolved = path.isAbsolute(customPath)
      ? customPath
      : path.resolve(process.cwd(), customPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Host key not found at ${resolved}`);
    }
    return fs.readFileSync(resolved);
  }
  const { privateKey } = generateKeyPairSync('ed25519');
  console.warn(
    chalk.yellow(
      'TERMINAL_SSH_HOST_KEY not set. Using ephemeral host key for this session.',
    ),
  );
  return privateKey.export({ type: 'pkcs8', format: 'pem' }) as Buffer;
};

const createSshServer = () =>
  new Server(
    {
      hostKeys: [loadHostKey()],
      banner: 'Akshay Gupta :: Terminal Resume',
    },
    (client) => {
      client.on('authentication', (ctx) => ctx.accept());
      client.on('ready', () => {
        client.on('session', (accept) => {
          const session = accept();
          session.once('shell', (acceptShell) => {
            const stream = acceptShell();
            new ResumeShell(stream);
          });
        });
      });
    },
  );

const listenPort = Number(process.env.TERMINAL_SSH_PORT ?? 2222);
const listenHost = process.env.TERMINAL_SSH_HOST ?? '0.0.0.0';

const startSshServer = () => {
  const server = createSshServer();
  server.listen(listenPort, listenHost, () => {
    console.log(
      chalk.green(
        `Terminal resume server ready on ssh ${listenHost}:${listenPort}.`,
      ),
    );
    console.log(chalk.dim(`Example: ssh -p ${listenPort} localhost`));
  });
};

const httpPort = Number(process.env.TERMINAL_HTTP_PORT ?? 8080);
const httpHost = process.env.TERMINAL_HTTP_HOST ?? '0.0.0.0';
const browserMessage = (() => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Akshay Gupta — Terminal Resume</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          sans-serif;
        background: #050607;
        color: #f0f4f8;
      }
      body {
        min-height: 100vh;
        display: grid;
        place-items: center;
        margin: 0;
        padding: 2rem;
      }
      main {
        max-width: 480px;
        text-align: center;
        line-height: 1.6;
      }
      code {
        display: inline-block;
        padding: 0.35rem 0.65rem;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.08);
        font-size: 0.95rem;
      }
      a {
        color: #7dd3fc;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Connect via SSH</h1>
      <p>
        This subdomain hosts Akshay's interactive terminal resume. Fire up your
        terminal and run:
      </p>
      <p><code>ssh ssh.akshaygupta.live</code></p>
      <p>Prefer a traditional site? Visit <a href="https://akshaygupta.live">akshaygupta.live</a>.</p>
    </main>
  </body>
</html>`)();

const createHttpHelperServer = (message: string) =>
  http.createServer((_, res) => {
    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    });
    res.end(message);
  });

const startHttpHelper = () => {
  createHttpHelperServer(browserMessage).listen(httpPort, httpHost, () => {
    console.log(
      chalk.green(
        `Browser helper page ready on http://${httpHost}:${httpPort}.`,
      ),
    );
  });
};

startSshServer();
startHttpHelper();

