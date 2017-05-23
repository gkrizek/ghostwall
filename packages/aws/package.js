Package.describe({
  summary: "Amazon Web Services SDK for Meteor",
  version: '0.0.1',
  name: 'gkrizek:aws',
  git: 'https://github.com/gkrizek/aws.git'
});

Npm.depends({
  'aws-sdk': '2.6.6'
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@1.4');
  api.use(['underscore']);

  api.export('AWS');

  api.addFiles([
    'server.js'
  ], 'server');

  api.addFiles([
    'aws-sdk.min.js',
    'client.js'
  ], 'client');
});