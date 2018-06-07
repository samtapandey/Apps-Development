
DataStatusApp.controller('DataStatusResultController',
function ($rootScope,$scope, $location,reportSettingService,reportsService,
          ReportAppSectionSettingService,periodService,$window,organisationUnitGroupService,
          userService,ReportConfigurationService,DataSetService,$timeout,OrganisationUnitService,MetadataService)
{


    $scope.selOrgUnit = sessionStorage.getItem('selOrgUnit');
    $scope.selDataSetUid = sessionStorage.getItem('selDataSetUid');
    $scope.selStartPeriod = sessionStorage.getItem('selStartPeriod');
    $scope.selEndPeriod = sessionStorage.getItem('selEndPeriod');
    $scope.selStartDate = sessionStorage.getItem('selectedStartPeriod');
    $scope.selEndDate = sessionStorage.getItem('lastDayOfSelEndPeriod');

    DataSetService.getDataSetPeriodTypeAndSource( $scope.selDataSetUid ).then(function(data){
        $scope.dataSetPeriodType = data.dataSets[0].periodType;
        $scope.dataSetName = data.dataSets[0].name;
        $scope.dataSetSource = data.dataSets[0].organisationUnits;

        $scope.filteredOrgUnitList=[];
        OrganisationUnitService.getAllChildrenOfSelectedOrgUnit( $scope.selOrgUnit ).then(function(orgUnitList){
                $scope.allChildrenList = orgUnitList.organisationUnits;
                angular.forEach( $scope.allChildrenList, function(child){
                    angular.forEach( $scope.dataSetSource, function(dataSetSource){
                        if( child.id === dataSetSource.id )
                        {
                            $scope.filteredOrgUnitList.push( dataSetSource );
                        }
                    });
                });
            }
        );

        $scope.periodList = periodService.getPeriodListBetweenTwoDates($scope.dataSetPeriodType, $scope.selStartPeriod, $scope.selEndPeriod );
        $scope.periodListMap = [];
        angular.forEach( $scope.periodList, function(period){
            $scope.periodName = periodService.getPeriodName($scope.dataSetPeriodType, period );
            $scope.periodListMap[period] = $scope.periodName;
        });

    });

    $scope.showDataStatusScreen = function () {
        $location.path('/data-status');

    };

});
