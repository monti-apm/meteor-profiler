var fs = Npm.require('fs');
var os = Npm.require('os');
var path = Npm.require('path');

Meteor.methods({
  "kadira.profileCpu": profileMethodHandler,
  "monti.profileCpu": profileMethodHandler,
});

function profileMethodHandler (arg1, arg2, type) {
  check(arguments, [Match.Any]);
  this.unblock();

  if (type === 'remote') {
    if (!Kadira.connected) {
      throw new Meteor.Error("403", "You need to have the montiapm:agent connected");
    }
    return remoteProfileCPU(arg1, arg2);
  } else {
    return localProfileCPU(arg1, arg2);
  }
}

remoteProfileCPU = function(timeToProfileSecs, id) {
  // get the job and validate it
  var job = Kadira.Jobs.get(id);

  if(!job) {
    throw new Meteor.Error(403, "There is no such cpuProfile job: " + id);
  } else if(job.state != 'created') {
    throw new Meteor.Error(403, "CPU profile job has been already performed!");
  }

  try {
    console.log("Monti APM: Remote CPU profiling started for %s secs.", timeToProfileSecs);
    var cpuUsage = Kadira.models.system.currentCpuUsage;
    var jobData = {beforeCpu: cpuUsage};
    Kadira.Jobs.set(id, {state: 'initiated', data: jobData});

    var name = Random.id();
    var profile = getCpuProfile(name, timeToProfileSecs);
    console.log("Monti APM: Uploding the taken CPU profile.");
    Kadira.Jobs.set(id, {state: 'profile-taken'});

    uploadProfile(profile, job.data.uploadUrl);
    console.log("Monti APM: Profiling has been completed. Visit Monti APM to analyze it.");
    Kadira.Jobs.set(id, {state: 'completed'});

    return "CPU Profile has been completed. Check Monti APM to analyze it.";
  } catch(ex) {
    Kadira.Jobs.set(id, {state: 'errored', data:{errorMessage: ex.message}});
    throw ex;
  }
};

localProfileCPU = function(timeToProfileSecs, outputLocation) {
  if(!process.env.KADIRA_PROFILE_LOCALLY && !process.env.MONTI_PROFILE_LOCALLY) {
    throw new Meteor.Error(403, "run your app with `MONTI_PROFILE_LOCALLY` env variable to profile locally.")
  }

  var name = Random.id();
  if(!outputLocation) {
    outputLocation = path.resolve(os.tmpdir(), name + '.cpuprofile');
  }
  console.log('Monti APM: Started CPU profiling for %s secs.', timeToProfileSecs);
  var profile = getCpuProfile(name, timeToProfileSecs);

  console.log('Monti APM: Saving CPU profile to: ' + outputLocation);
  writeToDisk(outputLocation, profile);
  console.log('Monti APM: CPU profile saved.');

  return "Cpu profile has been saved to: " + outputLocation;
};

getCpuProfile = Kadira._wrapAsync(function(name, timeToProfileSecs, callback) {
  var v8Profiler = binaryRequire('v8-profiler-next');
  v8Profiler.startProfiling(name);
  setTimeout(function() {
    var profile = v8Profiler.stopProfiling(name);
    profile.export((err, result) => {
      if (err) {
        callback(err);
      }

      profile.delete();
      callback(null, result);
    });
  }, timeToProfileSecs * 1000);
});

writeToDisk = Kadira._wrapAsync(fs.writeFile);

function uploadProfile (profile, url) {
  return Kadira.coreApi._send(url, {
    data: profile,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(profile)
    },
    method: 'PUT',
  }).await();
}

function binaryRequire(moduleName) {
  if(typeof KadiraBinaryDeps != 'undefined') {
    return KadiraBinaryDeps.require(moduleName);
  } else {
    return Npm.require(moduleName);
  }
};

var configured = false;
var stop = null;
var INTERVAL = 1000 * 60

function createContinuousProfile(onProfile) {
  var v8Profiler = binaryRequire('v8-profiler-next');

  const startTime = new Date();
  const name = startTime.toString();

  if (!configured) {
    // 105 hertz in microseconds
    // On windows, if it is 100ms or lower, v8 will use 100% cpu
    // https://github.com/v8/v8/blob/dd1dbd99a6bd45f3b0eebc95e18f80d10ac388f3/src/profiler/cpu-profiler.cc#L246-L251
    v8Profiler.setSamplingInterval(1000 * 9.5);
    configured = true;
  }

  v8Profiler.startProfiling(name);

  var timeout = setTimeout(Meteor.bindEnvironment(() => {
    createContinuousProfile(onProfile);
    const profile = v8Profiler.stopProfiling(name);
    const endTime = new Date();
    profile.export((error, result) => {
      if (error) {
        console.error('Error when exporting CPU profile:');
        console.error(error);
        return;
      }
      profile.delete();
      onProfile({
        profile: result,
        startTime,
        endTime
      });
    });
  }), INTERVAL);

  stop = function () {
    clearTimeout(timeout);
    var profile = v8Profiler.stopProfiling(name);
    profile.delete();
  }
}

var running = false;

MontiProfiler = {
  startContinuous(_onProfile) {
    const onProfile = Meteor.bindEnvironment(_onProfile);
    if (running) {
      return false;
    }

    running = true;

    createContinuousProfile(onProfile);
    return true;
  },
  stopContinuous() {
    running = false;
    if (typeof stop === 'function') {
      stop();
      stop = null;
    }
  },

  // for tests
  __setInterval(interval) {
    INTERVAL = interval;
  }
}
