// eslint.config.js
const LitertEslintRules = require('@litert/eslint-plugin-rules');

module.exports = [
    {
        plugins: {
            '@litert/rules': LitertEslintRules,
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname,
            }
        },
    },
    ...LitertEslintRules.configs.typescript,
    {
        files: [
            'src/lib/**/*.ts',
        ]
    }
];
