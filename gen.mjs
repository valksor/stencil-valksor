import { promises as fs } from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');
const OUTPUT_FILE = path.join(SRC_DIR, 'index.html');

// crude-ish, but works for typical Stencil components
const COMPONENT_DECORATOR_REGEX = /@Component\s*\(\s*{[^}]*\btag\s*:\s*["'`]([^"'`]+)["'`][^}]*}\s*\)/g;

async function getAllFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(entry => {
            const res = path.resolve(dir, entry.name);
            return entry.isDirectory() ? getAllFiles(res) : res;
        }),
    );
    return files.flat();
}

async function extractTagsFromFile(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    const tags = [];
    let match;
    while ((match = COMPONENT_DECORATOR_REGEX.exec(content)) !== null) {
        tags.push(match[1]);
    }
    return tags;
}

async function findAllComponentTags() {
    let files = [];
    try {
        files = await getAllFiles(COMPONENTS_DIR);
    } catch (err) {
        console.error('Error reading components directory:', err);
        return [];
    }

    const tsxFiles = files.filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

    const allTags = new Set();

    for (const file of tsxFiles) {
        const tags = await extractTagsFromFile(file);
        tags.forEach(t => allTags.add(t));
    }

    return Array.from(allTags).sort();
}

function escapeHtmlAttribute(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function decodeHtmlAttribute(str) {
    return str
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&');
}

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function convertMarkdownToHtml(markdown) {
    if (!markdown) return '';

    return (
        markdown
            // Convert code blocks (inline)
            .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
            // Convert bold text
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            // Convert italic text
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            // Convert line breaks to <br>
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            // Wrap in paragraphs if not already wrapped
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
    );
}

async function parseComponentExamples() {
    try {
        const componentData = {};

        // Get all component directories
        const componentDirs = await fs.readdir(COMPONENTS_DIR, { withFileTypes: true });
        const dirs = componentDirs.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

        for (const componentDir of dirs) {
            const componentReadmePath = path.join(COMPONENTS_DIR, componentDir, 'readme.md');

            try {
                const readmeContent = await fs.readFile(componentReadmePath, 'utf8');
                const parsedData = extractExamplesFromReadme(readmeContent);

                // Store all component data (description, usage notes, examples)
                componentData[componentDir] = parsedData;
            } catch (err) {
                // Component readme doesn't exist or can't be read - skip
                console.debug(`No readme found for component: ${componentDir}`);
            }
        }

        return componentData;
    } catch (err) {
        console.warn('Could not parse component examples:', err.message);
        return {};
    }
}

function extractExamplesFromReadme(readmeContent) {
    const examples = [];
    let description = '';
    let usageNotes = '';

    // Extract description from the intro paragraph (between title and first ## section)
    const descriptionMatch = readmeContent.match(/^#[^\n]+\n\n([\s\S]*?)(?=\n## |$)/);
    if (descriptionMatch) {
        description = descriptionMatch[1].trim();
    }

    // Extract usage notes from the Usage Notes section, stopping before any ### subsections or next ##
    const usageNotesMatch = readmeContent.match(/## Usage Notes\s*\n([\s\S]*?)(?=\n### |\n## |\n<!-- Auto Generated Below|$)/);
    if (usageNotesMatch) {
        usageNotes = usageNotesMatch[1].trim();
        // Clean up usage notes - remove excessive whitespace and format lists better
        usageNotes = usageNotes
            .replace(/^\s*[-*]\s+/gm, '• ') // Normalize list items
            .replace(/\n{3,}/g, '\n\n') // Reduce excessive line breaks
            .trim();
    }

    // Find the Examples section
    const examplesSectionMatch = readmeContent.match(/## Examples\s*\n([\s\S]*?)(?=\n## |\n<!-- Auto Generated Below|$)/);

    if (examplesSectionMatch) {
        const examplesSection = examplesSectionMatch[1];

        // Extract individual examples using a pattern that captures title and code block
        const examplePattern = /###? ([^\n]+)\s*\n[\s\S]*?```html\s*\n([\s\S]*?)```/g;
        let match;

        while ((match = examplePattern.exec(examplesSection)) !== null) {
            const title = match[1].trim();
            const code = match[2].trim();

            if (title && code) {
                examples.push({
                    title,
                    code,
                    html: code, // Use same code for HTML preview
                });
            }
        }
    }

    return {
        description,
        usageNotes,
        examples,
    };
}

function createHtml(tags, componentInfo = {}, componentExamples = {}) {
    if (tags.length === 0) {
        return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>No Components Found</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.min.css" />
    <link rel="icon" href="favicon.ico">
  </head>
  <body class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">No Components Found</h1>
        <p class="text-gray-600">No components found in <code class="bg-gray-100 px-2 py-1 rounded">src/components</code>.</p>
      </div>
    </div>
  </body>
</html>`;
    }

    const componentsHtml = tags
        .map(tag => {
            const componentData = componentInfo[tag] || {};
            const description = componentData.description || '';
            const usageNotes = componentData.usageNotes || '';
            const examples = componentData.examples || [
                {
                    title: 'Default',
                    html: `<${tag}></${tag}>`,
                    code: `<${tag}></${tag}>`,
                },
            ];

            // Ensure HTML property for each example
            examples.forEach(example => {
                example.html = example.html || example.code;
            });

            return `
      <div class="component-card bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
              <code class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1 rounded text-lg transition-colors">&lt;${tag}&gt;</code>
            </h2>
            <button
              onclick="copyToClipboard('${tag}')"
              class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
              title="Copy tag name"
            >
              Copy
            </button>
          </div>

          ${
              description
                  ? `
          <div class="mb-4">
            <p class="text-gray-700 dark:text-gray-300 transition-colors">${escapeHtml(description)}</p>
            ${usageNotes ? `<div class="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors">${convertMarkdownToHtml(usageNotes)}</div>` : ''}
          </div>
          `
                  : ''
          }

          <div class="space-y-4">
            ${examples
                .map((example, index) => {
                    const exampleId = `${tag}-${example.title.toLowerCase().replace(/\s+/g, '-')}`;
                    return `
              <div class="example-section">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 transition-colors">${example.title}</h3>

                <div class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-3 flex items-center justify-center min-h-[60px] transition-colors">
                  ${example.html}
                </div>

                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <button
                      onclick="toggleCode('${exampleId}')"
                      class="text-xs bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded transition-colors flex items-center space-x-1"
                      title="Toggle code display"
                    >
                      <svg id="${exampleId}-chevron" class="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <span id="${exampleId}-text">Show Code</span>
                    </button>
                    <button
                      onclick="copyCode('${exampleId}')"
                      class="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
                      title="Copy code"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>

                <div id="${exampleId}-container" class="hidden">
                  <pre class="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm transition-all duration-200"><code id="${exampleId}" data-code="${escapeHtmlAttribute(example.code)}"></code></pre>
                </div>
              </div>
            `;
                })
                .join('')}
          </div>
        </div>
      </div>`;
        })
        .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Valksor Component Library</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/styles/index.min.css" />
    <script type="module" src="/build/valksor.esm.js"></script>
    <script nomodule src="/build/valksor.js"></script>
    <link rel="icon" href="favicon.ico">
    </head>
  <body class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Valksor Component Library</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2 transition-colors">Interactive preview of available web components</p>
          </div>
          <div class="flex items-center space-x-4">
            <input
              type="text"
              id="searchInput"
              placeholder="Search components..."
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
              onkeyup="filterComponents()"
            />
            <button
              id="darkModeToggle"
              onclick="toggleDarkMode()"
              class="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              Dark Mode
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 transition-colors">
          <h2 class="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2 transition-colors">Welcome to Valksor Components</h2>
          <p class="text-blue-800 dark:text-blue-200 transition-colors">
            This interactive showcase demonstrates all available components. Each card shows different usage examples
            with live previews and ready-to-copy code snippets.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8">
        ${componentsHtml}
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="text-center text-gray-600 dark:text-gray-400 transition-colors">
          <p>Generated with ❤️ by Valksor • <span id="componentCount">${tags.length}</span> component(s) available</p>
        </div>
      </div>
    </footer>

    <script>
      // Dark mode functionality
      function toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        const button = document.getElementById('darkModeToggle');
        const isDark = document.documentElement.classList.contains('dark');
        button.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        localStorage.setItem('darkMode', isDark);
      }

      // Load dark mode preference
      if (localStorage.getItem('darkMode') === 'true') {
        toggleDarkMode();
      }

      // HTML decoding utility
      function decodeHtmlAttribute(str) {
        return str
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&');
      }

      // Copy to clipboard functionality
      function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('Copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy: ', err);
          showToast('Failed to copy');
        });
      }

      function copyCode(elementId) {
        const codeElement = document.getElementById(elementId);
        const text = codeElement.dataset.code ? decodeHtmlAttribute(codeElement.dataset.code) : codeElement.textContent;
        copyToClipboard(text);
      }

      // Toggle code display functionality
      function toggleCode(exampleId) {
        const container = document.getElementById(exampleId + '-container');
        const chevron = document.getElementById(exampleId + '-chevron');
        const text = document.getElementById(exampleId + '-text');
        const codeElement = document.getElementById(exampleId);

        const isHidden = container.classList.contains('hidden');

        if (isHidden) {
          // Ensure the code element displays the stored source code
          if (codeElement && codeElement.dataset.code) {
            codeElement.textContent = decodeHtmlAttribute(codeElement.dataset.code);
          }

          container.classList.remove('hidden');
          chevron.style.transform = 'rotate(180deg)';
          text.textContent = 'Hide Code';
          localStorage.setItem('code-' + exampleId, 'visible');
        } else {
          container.classList.add('hidden');
          chevron.style.transform = 'rotate(0deg)';
          text.textContent = 'Show Code';
          localStorage.setItem('code-' + exampleId, 'hidden');
        }
      }

      // Restore code visibility states from localStorage
      function restoreCodeStates() {
        const codeContainers = document.querySelectorAll('[id$="-container"]');
        codeContainers.forEach(container => {
          const exampleId = container.id.replace('-container', '');
          const savedState = localStorage.getItem('code-' + exampleId);

          if (savedState === 'visible') {
            const chevron = document.getElementById(exampleId + '-chevron');
            const text = document.getElementById(exampleId + '-text');

            container.classList.remove('hidden');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
            if (text) text.textContent = 'Hide Code';
          }
        });
      }

      // Toast notification
      function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
        toast.textContent = message;
        toast.style.opacity = '0';

        document.body.appendChild(toast);

        setTimeout(() => {
          toast.style.opacity = '1';
        }, 100);

        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 300);
        }, 2000);
      }

      // Search/filter functionality
      function filterComponents() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const cards = document.querySelectorAll('.component-card');

        cards.forEach(card => {
          const text = card.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      }

      // Initialize
      document.addEventListener('DOMContentLoaded', () => {
        console.log('Valksor Component Library loaded successfully');
        restoreCodeStates();
      });
    </script>
  </body>
</html>`;
}

async function run() {
    console.log('Generating src/index.html from Stencil components...');
    console.log('Parsing component data from component readmes...');

    const [tags, componentData] = await Promise.all([findAllComponentTags(), parseComponentExamples()]);

    console.log(`Found ${tags.length} components:`, tags);
    console.log(`Parsed data for ${Object.keys(componentData).length} components from component readmes`);

    const html = createHtml(tags, componentData, componentData);
    await fs.writeFile(OUTPUT_FILE, html, 'utf8');
    console.log(`Generated enhanced ${OUTPUT_FILE} with Tailwind styling and interactive features`);
}

run().catch(err => {
    console.error('Failed to generate index.html:', err);
    process.exit(1);
});
