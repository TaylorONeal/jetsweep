import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const task = process.argv[2];
const allowedTasks = new Set(['assembleDebug', 'bundleRelease', 'lintDebug']);
if (!allowedTasks.has(task)) throw new Error('Choose assembleDebug, bundleRelease, or lintDebug.');
const env = { ...process.env };
if (!env.JAVA_HOME && process.platform === 'darwin') {
  env.JAVA_HOME = [
    join(homedir(), '.local/share/jetsweep-toolchain/jdk'),
    ...['/opt/homebrew', '/usr/local'].map(prefix => `${prefix}/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home`),
  ].find(path => existsSync(join(path, 'bin/java')));
}
if (!env.ANDROID_HOME) {
  const standard = process.platform === 'darwin'
    ? join(homedir(), 'Library/Android/sdk') : join(homedir(), 'Android/Sdk');
  env.ANDROID_HOME = env.ANDROID_SDK_ROOT || (existsSync(standard) ? standard : undefined);
}
if (env.JAVA_HOME) env.PATH = `${join(env.JAVA_HOME, 'bin')}${process.platform === 'win32' ? ';' : ':'}${env.PATH ?? ''}`;
function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, env, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
if (!env.ANDROID_HOME && !existsSync(join(root, 'android/local.properties'))) {
  console.error('Android SDK not found. Set ANDROID_HOME or android/local.properties; see docs/RELEASE.md.');
  process.exit(1);
}
run('npm', ['run', 'build:native']);
run('npx', ['cap', 'sync', 'android']);
run(process.platform === 'win32' ? 'gradlew.bat' : './gradlew', [`:app:${task}`, '--console=plain'], join(root, 'android'));
