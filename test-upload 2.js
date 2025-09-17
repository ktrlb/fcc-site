// Simple test script for Vercel Blob upload
const fs = require('fs');
const path = require('path');

// Create a simple test file
const testContent = 'This is a test file for Vercel Blob upload';
const testFilePath = path.join(__dirname, 'test-file.txt');

fs.writeFileSync(testFilePath, testContent);

console.log('✅ Test file created:', testFilePath);
console.log('📝 You can now test the upload by:');
console.log('1. Going to http://localhost:3000/admin');
console.log('2. Logging in and uploading the test-file.txt');
console.log('3. Or using this curl command:');
console.log('');
console.log(`curl -X POST http://localhost:3000/api/admin/assets/upload \\`);
console.log(`  -F "file=@${testFilePath}" \\`);
console.log(`  -F "name=Test File" \\`);
console.log(`  -F "type=document" \\`);
console.log(`  -F "isFeatured=false"`);
console.log('');
console.log('🧹 Remember to delete test-file.txt when done testing');
