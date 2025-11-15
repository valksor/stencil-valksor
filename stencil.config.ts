import { Config } from '@stencil/core';

export const config: Config = {
    namespace: 'valksor',
    outputTargets: [
        {
            type: 'dist',
            esmLoaderPath: '../loader',
        },
        {
            type: 'dist-custom-elements',
            customElementsExportBehavior: 'auto-define-custom-elements',
            externalRuntime: false,
        },
        {
            type: 'docs-readme',
        },
        {
            type: 'www',
            serviceWorker: null, // disable service workers
            copy: [
                { src: 'styles/index.min.css', dest: 'styles/index.min.css' },
                { src: 'favicon.ico', dest: 'favicon.ico' },
            ],
        },
    ],
    testing: {
        // The Chrome headless shell binary is only built for x64; use Chromium so ARM runners can execute tests
        browserHeadless: 'shell',
    },
    // Enable PostCSS processing for component CSS
    plugins: [
        // Stencil automatically uses postcss.config.js for all CSS processing
    ],
    buildEs5: 'prod',
    enableCache: true,
    cacheDir: '.cache',
    generateExportMaps: true,
    hashedFileNameLength: 16,
    minifyCss: true,
    minifyJs: true,
};
