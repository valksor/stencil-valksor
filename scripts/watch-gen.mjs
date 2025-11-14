#!/usr/bin/env bun

import { watch } from 'fs';
import { exec } from 'child_process';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.dirname(__dirname);
const SRC_DIR = path.join(ROOT_DIR, 'src');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');
const GEN_SCRIPT = path.join(ROOT_DIR, 'gen.mjs');

let timeout = null;

function runGen() {
    console.log('🔄 Running gen.mjs...');
    const startTime = Date.now();

    exec(`bun "${GEN_SCRIPT}"`, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error running gen.mjs:', error.message);
            return;
        }
        if (stderr) {
            console.error('⚠️  gen.mjs stderr:', stderr);
        }

        const duration = Date.now() - startTime;
        console.log(`✅ gen.mjs completed in ${duration}ms`);
        if (stdout) {
            console.log('📄 Output:', stdout.trim());
        }
    });
}

function debounceGen() {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(runGen, 200);
}

function shouldWatchFile(filePath) {
    // Skip the generated HTML file to prevent infinite loop
    if (filePath.endsWith('index.html')) {
        return false;
    }

    // Watch for component files
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        return filePath.includes('components/');
    }

    // Watch for README files
    if (filePath.endsWith('.md')) {
        // Component readmes
        if (filePath.includes('components/')) {
            return true;
        }
        // Root readme
        if (filePath.endsWith('readme.md') || filePath.endsWith('README.md')) {
            return filePath === path.join(ROOT_DIR, 'readme.md') || filePath === path.join(ROOT_DIR, 'README.md');
        }
    }

    return false;
}

console.log('👀 Starting file watcher for gen.mjs...');
console.log('📁 Watching:', COMPONENTS_DIR);
console.log('📄 Watching:', path.join(ROOT_DIR, 'readme.md'));
console.log('⏳ Waiting for file changes...\n');

// Initial run
runGen();

// Watch components directory recursively
const watcher = watch(COMPONENTS_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;

    const fullPath = path.join(COMPONENTS_DIR, filename);

    if (shouldWatchFile(fullPath)) {
        console.log(`📝 File changed: ${filename} (${eventType})`);
        debounceGen();
    }
});

// Watch root readme.md
const readmePath = path.join(ROOT_DIR, 'readme.md');
const readmeWatcher = watch(readmePath, (eventType, filename) => {
    console.log(`📖 README.md changed (${eventType})`);
    debounceGen();
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n👋 Stopping watcher...');
    watcher.close();
    readmeWatcher.close();
    if (timeout) {
        clearTimeout(timeout);
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Stopping watcher...');
    watcher.close();
    readmeWatcher.close();
    if (timeout) {
        clearTimeout(timeout);
    }
    process.exit(0);
});
