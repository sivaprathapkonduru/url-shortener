const { execSync } = require('node:child_process');

const SERVICES = ['user-service', 'url-shortener-service', 'graphql-service'];

try {
  const stagedFiles = execSync('git diff --cached --name-only')
    .toString()
    .split('\n')
    .filter(Boolean);

  console.log('🧾 Staged Files:', stagedFiles);

  const affectedServices = new Set();

  stagedFiles.forEach(file => {
    SERVICES.forEach(service => {
      if (file.startsWith(`${service}/`)) {
        affectedServices.add(service);
      }
    });
  });

  if (affectedServices.size === 0) {
    console.log('✅ No service changes for type-check');
    process.exit(0);
  }

  console.log('🧠 Running type-check for:', [...affectedServices]);

  affectedServices.forEach(service => {
    execSync(`cd ${service} && npx tsc --noEmit`, {
      stdio: 'inherit',
    });
  });

  console.log('✅ Type-check passed');
} catch (err) {
  console.error('❌ Type check failed');
  process.exit(1);
}