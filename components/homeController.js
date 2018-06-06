
DataStatusApp.controller('HomeController',
        function ($rootScope,$scope,$location)
{

    $scope.back = function(){
        $location.path('/home');

    };
    $scope.showDataStatusScreen = function () {
        $location.path('/data-status');

    };

});