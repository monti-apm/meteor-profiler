Tinytest.addAsync(
  'profileCpu - local',
  function (test, done) {
    Meteor.call('test.enableLocalProfiling', true, afterEnabled);

    function afterEnabled() {
      Meteor.call('test.tempPath', (err, path) => {
        Kadira.profileCpu(2, path, 'local');
        setTimeout(() => {
          afterCreatedProfile(path);
        }, 2500);
      });
    }

    function afterCreatedProfile (path) {
      Meteor.call('test.checkFileExists', path, (err, result) => {
        test.equal(result, true);
        done();
      });
    }
  }
);
