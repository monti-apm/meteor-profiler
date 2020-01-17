Package.describe({
  "summary": "CPU Profiler for Meteor (used with Monti APM)",
  "version": "1.5.0",
  "git": "https://github.com/monti-apm/meteor-profiler.git",
  "name": "montiapm:profiler"
});

Package.onUse(function(api) {
  configurePackage(api);
});

Package.onTest(function(api) {
  configurePackage(api);
  api.use([
    'tinytest',
  ], ['client', 'server']);

});

function configurePackage(api) {
  api.versionsFrom('METEOR@1.4-beta.7');
  api.use('http');
  api.use('check');
  api.use('random');
  api.use('montiapm:agent@2.31.0');
  api.imply('montiapm:agent@2.31.0');
  api.use('montiapm:agent-binary-deps@2.0.0');

  api.add_files('lib/server.js', 'server');
  api.add_files('lib/client.js', 'client');
}
