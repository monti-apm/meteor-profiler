Package.describe({
  "summary": "CPU Profiler for Meteor (used with Monti APM)",
  "version": "1.6.0-beta.3",
  "git": "https://github.com/monti-apm/meteor-profiler.git",
  "name": "montiapm:profiler"
});

Package.onUse(function(api) {
  configurePackage(api);
});

Package.onTest(function(api) {
  configurePackage(api);
  api.use([
    'tinytest'
  ], ['client', 'server']);

  api.addFiles('test/helpers.js', 'server');
  api.addFiles('test/client.js', 'client');
  api.addFiles('test/server.js', 'server');
});

function configurePackage(api) {
  api.versionsFrom('METEOR@1.4');
  api.use('http@1.0.0||2.0.0-beta');
  api.use('check');
  api.use('random');
  api.export('MontiProfiler');
  api.use('montiapm:agent@2.43.0');
  api.imply('montiapm:agent@2.43.0');
  api.use('montiapm:agent-binary-deps@2.1.0');

  api.addFiles('lib/server.js', 'server');
  api.addFiles('lib/client.js', 'client');
}
