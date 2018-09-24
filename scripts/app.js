/**
 * Created by hisp on 1/12/15.
 */

var trackerElementsReport = angular.module('trackerElementsReport',['ui.bootstrap',
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'ngMessages',
    'd2HeaderBar',
    'd2Directives',
    'd2Filters',
    'd2Services',
    'pascalprecht.translate',
    'trackerReportsAppServices'
])

.config(function($routeProvider,$translateProvider){
        $routeProvider.when('/', {
            templateUrl:'views/elementsReport.html',
            controller: 'elementsController'
        }).when('/elementsReport', {
            templateUrl:'views/elementsReport.html',
            controller: 'elementsController'
        }).otherwise({
            redirectTo : '/'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useLoader('i18nLoader');


});
