#!/usr/bin/env node

/**
 * Clean Iterative Improvements from Prompt Files
 * Removes "--- ITERATIVE IMPROVEMENTS ---" sections while preserving core content
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

console.log(`${GREEN}=== Prompt Cleanup Tool ===${RESET}\n`);

// Get search path from command line or use current directory
const searchPath = process.argv[2] || '.';

// Find files containing ITERATIVE IMPROVEMENTS
console.log(`${YELLOW}Searching for files with ITERATIVE IMPROVEMENTS...${RESET}`);

let filesWithImprovements = [];
try {
  const grepResult = execSync(
    `grep -rl "ITERATIVE IMPROVEMENTS" "${searchPath}" 2>/dev/null || true`,
    { encoding: 'utf-8' }
  );
  filesWithImprovements = grepResult.trim().split('\n').filter(f => f);
} catch (err) {
  // Ignore errors from grep
}

if (filesWithImprovements.length === 0) {
  console.log(`${GREEN}No files found with ITERATIVE IMPROVEMENTS sections.${RESET}`);
  process.exit(0);
}

console.log('Files found:');
filesWithImprovements.forEach(f => console.log(`  - ${f}`));
console.log('');

// Create backup directory
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupDir = `./backups/prompts_${timestamp}`;

if (!fs.existsSync('./backups')) {
  fs.mkdirSync('./backups');
}
fs.mkdirSync(backupDir, { recursive: true });

console.log(`${YELLOW}Creating backups in: ${backupDir}${RESET}\n`);

// Process each file
let cleanedCount = 0;

filesWithImprovements.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;

  console.log(`Processing: ${YELLOW}${filePath}${RESET}`);

  // Create backup
  const backupPath = path.join(backupDir, path.basename(filePath));
  fs.copyFileSync(filePath, backupPath);

  // Read file content
  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove ITERATIVE IMPROVEMENTS sections
  // Match from "--- ITERATIVE IMPROVEMENTS" to next "---" line or end
  const regex = /---\s*ITERATIVE IMPROVEMENTS.*?(?=\n---|$)/gs;
  const cleanedContent = content.replace(regex, '').trim();

  // Write cleaned content back
  fs.writeFileSync(filePath, cleanedContent + '\n');

  console.log(`${GREEN}✓ Cleaned${RESET}`);
  cleanedCount++;
});

console.log('');
console.log(`${GREEN}=== Cleanup Complete ===${RESET}`);
console.log(`Files cleaned: ${cleanedCount}`);
console.log(`Backups saved to: ${backupDir}`);
console.log('');
console.log('To restore a file, run:');
console.log(`  cp ${backupDir}/filename original/path/filename`);
