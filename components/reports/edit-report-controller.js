/**
 *
 */

reportsApp.controller('EditReportController',
    function ($rootScope,$scope,$location, reportSettingService,reportsService,$window,
              ReportAppSectionSettingService,organisationUnitGroupService,$timeout,UserGroupService) {

        $scope.currentReport={
            "id":"",
            "section":"",
            "orgUnitGroup":"",
            "periodType":""
        }

        $scope.periodTypes=[
            {
            "id":"yearly",
            "name":"Yearly"
            },
            {
                "id": "monthly",
                "name": "Monthly"
            },
            {
                "id": "quarterly",
                "name": "Quarterly"
            },
            {
                "id" : "start-end",
                "name" : "Custom - Start and End Date"
            }

        ]

        reportsService.getAllWithDetails().then(function(data){
            $scope.reportList = data.reports;

        });

        ReportAppSectionSettingService.getAllReportAppSection().then(function(data){
        $scope.sectionList = data.sections;
        });

        organisationUnitGroupService.getAll().then(function(data){
           $scope.organisationUnitGroups = data.organisationUnitGroups;
        });

        UserGroupService.getAllUserGroup().then(function(data){
            $scope.userGroups = data.userGroups;
        });

        //var test = getQueryVariable("reportUid");
        var reportUid = sessionStorage.getItem('reportUid');
        reportSettingService.getAll().then(function(data){
            $scope.reportSettings = data;
            angular.forEach($scope.reportSettings.reports, function(report){

                if( report.id === reportUid )
                {
                    //console.log( " Report Uid -- " + report.id +  " Report OrgUnitGroup-- " + report.orgUnitGroup + " Report section -- " + report.section + " Report Uid -- " + report.periodType );
                    $scope.currentReport.id = report.id;
                    $scope.currentReport.section = report.section;
                    $scope.currentReport.orgUnitGroup = report.orgUnitGroup;
                    $scope.currentReport.periodType = report.periodType;
                }
            });

        });

        $scope.save = function(){

            //$scope.reportSettings.reports.push($scope.currentReport);

            angular.forEach($scope.reportSettings.reports, function(report){

                if( report.id === $scope.currentReport.id )
                {
                    console.log( " Report Uid -- " + report.id +  " Report OrgUnitGroup-- " + report.orgUnitGroup + " Report section -- " + report.section + " Report Uid -- " + report.periodType );

                    report.section = $scope.currentReport.section;
                    report.orgUnitGroup = $scope.currentReport.orgUnitGroup;
                    report.periodType = $scope.currentReport.periodType;
                }
            });

            reportSettingService.save($scope.reportSettings).then(function(reponse){

                if (reponse != "")
                {
                    //$window.location.reload();
                    $location.path('/reports');
                }
            })
        };

        $scope.cancel = function(){
            $location.path('/reports');

        };

       

    })