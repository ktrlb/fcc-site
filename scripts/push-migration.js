#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Pushing database migration...');

try {
  execSync('npm run db:push', { stdio: 'inherit' });
  console.log('✅ Migration pushed successfully!');
} catch (error) {
  console.error('❌ Failed to push migration:', error.message);
  process.exit(1);
}
