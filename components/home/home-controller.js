/* global excelUpload, angular */
var authority = ''; 
//Controller for home
excelUpload.controller('HomeController',function($scope,$http,$rootScope) {
	
	$scope.manageTemplateAction =  function(){
		window.location.assign("#manage-templates");
	};
	
	$scope.dataImportAction =  function(){
		window.location.assign("#data-import");
	};
	
	$scope.logsAction =  function(){
		window.location.assign("#logs");
	};
	

	$scope.settingAction =  function(){
		window.location.assign("#settings");
	};

	$scope.facilitywiseAction =  function(){
		window.location.assign("#facilitywise");
	};
	
	$scope.userCredentials = [];
    $scope.authority = '';

	/* **************************************************************************************
		**** RETRIEVING USER CREDIENTIAL DATA ***********************************************
		************************************************************************************* **/
		
	    //AURTORITY
    
		  $http({
		     method: 'GET',
		     url: '../../../api/me.json?fields=userCredentials[userRoles[authorities]]&paging=false',
		     headers: {'X-Parse-Application-Id':'XXXXXXXXXXXXX', 'X-Parse-REST-API-Key':'YYYYYYYYYYYYY'}
		  })
		    .then(function successCallback(response) {
		        $scope.userCredentials = response.data;
		        
		        angular.forEach($scope.userCredentials, function (value, key) {
		        
		          angular.forEach(value.userRoles, function (value1, key){
		        	
		        	angular.forEach(value1.authorities, function (value2, key){
		        	
			        	if (value2 == 'ALL') 
			            {
			               $scope.authority = 'ALL';
			                console.log( value2 );
			            }	
		        	});
		        	
		          });
		            
		            
		        });
		        
		        console.log(response.data);
		    }, function errorCallback(response) {
		        alert("Error connecting to API");
		    }); 
});