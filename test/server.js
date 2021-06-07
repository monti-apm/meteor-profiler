Tinytest.addAsync(
  'MontiProfiler - continuous profiler',
  function (test, done) {
    var start = Date.now();
    var profiles = 0;

    MontiProfiler.__setInterval(1000 * 2);
    MontiProfiler.startContinuous((profile) => {
      profiles += 1;
      var diff = Date.now() - start;
      var within = diff > 1900 && diff < 2200;
      test.equal(within, true);

      test.equal(typeof profile.profile, 'string');
      test.equal(profile.startTime instanceof Date, true);
      test.equal(profile.endTime instanceof Date, true);
      
      if (profiles === 2) {
        MontiProfiler.stopContinuous();
        done();
      } else {
        start = Date.now();
      }
    });
  }
);
