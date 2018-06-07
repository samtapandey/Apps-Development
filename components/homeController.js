
DataStatusApp.controller('HomeController',
        function ($rootScope,$scope,$location)
{

  
    $scope.showDataStatusScreen = function () {
        $location.path('/data-status');

    };

});