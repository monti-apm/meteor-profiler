Kadira.profileCpu = function(arg1, arg2, type) {
  console.log("Monti APM: Profiling has been started. Check server logs.");
  Meteor.call('monti.profileCpu', arg1, arg2, type, function(err, res) {
    if(err) {
      console.error("Monti APM: CPU profiling attempt failed: " + err.message);
    } else {
      console.log("Monti APM: " + res);
    }
  });
};
