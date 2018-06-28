/* global excelUpload, angular */


//Home controller
ExportCSVApp.controller('homeController',
    function ($rootScope,
        $scope,
        $location,
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

                
})



