/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

var express = require('express');
var app = module.exports = express();
var record = require('../recordjs');

  var supportedComponents = {
    allergies: 'allergy',
    procedures: 'procedure',
    medications: 'medication',
    encounters: 'encounter',
    vitals: 'vital',
    results: 'result',
    socialhistories: 'social',
    immunizations: 'immunization',
    demographics: 'demographic',
    problems: 'problem'
  };

function getNotifications (callback) {

  //need new record count for my record, merge record count for updates, and sum for total updates.
  var newCount = 0;
  var newDone = false;
  var dupeCount = 0;
  var dupeDone = false;
  var fileCount = 0;
  var fileDone = false;
  var partialCount = 0;
  var partialDone = false;


  function checkDone() {
    if (newDone === true && partialDone === true && fileDone && dupeDone) {
      var recCount = {
        unreviewed_merges: partialCount,
        new_merges: newCount,
        duplicate_merges: dupeCount,
        file_count: fileCount,
      }
      callback(null, recCount);
    }
  }

  function getPartialCount(callback) {
    var secIteration = 0
    var secTotal = 0
    for (iComponent in supportedComponents) {
      secTotal++;
    }

    function checkCountComplete() {
      secIteration++;
      if (secIteration === secTotal) {
        partialDone = true;
        callback();
      }
    }

    for (var iSection in supportedComponents) {
      //console.log(supportedComponents[iSection]);
      record.matchCount(supportedComponents[iSection], {}, function(err, count) {
        if (err) {
          callback(err);
        } else {
          partialCount = partialCount + count;
          //console.log(unreviewedCount);
          checkCountComplete();
        }
      });
    }
  }

  getPartialCount(function(err) {
    checkDone();
  });

  function getNewMergeCount(callback) {
    var secIteration = 0
    var secTotal = 0
    for (iComponent in supportedComponents) {
      secTotal++;
    }

    function checkCountComplete() {
      secIteration++;
      if (secIteration === secTotal) {
        newDone = true;
        callback();
      }
    }

    for (var iSection in supportedComponents) {


      record.mergeCount(supportedComponents[iSection], {merge_reason: "new"}, function(err, count) {
        if (err) {
          callback(err);
        } else {
          newCount = newCount + count;
          checkCountComplete();
        }
      });

    }
  }

  getNewMergeCount(function(err) {
    checkDone();
  });

  function getDupeMergeCount(callback) {
    var secIteration = 0
    var secTotal = 0
    for (iComponent in supportedComponents) {
      secTotal++;
    }

    function checkCountComplete() {
      secIteration++;
      if (secIteration === secTotal) {
        dupeDone = true;
        callback();
      }
    }

    for (var iSection in supportedComponents) {
      record.mergeCount(supportedComponents[iSection], {merge_reason: "duplicate"}, function(err, count) {
        if (err) {
          callback(err);
        } else {
          dupeCount = dupeCount + count;
          checkCountComplete();
        }
      });
    }
  }

  getDupeMergeCount(function(err) {
    checkDone();
  });




  function getRecordCount(callback) {
    record.recordCount('test', function(err, count) {
      if (err) {
        callback(err);
      } else {
        fileCount = count;
        fileDone = true;
        checkDone();
      }
    });
  }

  getRecordCount(function(err) {
    checkDone();
  });

  /*record.mergeCount('allergy', {merge_reason: "new"}, function(err, count) {
    if (err) {
      callback(err);
    } else {
      newCount = count;
      checkDone();
    }
  });*/

  /*record.mergeCount('allergy', {merge_reason: "duplicate"}, function(err, count) {
    if (err) {
      callback(err);
    } else {
      dupeCount = count;
      checkDone();
    }
  });*/

}

app.get('/api/v1/notification', function(req, res) {

  getNotifications(function(err, notificationList) {
    if (err) {
      res.send(400, err);
    } else {
      var notificationJSON = {};
      notificationJSON.notifications = notificationList;
      res.send(notificationJSON);
    }

  });

});


