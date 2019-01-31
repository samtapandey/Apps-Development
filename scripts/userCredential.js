excelUpload.controller('UserController',function($scope,$http)		 
{

 $scope.userName = "";

 	$scope.getRequest = function () {
        console.log("I've been pressed!");  
        $http.get("../../../api/me.json?fields=userCredentials[userRoles[authorities]]&paging=false")
            .then(function successCallback(response){
                $scope.response = response.data;
                console.log(response.data);
            }, function errorCallback(response){
                console.log("Unable to perform get request");
            });
    };

});