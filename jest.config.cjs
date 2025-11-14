require('./test/stencil-jest-patch');

const { getJestPreset } = require('@stencil/core/testing');

const stencilPreset = getJestPreset();

const transform = {
    ...stencilPreset.transform,
    '^.+\\.(ts|tsx|jsx|css|mjs)$': '<rootDir>/test/stencil-jest-preprocessor.js',
};

module.exports = {
    ...stencilPreset,
    testEnvironment: '<rootDir>/test/stencil-jest-environment.js',
    setupFiles: ['<rootDir>/test/jasmine-shim.js', ...(stencilPreset.setupFiles || [])],
    transform,
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/www/'],
};
