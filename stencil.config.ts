import { Config } from '@stencil/core';

export const config: Config = {
    namespace: 'valksor',
    globalStyle: 'src/styles/components.min.css',
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
                // copy demo.css into the built www folder
                { src: 'styles/index.min.css', dest: 'styles/index.min.css' },
            ],
        },
    ],
    testing: {
        // The Chrome headless shell binary is only built for x64; use Chromium so ARM runners can execute tests
        browserHeadless: 'chromium',
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
