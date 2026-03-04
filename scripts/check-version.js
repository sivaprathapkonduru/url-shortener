import { execSync } from 'node:child_process';
import fs from "node:fs";

const SERVICES = ['user-service', 'url-shortener-service', 'graphql-service'];

try {
    // Get staged files
    const stagedFiles = execSync('git diff --cached --name-only')
        .toString()
        .split('\n')
        .filter(Boolean);
        
    if (stagedFiles.length === 0) {
        console.error('❌ No staged files found. Did you forget git add?');
        process.exit(1);
    }
    const affectedServices = new Set();

    // Detect changed services
    stagedFiles.forEach(file => {
        SERVICES.forEach(service => {
            if (file.startsWith(`${service}/`)) {
                affectedServices.add(service);
            }
        });
    });

    console.log('📦 Affected Services:', [...affectedServices]);

    if (affectedServices.size === 0) {
        console.log('✅ No service changes detected');
        process.exit(0);
    }

    let hasError = false;

    affectedServices.forEach(service => {
        const pkgPath = `${service}/package.json`;

        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

        // 🔥 Check if package.json is staged
        const isPkgStaged = stagedFiles.includes(pkgPath);

        if (!isPkgStaged) {
            console.error(`❌ ${service} changed but package.json version was not updated. Current version: "${pkg.version}"`);
            hasError = true;
            return;
        }

        // 🔥 Check if version actually changed
        const diff = execSync(`git diff --cached ${pkgPath}`).toString();

        const versionChanged =
            diff.includes('"version"') && (diff.includes('+') || diff.includes('-'));

        if (!versionChanged) {
            console.error(`❌ ${service} package.json updated but version not changed. Current version: "${pkg.version}"`);
            hasError = true;
        } else {
            console.log(`✅ ${service} version updated correctly. Current version: "${pkg.version}"`);
        }
    });

    if (hasError) {
        console.error('\n🚫 Commit blocked: Please bump version properly.');
        process.exit(1);
    }

    console.log('✅ Version check passed');
} catch (err) {
    console.error('Error running version check', err);
    process.exit(1);
}