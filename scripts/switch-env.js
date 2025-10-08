#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const PROD_DATABASE_URL = process.env.DATABASE_URL;
const DEV_DATABASE_URL = "postgresql://neondb_owner:npg_8dKMecGx4UkT@ep-rapid-mountain-ad1psnld.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

function switchEnvironment(target) {
  const envPath = '.env.local';
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  if (target === 'dev') {
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL="${DEV_DATABASE_URL}"`
    );
    console.log('✅ Switched to DEV database');
    console.log('🔗 Dev Database: ep-rapid-mountain-ad1psnld');
  } else if (target === 'prod') {
    // Restore from backup
    const backupPath = '.env.local.backup';
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, envPath);
      console.log('✅ Switched to PRODUCTION database');
      console.log('🔗 Restored from backup');
    } else {
      console.log('❌ No backup found. Please restore manually.');
      return;
    }
  } else {
    console.log('Usage: node scripts/switch-env.js [dev|prod]');
    console.log('  dev  - Switch to development database');
    console.log('  prod - Switch to production database');
    return;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('🔄 Please restart your dev server to apply changes');
}

const target = process.argv[2];
switchEnvironment(target);
