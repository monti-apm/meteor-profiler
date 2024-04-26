# Change Log

### Next

* Drop support for Meteor 1.4 - 1.8.2
* Add support for Meteor 3
* Add remote heap snapshots
* 

### v1.6.3
March 16, 2022

* Support `MONTI_PROFILE_LOCALLY` env var in addition to `KADIRA_PROFILE_LOCALLY`
* Fixed broken links and updated screenshot in readme
* Fix race condition where job could start multiple times (requires the agent to be connected to an endpoint that returns the necessary information)

### v1.6.2
August 30, 2021

* Improve error message when taking remote profile and the agent is not connected
* Update `montiapm:agent` to 2.44.2 to fix uploading large remote profiles

### v1.6.1
July 20, 2021

* Update `montiapm:agent-binary-deps` to fix memory leak

### v1.6.0
June 9, 2021

* Add support for continuous profiling
* Fix compatibility with Meteor 2.3
* Remove dependency on HTTP package
* Fix error when getting cpu usage from montiapm:agent

### v1.5.0
January 16, 2020

* Updated for Meteor 1.9 by upgrading `montiapm:agent-binary-deps` to 2.0.0
* Fix profiling locally on Windows
* Updated `Kadira` references in logs to `Monti APM`
* Alias `monti.profileCpu` to `kadira.profileCpu`

### v1.4.0

* Updated for Meteor 1.5 by upgrading `montiapm:agent-binary-deps` to 1.6.0
* Renamed to `montiapm:profiler`

### v1.3.0

* Updated for Meteor 1.4 by upgrading kadira-binary-deps for 1.5.0

### v1.2.1

* Add random and check packages to support Meteor 1.2
