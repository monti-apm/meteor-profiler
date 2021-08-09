Kadira.profileCpu = function (arg1, arg2, type) {

  Meteor.call('monti.profileCpu', arg1, arg2, type, function (err, res) {
    if (err) {
      console.error("Monti APM: CPU profiling attempt failed: " + err.message);
    } else {
      console.log("Monti APM: Profiling has been started. Check server logs.");

      console.log("Monti APM: " + res);
    }
  });
};
