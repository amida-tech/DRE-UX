'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:BillingClaimsCtrl
 * @description
 * # BillingClaimsCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('BillingCtrl', function($scope, $location, $anchorScroll, claims, insurance, format, billing) {
    $scope.entryType = 'all';
    $scope.masterEntries = [];
    $scope.entries = [];
    $scope.updateDate = null;
    $scope.newComment = {
        'starred': false
    };

    function getUpdateDate() {
        //Should grab from files/update history.  Stubbed for now.
        $scope.updateDate = '12/1/2014';
    }
    $scope.setEntryType = function(type) {
        $scope.entryType = type;
        if (type === 'all') {
            $scope.entries = $scope.masterEntries;
        } else {
            $scope.entries = _.where($scope.masterEntries, {'category': type});
        }
    };

    function getData() {
        billing.getClaims().then(function(data) {
            _.each(data.claims, function(entry) {
                $scope.masterEntries.push({'data':entry, 'category':'claims'});
                
            });
        });
        billing.getInsurance().then(function(data) {
            _.each(data.payers, function(entry) {
                $scope.masterEntries.push({'data':entry, 'category':'insurance'});
                
            });
        });
        $scope.setEntryType('all');
    }
    getData();
    
});