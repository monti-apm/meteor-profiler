var fs = Npm.require('fs');
var os = Npm.require('os');
var path = Npm.require('path');

TestHelpers = {
  tempPath() {
    return path.resolve(os.tmpdir(), `meteor-profile-${Date.now()}-${Math.random()}.txt`);
  },
  fileExists(filePath) {
    return fs.existsSync(filePath);
  }
}

Meteor.methods({
  'test.tempPath': TestHelpers.tempPath,
  'test.checkFileExists': TestHelpers.fileExists,
  'test.enableLocalProfiling' (enabled) {
    process.env.KADIRA_PROFILE_LOCALLY = enabled ? 'true' : 'false';
  }
});
