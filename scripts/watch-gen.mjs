import { exec } from 'child_process';
import path from 'path';
import url from 'url';
import chokidar from 'chokidar';

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
    // Increased timeout since chokidar with awaitWriteFinish ensures write completion
    timeout = setTimeout(runGen, 500);
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

    // Watch for ALL README files - fix case sensitivity issue
    if (filePath.endsWith('.md')) {
        // Component readmes (handle both readme.md and README.md)
        if (filePath.includes('components/')) {
            return true;
        }

        // Root readme (handle both cases)
        const rootReadmeLower = path.join(ROOT_DIR, 'readme.md');
        const rootReadmeUpper = path.join(ROOT_DIR, 'README.md');

        if (filePath === rootReadmeLower || filePath === rootReadmeUpper) {
            return true;
        }
    }

    return false;
}

console.log('👀 Starting chokidar file watcher for gen.mjs...');
console.log('📁 Watching:', COMPONENTS_DIR);
console.log('📄 Watching:', path.join(ROOT_DIR, 'readme.md'));
console.log('⏳ Waiting for file changes...\n');

// Initial run
runGen();

// Setup chokidar watcher with single path for simplicity
const watcher = chokidar.watch(COMPONENTS_DIR, {
    ignoreInitial: true, // Don't trigger on initial scan
    persistent: true,
});

// Debug: Log what we're watching
console.log('🎯 Watching directory:', COMPONENTS_DIR);

// Handle all inotify-like events with debug logging
watcher.on('all', (event, filePath) => {
    // Debug: Log ALL events first
    console.log(`🔍 DEBUG: Event: ${event}, Path: ${filePath}`);

    // Check if file should be processed
    const shouldProcess = shouldWatchFile(filePath);
    console.log(`🔍 DEBUG: shouldWatchFile(${filePath}) = ${shouldProcess}`);

    if (shouldProcess) {
        console.log(`📝 Event: ${event.toUpperCase()}, File: ${path.relative(ROOT_DIR, filePath)}`);

        // Run gen.mjs on more event types to catch everything
        if (event === 'change' || event === 'add') {
            console.log('✍️  File write completed, triggering gen.mjs...');
            debounceGen();
        } else if (event === 'unlink') {
            console.log('🗑️  File deleted, triggering gen.mjs...');
            debounceGen();
        } else {
            console.log(`🔄 Other event type (${event}), triggering gen.mjs...`);
            debounceGen();
        }
    }
});

// Add ready event to confirm watching is working
watcher.on('ready', () => {
    console.log('✅ Chokadar watcher is ready and watching for changes');
});

watcher.on('error', error => {
    console.error('❌ Watcher error:', error);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n👋 Stopping chokidar watcher...');
    if (timeout) {
        clearTimeout(timeout);
    }
    watcher.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Stopping chokidar watcher...');
    if (timeout) {
        clearTimeout(timeout);
    }
    watcher.close();
    process.exit(0);
});
