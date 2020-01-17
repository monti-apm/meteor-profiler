var fs = Npm.require('fs');
var os = Npm.require('os');
var path = Npm.require('path');

Meteor.methods({
  "kadira.profileCpu": function(arg1, arg2, type) {
    check(arguments, [Match.Any]);
    this.unblock();
    if(type == 'remote') {
      return remoteProfileCPU(arg1, arg2);
    } else {
      return localProfileCPU(arg1, arg2);
    }
  }
});

remoteProfileCPU = function(timeToProfileSecs, id) {
  // get the job and validate it
  var job = Kadira.Jobs.get(id);

  if(!job) {
    throw new Meteor.Error(403, "There is no such cpuProfile job: " + id);
  } else if(job.state != 'created') {
    throw new Meteor.Error(403, "CPU profile job has been already performed!");
  }

  try {
    console.log("Kadira: Remote CPU profiling started for %s secs.", timeToProfileSecs);
    var usage = Kadira.models.system.getUsage() || {};
    var jobData = {beforeCpu: usage.cpu};
    Kadira.Jobs.set(id, {state: 'initiated', data: jobData});

    var name = Random.id();
    var profile = getCpuProfile(name, timeToProfileSecs);
    console.log("Kadira: Uploding the taken CPU profile.");
    Kadira.Jobs.set(id, {state: 'profile-taken'});

    uploadProfile(profile, job.data.uploadUrl);
    console.log("Kadira: Profiling has been completed. Visit Kadira UI to analyze it.");
    Kadira.Jobs.set(id, {state: 'completed'});

    return "CPU Profile has been completed. Check Kadira UI to analyze it.";
  } catch(ex) {
    Kadira.Jobs.set(id, {state: 'errored', data:{errorMessage: ex.message}});
    throw ex;
  }
};

localProfileCPU = function(timeToProfileSecs, outputLocation) {
  if(!process.env.KADIRA_PROFILE_LOCALLY) {
    throw new Meteor.Error(403, "run your app with `KADIRA_PROFILE_LOCALLY` env variable to profile locally.")
  }

  var name = Random.id();
  if(!outputLocation) {
    outputLocation = path.resolve(os.tmpdir(), name + '.cpuprofile');
  }
  console.log('Kadira: Started CPU profiling for %s secs.', timeToProfileSecs);
  var profile = getCpuProfile(name, timeToProfileSecs);

  console.log('Kadira: Saving CPU profile to: ' + outputLocation);
  writeToDisk(outputLocation, profile);
  console.log('Kadira: CPU profile saved.');

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
  var headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(profile)
  };
  return HTTP.put(url, {content: profile, headers: headers});
}

function binaryRequire(moduleName) {
  if(typeof KadiraBinaryDeps != 'undefined') {
    return KadiraBinaryDeps.require(moduleName);
  } else {
    return Npm.require(moduleName);
  }
};
