#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const { spawn } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const env = { ...process.env }

;(async () => {
  try {
    await ensureHostKey()
    const command = process.argv.slice(2).join(' ')
    if (!command) {
      throw new Error('No command provided to docker-entrypoint')
    }
    await exec(command)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()

async function ensureHostKey() {
  const keyPath = env.TERMINAL_SSH_HOST_KEY
  if (!keyPath) {
    throw new Error('TERMINAL_SSH_HOST_KEY is not set')
  }

  const resolved = path.resolve(keyPath)
  await fs.promises.mkdir(path.dirname(resolved), { recursive: true })

  if (fs.existsSync(resolved)) {
    await fs.promises.chmod(resolved, 0o600).catch(() => {})
    return
  }

  console.warn(
    `Host key missing. Generating a new Ed25519 key (persisted on the mounted volume).`,
  )

  await execFile('ssh-keygen', [
    '-t',
    'ed25519',
    '-N',
    '',
    '-f',
    resolved,
  ])
  await fs.promises.chmod(resolved, 0o600).catch(() => {})
}

function exec(command) {
  const child = spawn(command, { shell: true, stdio: 'inherit', env })
  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} failed rc=${code}`))
      }
    })
  })
}

function execFile(command, args = []) {
  const child = spawn(command, args, { stdio: 'inherit', env })
  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} ${args.join(' ')} failed rc=${code}`))
      }
    })
  })
}
