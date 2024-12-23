Package.describe({
  "summary": "CPU Profiler for Meteor (used with Monti APM)",
  "version": "1.7.0-beta.3",
  "git": "https://github.com/monti-apm/meteor-profiler.git",
  "name": "montiapm:profiler"
});

Package.onUse(function(api) {
  configurePackage(api);
});

Package.onTest(function(api) {
  configurePackage(api);
  api.use([
    'tinytest@1.1.0||2.0.0-rc300.0'
  ], ['client', 'server']);

  api.addFiles('test/helpers.js', 'server');
  api.addFiles('test/client.js', 'client');
  api.addFiles('test/server.js', 'server');
});

function configurePackage(api) {
  api.versionsFrom('METEOR@1.9');
  api.use('check');
  api.use('random');
  api.use('ecmascript');
  api.export('MontiProfiler');
  api.use('montiapm:agent@2.44.2||3.0.0-beta.4');
  api.imply('montiapm:agent@2.44.2||3.0.0-beta.4');
  api.use('montiapm:agent-binary-deps@3.0.0');

  api.addFiles('lib/server.js', 'server');
  api.addFiles('lib/client.js', 'client');
}
