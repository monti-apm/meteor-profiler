Package.describe({
  "summary": "CPU Profiler for Meteor (used with Monti APM)",
  "version": "1.6.1",
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
  api.use('check');
  api.use('random');
  api.export('MontiProfiler');
  api.use('montiapm:agent@2.44.2');
  api.imply('montiapm:agent@2.44.2');
  api.use('montiapm:agent-binary-deps@2.1.1');

  api.addFiles('lib/server.js', 'server');
  api.addFiles('lib/client.js', 'client');
}
