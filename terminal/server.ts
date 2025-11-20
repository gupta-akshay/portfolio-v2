import fs from 'node:fs';
import path from 'node:path';
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

const commander: Record<string, CommandHandler> = {
  help: (shell) => shell.print(renderHelp(shell.width)),
  summary: (shell) => shell.print(renderSummary(resumeData, shell.width)),
  skills: (shell) => shell.print(renderSkills(resumeData, shell.width)),
  experience: (shell) =>
    shell.print(renderExperience(resumeData, shell.width)),
  education: (shell) => shell.print(renderEducation(resumeData, shell.width)),
  links: (shell) => shell.print(renderLinks(resumeData, shell.width)),
  resume: (shell) => shell.print(renderFullResume(resumeData, shell.width)),
  clear: (shell) => shell.clear(),
  exit: (shell) => shell.close(),
  quit: (shell) => shell.close(),
};

class ResumeShell {
  private buffer = '';
  width: number;

  constructor(private readonly stream: SizedServerChannel) {
    this.width = typeof stream.columns === 'number' ? stream.columns : 100;
    this.stream.write('\x1bc'); // reset screen
    this.print(renderWelcome(resumeData, this.width));
    this.prompt();
    this.stream.on('data', (data: Buffer) => this.handleData(data));
    this.stream.on('close', () => {
      this.stream.end();
    });
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

  prompt() {
    this.stream.write(`\n${renderPrompt()}`);
  }

  print(content: string) {
    this.stream.write(`\n${content}\n`);
  }

  clear() {
    this.stream.write('\x1bc');
  }

  close() {
    this.stream.write('\n' + chalk.dim('Goodbye!') + '\n');
    this.stream.close();
  }

  private handleData(data: Buffer) {
    const text = data.toString('utf8');
    for (const char of text) {
      if (char === '\u0003') {
        this.close();
        return;
      }
      if (char === '\r') continue;
      if (char === '\u0008' || char === '\u007f') {
        if (this.buffer.length > 0) {
          this.buffer = this.buffer.slice(0, -1);
          this.stream.write('\b \b');
        }
        continue;
      }
      if (char === '\n') {
        const command = this.buffer.trim().toLowerCase();
        this.stream.write('\n');
        this.buffer = '';
        if (command.length) {
          const handler = commander[command];
          if (handler) {
            handler(this);
          } else {
            this.stream.write(
              chalk.hex('#ff6b6b')(
                `Unknown command: ${command}. Type "help" to see options.`,
              ) + '\n',
            );
          }
        }
        this.prompt();
        continue;
      }
      this.buffer += char;
      this.stream.write(char);
    }
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

const server = new Server(
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

server.listen(listenPort, listenHost, () => {
  console.log(
    chalk.green(
      `Terminal resume server ready on ssh ${listenHost}:${listenPort}.`,
    ),
  );
  console.log(chalk.dim(`Example: ssh -p ${listenPort} localhost`));
});

