/**
 * Created by sunakshi on 10/02/18.
 */

var ExportCSVApp = angular.module('ExportCSVApp',['ui.bootstrap',
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'ngMessages',
    'd2HeaderBar',
    'd2Directives',
    'd2Filters',
    'd2Services',
    'pascalprecht.translate',
    'exportServices'
])

.config(function($routeProvider,$translateProvider){
        $routeProvider.when('/', {
            templateUrl:'components/home.html',
            controller: 'homeController'
        }).when('/report',{
            templateUrl:'components/report.html',
            controller: 'reportController'
        }).otherwise({
            redirectTo : '/'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useLoader('i18nLoader');
    })