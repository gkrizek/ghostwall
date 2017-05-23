Package.describe({
  name: 'gkrizek:spin',
  summary: 'Simple spinner package for Meteor',
  version: '2.3.1',
  git: 'https://github.com/sachag/meteor-spin'
});

Npm.depends({
});

Package.onUse(function (api, where) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']);
  api.use([
    'templating',
    'underscore'
  ], 'client');

  api.addFiles([
    'lib/spinner.html',
    'lib/spinner.css',
    'lib/spinner.js',
    'lib/spin.js'
  ], 'client');
});
