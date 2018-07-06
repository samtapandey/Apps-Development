/* global excelUpload, angular */

//Home controller
ExportCSVApp.controller('homeController',
    function ($rootScope,
        $scope,
        $http,
        $sanitize,
        $sce,
        $timeout,
        OrgUnitService,
        PeriodService) {

        $scope.orgUnitGroups = {};

        
		/* **************************************************************************************
		 **** RETRIEVING ROOT JSON AND NEEDED DATA ***********************************************
		 ************************************************************************************* **/
        $scope.dateOptions = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];
        var count1 = 0;



        //org unit group
        $.get('../../organisationUnitGroups.json?paging=false', function (ou) {
            var ouid = [];
            var ids;
            var dn;
            for (var i = 0; i < ou.organisationUnitGroups.length; i++) {
                ids = ou.organisationUnitGroups[i].id;
                dn = ou.organisationUnitGroups[i].displayName;

                if (ids == 'FrKiTIjDUxU' || ids == 'VnGNfO08w38' || ids == 'GhuHmwRnPBs' || ids == 'oPJQbzZ20Ff') {
                    ouid.push(["all", "ALL"]);
                    ouid.push([ids, dn]);
                }
            }
            var uniques = new Array();
            var itemsFound = {};
            for (var i = 0, l = ouid.length; i < l; i++) {
                var stringified = JSON.stringify(ouid[i]);
                if (itemsFound[stringified]) { continue; }
                uniques.push(ouid[i]);
                itemsFound[stringified] = true;
            }
            var i;
            var n = uniques.length;
            var tmp = new Array();
            for (i = 0; i < n; i++) {
                tmp.push({
                    id: uniques[i][0],
                    displayName: uniques[i][1]
                });
            }
            var mObj = new Object;
            mObj.uniques = tmp;

            $scope.orgUnitGroups = mObj.uniques;
        }).fail(function (jqXHR, textStatus, errorThrown) {

        })


        /***************************************************************************************
		 **** RETRIEVING DATA FROM SELECTION ***********************************************
		 ************************************************************************************* **/


        // Get JSON data
        $http.get('data.json').then(function (response) {

            var jsonData = response.data;
            $scope.jsonObj = jsonData.headers;


        });

        // Get date 
        $scope.today = new Date();
        var dd = $scope.today.getDate();
        var mm = $scope.today.getMonth() + 1; //January is 0!
        var yyyy = $scope.today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        $scope.today = dd+"-"+mm+"-" +yyyy;

        // Get user

        $.get('../../me.json?paging=false', function (user) {

            $scope.userName = user.userCredentials.username;

        })

        var dataArray = [];
        var countNumber = 0;


        // Get data from selection

        $scope.controllerData = {};

        $scope.submit = function () {

            document.getElementById("loader").style.display = "block";

            if ($scope.controllerData.orgunit === undefined) {
                alert("Please select Organisation Unit Group");
                window.location.assign('#home.html');               
            }
            if ($scope.controllerData.period === undefined) {
                alert("Please select Period");
                window.location.assign('#home.html');                
            }
            else {
                $scope.orgGroupId = $scope.controllerData.orgunit.id;
                $scope.periodId = $scope.controllerData.period;

                if ($scope.orgGroupId == "FrKiTIjDUxU") // Associated clinincs
                {

                    $scope.code = "AS205-0000";
                }

                if ($scope.orgGroupId == "oPJQbzZ20Ff") // Mobile clinincs
                {

                    $scope.code = "OU205-0000";
                }

                if ($scope.orgGroupId == "VnGNfO08w38") // Static clinincs
                {

                    $scope.code = "CL205-0000";
                }

                if ($scope.orgGroupId == "GhuHmwRnPBs") // CBD clinincs
                {

                    $scope.code = "CB205-0000";
                }
                if ($scope.orgGroupId == "all") {
                    var orgUnitGroupsArray = [
                        { code: 'AS205-0000', orgId: 'FrKiTIjDUxU', period: $scope.periodId },
                        { code: 'OU205-0000', orgId: 'oPJQbzZ20Ff', period: $scope.periodId },
                        { code: 'CL205-0000', orgId: 'VnGNfO08w38', period: $scope.periodId },
                        { code: 'CB205-0000', orgId: 'GhuHmwRnPBs', period: $scope.periodId }
                    ];

                    for (var i = 0; i < orgUnitGroupsArray.length; i++) {
                        $scope.addJsonData(orgUnitGroupsArray[i].orgId, orgUnitGroupsArray[i].period, orgUnitGroupsArray[i].code);

                    }

                }
                else {
                    $scope.addJsonData($scope.orgGroupId, $scope.periodId, $scope.code);

                }

            }


        }

        // Get data from JSON

        $scope.addJsonData = function (orgGroup, period, code) {
            var jsonObj1 = $scope.jsonObj;
            countNumber = jsonObj1.length;

            var catId = '';

            for (var i = 0; i < jsonObj1.length; i++) {
                var dataelementCode = jsonObj1[i].dataelementCode;
                var indicator = jsonObj1[i].indicator;
                var categoryoptioncombo = jsonObj1[i].categoryoptioncombo;
                var attributeoptioncombo = jsonObj1[i].attributeoptioncombo;
                var og = orgGroup;
                var pe = period;
                var ce = code;

                if (categoryoptioncombo == "mYU1cpPLbA3") {
                    catId = "KqmIk38scuj"; // <25 years
                }
                if (categoryoptioncombo == "BpkvMcVXQgy") {
                    catId = "wzqerAiRUfl"; // >25 years
                }

                //var GetPromiseValue = GetDataValueService.get(catId, indicator, og, pe);

                $.when(
                    $.getJSON("../../analytics.json?dimension=ID3CGIXZNp9:" + catId + ";&dimension=dx:" + indicator + ";&dimension=ou:OU_GROUP-" + og + "&filter=pe:" + pe + "&displayProperty=NAME", {
                        format: "json"
                    })
                ).then(function (response) {
                    var value = 0;
                    //var dataResponse = response.$$state.value;
                    for (var i = 0; i < response.rows.length; i++) {
                        value += parseInt(response.rows[i][3]);
                    }

                    var dataObj = { "dataelement": dataelementCode, "period": period, "orgunit": ce, "categoryoptioncombo": categoryoptioncombo, "attributeoptioncombo": attributeoptioncombo, "value": value, "storedby": $scope.userName, "lastupdated": $scope.today, "comment": "false", "followup": "" };
                    
                    dataArray.push(dataObj);
                    

                }).done(function(){



                    if($scope.orgGroupId == "all")
                    {
                        if (dataArray.length == countNumber*4) {
                            Json2CSV(dataArray);
                            
                        }
                    }
                        else {
                            if (dataArray.length == countNumber) {
                                     Json2CSV(dataArray);
                                
                            }
                        }


                })

            }

        }


        function Json2CSV(objArray) {
            var
                getKeys = function (obj) {
                    var keys = [];
                    for (var key in obj) {
                        keys.push(key);
                    }
                    return keys.join();
                }, array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
                , str = ''
                ;

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            str = getKeys(objArray[0]) + '\r\n' + str;

            var a = document.createElement('a');
            var blob = new Blob([str], { 'type': 'application\/octet-stream' });
            a.href = window.URL.createObjectURL(blob);
            a.download = 'result.csv';
            a.click();
            window.location.assign('#home.html');
            return true;

        }

        function sleep(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
              if ((new Date().getTime() - start) > milliseconds){
                break;
              }
            }
          }

    })



