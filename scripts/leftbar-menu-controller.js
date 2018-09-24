//Controller for column show/hide
trackerElementsReport.controller('LeftBarMenuController',
        function($scope,
                $location) {
    $scope.elementsReportFun = function(){
        $location.path('/elementsReport').search();
    };
});