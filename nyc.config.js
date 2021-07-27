// eslint-disable-next-line import/no-extraneous-dependencies
const config = require('@dwp/nyc-config-base');

config.lines = 80;
config.statements = 80;
config.functions = 80;
config.branches = 80;

config['per-file'] = false;

config.exclude = config.exclude || [];

config.reporter = [
  'cobertura',
  'lcov',
  'text',
];

config.exclude.push(
  'routes/user-router.js',
  'bootstrap/**/*',
);

config.include = [
  'lib/**/*',
  'utils/**/*',
  'middleware/**/*',
  'routes/**/*',
];

module.exports = config;
