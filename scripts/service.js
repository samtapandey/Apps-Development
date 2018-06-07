/* global angular, dhis2 */

'use strict';

/* Services */

var reportServices = angular.module('reportServices', ['ngResource'])

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
})


// service for generate uid in application

.service('GenerateUidService',  function ($http){
    return {
        getUid: function () {
            var promise = $http.get('../../system/id.json&paging=false').then(function (response) {
                return response.data ;
            });
            return promise;
        }
    };
})



// service for get all userGroup name and uid
.service('UserGroupService',  function ($http){
        return {
            getAllUserGroup: function () {
                var promise = $http.get('../../userGroups.json?fields=[id,name]&paging=false').then(function (response) {
                    return response.data ;
                });
                return promise;
            }
        };
})


// service for get all Resource name and uid
.service('ResourceService',  function ($http){
    return {
        getAllResource: function () {
            var promise = $http.get('../../documents.json?fields=[id,name]&paging=false').then(function (response) {
                return response.data ;
            });
            return promise;
        }
    };
})

    .service('organisationUnitGroupService',  function ($http){
        return {
            getAll: function () {
                var promise = $http.get('../../organisationUnitGroups?fields=[id,name]&paging=false').then(function (response) {
                    return response.data ;
                });
                return promise;
            },
            getOuGroupsByOu: function(ouUid){
                var promise = $http.get('../../organisationUnits/'+ouUid+'.json?fields=id,name,organisationUnitGroups[id,name]').then(function (response) {
                    return response.data ;
                });
                return promise;
            }
        };
    })
	
	
	

    .service('DataSetService',  function ($http){
        return {
            getAllDataSet: function () {
                var promise = $http.get('../../dataSets.json?fields=id,name,attributeValues[attribute[id]]&paging=false').then(function (response) {
                    return response.data ;
                });
                return promise;
            },
            getDataSetPeriodTypeAndSource: function( dataSetUid ){
                if( dataSetUid != "" ){
                    var promise = $http.get( '../../dataSets.json?filter=id:eq:' + dataSetUid + '&fields=id,name,periodType,organisationUnits[id,name]&paging=false' ).then(function(response){
                        return response.data ;
                    });
                }
                return promise;
            }
        };
    })


    .service('OrganisationUnitService',  function ($http){
        return {
            getOrgUnitNameAndLevelByUid: function ( orgUnitUid ) {
                if( orgUnitUid != "" ) {
                    var promise = $http.get('../../organisationUnits.json?filter=id:eq:' + orgUnitUid + '&fields=id,name,level&paging=false').then(function (response) {
                        return response.data;
                    });
                }
                return promise;
            },

            getOrganisationUnitLevelLength: function(){
                var promise = $http.get( '../../organisationUnitLevels.json?paging=false' ).then(function(response){
                    return response.data ;
                });
                return promise;
            },

            getAllChildren: function( orgUnitUid ){
                if( orgUnitUid != "" ){
                    var promise = $http.get( '../../organisationUnits.json?filter=id:eq:' + orgUnitUid + '&fields=id,name,children[id,name,children[id,name]]&paging=false' ).then(function(response){
                        return response.data ;
                    });
                }
                return promise;
            },

            getAllChildrenOfSelectedOrgUnit: function( orgUnitUid ){
                if( orgUnitUid != "" ){
                    var promise = $http.get( '../../organisationUnits/'+orgUnitUid+'.json?includeDescendants=true&fields=id,name&paging=false' ).then(function(response){
                        return response.data ;
                    });
                }
                return promise;
            }
        };
    })
