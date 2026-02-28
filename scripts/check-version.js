const { execSync } = require('node:child_process');

const SERVICES = ['user-service', 'url-shortener-service', 'package.json'];

try {
  // Get staged files
  const stagedFiles = execSync('git diff --cached --name-only')
    .toString()
    .split('\n')
    .filter(Boolean);

  const affectedServices = new Set();

  // Detect which services changed
  stagedFiles.forEach(file => {
    SERVICES.forEach(service => {
      if (file.startsWith(`${service}/`)) {
        affectedServices.add(service);
      }
    });
  });
  console.log(affectedServices, 'affectedServices')
  if (affectedServices.size === 0) {
    console.log('✅ No service changes detected');
    process.exit(0);
  }

  let hasError = false;

  affectedServices.forEach(service => {
    const pkgPath = `${service}/package.json`;
    console.log(pkgPath)

    const isVersionChanged = stagedFiles.includes(pkgPath);

    if (!isVersionChanged) {
      console.error(
        `❌ ${service} changed but version not bumped in package.json`
      );
      hasError = true;
    } else {
      console.log(`✅ ${service} version updated`);
    }
  });

  if (hasError) {
    console.error('\n🚫 Commit blocked: Please bump version before committing.');
    process.exit(1);
  }

  console.log('✅ Version check passed');
} catch (err) {
  console.error('Error running version check', err);
  process.exit(1);
}