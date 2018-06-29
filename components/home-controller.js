/* global excelUpload, angular */

$.ajaxSetup({
    async: false
 });

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
        $scope.dateOptions = [2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028];
        var count1 = 0;
       
        
       
                    //org unit group
                    $.get('../../organisationUnitGroups.json?paging=false', function (ou){                    
                        var ouid = [];
                        var ids;
                        var dn;
                        for(var i=0;i<ou.organisationUnitGroups.length;i++){
                        ids = ou.organisationUnitGroups[i].id;
                        dn = ou.organisationUnitGroups[i].displayName;

                        if(ids == 'FrKiTIjDUxU' || ids =='VnGNfO08w38' || ids =='GhuHmwRnPBs' || ids =='oPJQbzZ20Ff')
                        {
                            ouid.push([ids,dn]);
                        }
                         }
                       var uniques = new Array();
                       var itemsFound = {};
                    for(var i = 0, l = ouid.length; i < l; i++) {
                        var stringified = JSON.stringify(ouid[i]);
                        if(itemsFound[stringified]) { continue; }
                        uniques.push(ouid[i]);
                        itemsFound[stringified] = true;
                        }
                var i; 
                var n = uniques.length;
                var tmp = new Array();
                for (i=0; i<n; i++)
                {
                  tmp.push({
                        id:uniques[i][0],
                        displayName:uniques[i][1]
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
	$http.get('data.json').then(function(response) {

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
    $scope.today ="01-01-" + yyyy;

    // Get user

    $.get('../../me.json?paging=false', function (user){

        $scope.me = user.userCredentials.username;

    })     

    var count = 0;
    var dataArray = [];

    // Get data from selection

    $scope.controllerData= {};

    $scope.submit = function () {

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

            $scope.addJsonData($scope.orgGroupId,$scope.periodId,$scope.code);
 
    }

    // Get data from JSON

    $scope.addJsonData = function(orgGroup, period,code)
    {
        var jsonObj1 = $scope.jsonObj;

        var catId = '';
      
        for(var i=0; i<jsonObj1.length; i++)
        {
            var dataelementCode = jsonObj1[i].dataelementCode;
            var indicator = jsonObj1[i].indicator;
            var categoryoptioncombo = jsonObj1[i].categoryoptioncombo;
            var attributeoptioncombo = jsonObj1[i].attributeoptioncombo;
            var og = orgGroup;
            var pe = period;
            var ce = code;

            if(categoryoptioncombo == "mYU1cpPLbA3")
            {
                catId = "KqmIk38scuj"; // <25 years
            }
            if(categoryoptioncombo == "BpkvMcVXQgy") 
            {
                catId = "wzqerAiRUfl"; // >25 years
            }

            var value = getDataValue(catId,indicator,og,pe);
            
            var dataObj = { "dataelement": dataelementCode,"period":period,"orgunit":ce, "categoryoptioncombo":categoryoptioncombo,"attributeoptioncombo":attributeoptioncombo,"value":value, "storedby":$scope.me,"lastupdated":$scope.today, "comment" :"false",   "followup":""};

            dataArray.push(dataObj);
    
        }
        

        Json2CSV(dataArray);


    }
   
       function Json2CSV(objArray)
       {
       var
       getKeys = function(obj){
       var keys = [];
       for(var key in obj){
       keys.push(key);
       }
       return keys.join();
       }, array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
        , str = ''
      ;

      for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
          if(line != '') line += ','
       
          line += array[i][index];
        }

        str += line + '\r\n';
      }

      str = getKeys(objArray[0]) + '\r\n' + str;

      var a = document.createElement('a');
      var blob = new Blob([str], {'type':'application\/octet-stream'});
      a.href = window.URL.createObjectURL(blob);
      a.download = 'result.csv';
      a.click();
      window.location.assign('#home.html');
      return true;
      
    }


    function getDataValue(catId,indicator,og,pe)
    {
        var value = 0;
     
        $.ajax({
            
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                url: "../../analytics.json?dimension=ID3CGIXZNp9:"+catId+";&dimension=dx:"+indicator+";&dimension=ou:OU_GROUP-" + og +"&filter=pe:" +pe+ "&displayProperty=NAME",
                success: function (json) {
            
                for(var i=0; i<json.rows.length;i++)
                {
                    value += parseInt(json.rows[i][3]);
                }
            },
            error: function (response) { }
        });
        return value;
        
    }

                
})



