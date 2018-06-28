/* global angular, dhis2 */

'use strict';

/* Services */

var exportServices = angular.module('exportServices', ['ngResource'])


/* current selections */
.service('PeriodService', function(){
    
    this.getPeriods = function(periodType){
        var pt = new PeriodType();
        var d2Periods = pt.get(periodType).generatePeriods({offset: 0, filterFuturePeriods: false, reversePeriods: false});     
        return d2Periods;
    };
})

/* current selections */
.service('CurrentSelection', function(){
    this.currentSelections = '';
    
    this.set = function(currentSelections){  
        this.currentSelections = currentSelections;        
    };    
    this.get = function(){
        return this.currentSelections;
    };
})

/*Orgunit service for local db */
.service('OrgUnitService', function($window, $q){
    
    var indexedDB = $window.indexedDB;
    var db = null;
    
    var open = function(){
        var deferred = $q.defer();
        
        var request = indexedDB.open("dhis2ou");
        
        request.onsuccess = function(e) {
          db = e.target.result;
          deferred.resolve();
        };

        request.onerror = function(){
          deferred.reject();
        };

        return deferred.promise;
    };
    
    var get = function(uid){
        
        var deferred = $q.defer();
        
        if( db === null){
            deferred.reject("DB not opened");
        }
        else{
            var tx = db.transaction(["ou"]);
            var store = tx.objectStore("ou");
            var query = store.get(uid);
                
            query.onsuccess = function(e){
                if(e.target.result){
                    deferred.resolve(e.target.result);
                }
                else{
                    var t = db.transaction(["ouPartial"]);
                    var s = t.objectStore("ouPartial");
                    var q = s.get(uid);
                    q.onsuccess = function(e){
                        deferred.resolve(e.target.result);
                    };
                }            
            };
        }
        return deferred.promise;
    };
    
    return {
        open: open,
        get: get
    };    
});