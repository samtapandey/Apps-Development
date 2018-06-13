
DataStatusApp.controller('HomeController',
        function ($rootScope,$scope,$location)
{

  
    $scope.showDataStatusScreen = function () {
        $location.path('/data-status').search();;
        window.location.reload();
    };

    $scope.showDataStatusScreen2 = function () {
        $location.path('/data-status-data-set-wise').search();;
        window.location.reload();
    };

});