//save delete get report Configuration parameters
.service('ReportConfigurationService',  function ($http){
    return {
        getAllReportConfiguration: function () {
            var promise = $http.get('../../systemSettings/reportApp-configuration-json').then(function (response) {
                return response.data ;
            });
            return promise;
        },

        saveReportConfiguration: function (configuration) {
            var reportConfigurationJson = JSON.stringify(configuration);
            var promise = $http.post('../../systemSettings/reportApp-configuration-json' + reportConfiguration, {headers: {'Content-Type': 'text/plain;charset=utf-8'}}).then(function (response) {
                return response.data;
            });
            return promise;
        },
        deleteReportConfiguration: function(){
            var promise = $http.delete('../../systemSettings/reportApp-configuration-json').then(function (response) {
                return response.data ;
            });
            return promise;
        }
    };
})


    .service('userService',  function ($http){
        return {
            getCurrentUser: function () {
                var promise = $http.get('../../me.json?fields=id,name,userCredentials[*,userRoles[*]],userGroups[id,name]&paging=false').then(function (response) {
                    return response.data ;
                });
                return promise;
            },

            getUsersByUserGroup: function(userGroupUid){
                if(  userGroupUid != "" ){
                    var promise = $http.get( '../../userGroups.json?filter=id:eq:' + userGroupUid + '&fields=id,name,users[id,name]&paging=false' ).then(function(response){
                        return response.data ;
                    });
                }
                return promise;
            },
            isUserInUserGroup: function(currentUserUid,users){
                var returnVariable = false;
                angular.forEach(users,function(user){
                    if(user.id === currentUserUid){
                        returnVariable = true;
                    }

                })
                return returnVariable;
            }
        };
    })
    .service('MetadataService',function(){
        return {
            getSQLView : function(sqlViewUID,param){
                var def = $.Deferred();
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json",
                    url: "../../sqlViews.json?fields=[id,name]&paging=false",
                    success: function (data) {
                        def.resolve(data);
                    }
                });
                return def;
            },
 
        }
     
     })
     .service('sqlviewservice',  function ($http){
        return {
            getAll: function () {
                var promise = $http.get('../../sqlViews.json?fields=[id,name]&paging=false').then(function (response) {
		
                    return response.data ;
                });
                return promise;
            }
         
        };
    })
    .service('periodService',  function ($http){
        return {
            getLast12Months: function () {

                var list = [
                            {
                                "id": "201501",
                                "name": "Jan 2015"
                            }
                            ];
                return list;
            },
            getMonthList : function() {

                var list = [
                    {
                        "name": "Jan",
                        "id": "01"
                    },
                    {
                        "name": "Feb",
                        "id": "02"
                    },
                    {
                        "name": "Mar",
                        "id": "03"
                    },
                    {
                        "name": "Apr",
                        "id": "04"
                    },
                    {
                        "name": "May",
                        "id": "05"
                    },
                    {
                        "name": "Jun",
                        "id": "06"
                    },
                    {
                        "name": "Jul",
                        "id": "07"
                    },
                    {
                        "name": "Aug",
                        "id": "08"
                    },
                    {
                        "name": "Sep",
                        "id": "09"
                    },
                    {
                        "name": "Oct",
                        "id": "10"
                    },
                    {
                        "name": "Nov",
                        "id": "11"
                    },
                    {
                        "name": "Dec",
                        "id": "12"
                    }
                ]
                return list;
            },
            getYearListBetweenTwoYears: function(startYear,EndYear){
                var list=[];

                for (EndYear;EndYear > startYear;EndYear--){
                    list.push(EndYear);
                }

                return list;
            },

            getPeriodListBetweenTwoDates: function(periodType,startPeriod,endPeriod){
                var periodList=[];
                //var periodsStr = "";
                if( periodType === "Monthly")
                {
                    var startYear = startPeriod.substring(0,4);
                    var startMonth = startPeriod.substring(4,6);

                    var endYear = endPeriod.substring(0,4);
                    var endMonth = endPeriod.substring(4,6);

                    var firstDayOfStartPeriod = new Date( startYear + "-" + startMonth + "-01" );

                    var selectedEndPeriod = new Date( endYear + "-" + endMonth + "-01" );
                    var lastDayOfSelEndPeriod = new Date(selectedEndPeriod.getFullYear(), selectedEndPeriod.getMonth() + 1, 0);

                    while(firstDayOfStartPeriod <= lastDayOfSelEndPeriod)
                    {
                        var month = firstDayOfStartPeriod.getMonth() + 1;
                        month = ( month  ) > 9 ?  month : "0"+ month;

                        var period = firstDayOfStartPeriod.getFullYear() + "" + month;

                        periodList.push( period );

                        firstDayOfStartPeriod.setMonth( firstDayOfStartPeriod.getMonth() + 1 );
                    }
                }

                else if( periodType === "Quarterly")
                {
                    var startYear = startPeriod.substring(0,4);
                    var startMonth = startPeriod.substring(4,6);

                    var endYear = endPeriod.substring(0,4);
                    var endMonth = endPeriod.substring(4,6);

                    var firstDayOfStartPeriod = new Date( startYear + "-" + startMonth + "-01" );

                    var selectedEndPeriod = new Date( endYear + "-" + endMonth + "-01" );
                    var lastDayOfSelEndPeriod = new Date(selectedEndPeriod.getFullYear(), selectedEndPeriod.getMonth() + 1, 0);

                    var startQuater = Math.floor((firstDayOfStartPeriod.getMonth() + 3) / 3);

                    var endQuater = Math.floor((lastDayOfSelEndPeriod.getMonth() + 3) / 3);

                    while (startYear <= endYear)
                    {
                        if (startYear == endYear)
                        {
                            for (var i = startQuater; i <= endQuater; i++)
                            {
                                periodList.push(startYear + "Q" + i);
                            }
                        }
                        else
                        {
                            for (var i = startQuater; i <= 4; i++)
                            {
                                periodList.push(startYear + "Q" + i);
                            }
                        }
                        startYear++;
                        startQuater = 1;
                    }
                }

                else if( periodType === "Yearly")
                {
                    var startYear = startPeriod.substring(0,4);

                    var endYear = endPeriod.substring(0,4);
                    for(startYear; startYear <= endYear; startYear++ )
                    {
                        periodList.push( startYear );
                    }

                }

                return periodList;
            },
            getPeriodName: function(periodType,period){
                var periodName="";

                if( periodType === "Monthly")
                {
                    var year = period.substring(0,4);
                    var month = period.substring(4,6);
                    var strMonth="";

                    if(month=="01" || month=="1") 	    strMonth="January";
                    else if(month=="02" || month=="2")	strMonth="February";
                    else if(month=="03" || month=="3")	strMonth="March";
                    else if(month=="04" || month=="4")	strMonth="April";
                    else if(month=="05" || month=="5")	strMonth="May";
                    else if(month=="06" || month=="6")	strMonth="June";
                    else if(month=="07" || month=="7")	strMonth="July";
                    else if(month=="08" || month=="8")	strMonth="August";
                    else if(month=="09" || month=="9")	strMonth="September";
                    else if(month=="10")				strMonth="October";
                    else if(month=="11") 				strMonth="November";
                    else if(month=="12")				strMonth="December";

                    periodName =  strMonth + " " +year;
                }

                else if( periodType === "Quarterly")
                {
                    var year = period.substring(0,4);
                    var quater = period.substring(4,6);
                    var quaterName = "";

                    if(quater== "Q1" ) 	    quaterName = "January - March";
                    else if(quater=="Q2" )	quaterName = "April - June";
                    else if(quater=="Q3" )	quaterName = "July - September";
                    else if(quater=="Q4" )	quaterName = "October - December";

                    periodName =  quaterName + " " +year;
                }

                else if( periodType === "Yearly")
                {
                    periodName =  period;
                }
                return periodName;
            }

        };
    })