import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const vitest = fileURLToPath(new URL('../node_modules/vitest/vitest.mjs', import.meta.url));
for (const timezone of ['UTC', 'America/New_York', 'Europe/London', 'Asia/Makassar']) {
  console.log(`\nChecking departure calculations in ${timezone}`);
  const result = spawnSync(process.execPath, [vitest, 'run', 'tests/timezone.test.ts', 'tests/timeline.test.ts'], {
    cwd: root,
    env: { ...process.env, TZ: timezone, JETSWEEP_TEST_TIMEZONE: timezone },
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
