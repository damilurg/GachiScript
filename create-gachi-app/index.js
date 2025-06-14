#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectName = process.argv[2] || 'gachi-app';
const templateDir = path.join(__dirname, 'template');

fs.cpSync(templateDir, projectName, { recursive: true });

console.log('📦 Устанавливаем зависящие жопы...');
execSync('npm install', { cwd: projectName, stdio: 'inherit' });

console.log(`✅ Gachi App установлен в папку ${projectName}`);
console.log(`\n🚀 Запуск:`);
console.log(`cd ${projectName}`);
console.log(`npm run dev`);
