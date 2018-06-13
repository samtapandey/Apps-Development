
var DataStatusApp = angular.module('DataStatusApp',['ui.bootstrap',
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'ngMessages',
    'd2HeaderBar',
    'd2Directives',
    'd2Filters',
    'd2Services',
    'pascalprecht.translate',
    'reportServices'
])
.config(function($routeProvider,$translateProvider){
    $routeProvider.when('/', {
        templateUrl:'components/home.html',
        controller: 'HomeController'
        }).when('/data-status', {
            templateUrl:'components/data-status.html',
            controller: 'DataStatusController'
        }).when('/data-status-result',{
            templateUrl:'components/data-status-result.html',
            controller: 'DataStatusResultController'
        }).when('/data-status-data-set-wise',{
            templateUrl:'components/data-status-data-set-wise.html',
            controller: 'DataStatusDataSetWiseController'
        }).otherwise({
            redirectTo : '/'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useLoader('i18nLoader');

        initSQLView();

    });


    function initSQLView() {

        SQLViewsName2IdMap = [];
        getAllSQLViews().then(function(sqlViews){
            var requiredViews = [];
            requiredViews[SQLQUERY_DS_App_CategoryComboId_NAME] = false;
            requiredViews[SQLQUERY_DS_App_Data_Status_NAME] = false;
            requiredViews[SQLQUERY_DS_App_Data_Summary_NAME] = false;
            requiredViews[SQLQUERY_DS_App_Periods_NAME] = false;
            requiredViews[SQLQUERY_DS_App_User_Details_NAME] = false;
            requiredViews[SQLQUERY_DS_App_GetDataSetId_NAME] = false;
            requiredViews[SQLQUERY_DS_App_GetOrgUnitId_NAME] = false;


            for (var i=0;i<sqlViews.length;i++){
                SQLViewsName2IdMap[sqlViews[i].name] = sqlViews[i].id;
    
                if (sqlViews[i].name == SQLQUERY_DS_App_CategoryComboId_NAME){
                    delete requiredViews[SQLQUERY_DS_App_CategoryComboId_NAME];
                }
                else if (sqlViews[i].name == SQLQUERY_DS_App_Data_Status_NAME){
                   delete requiredViews[SQLQUERY_DS_App_Data_Status_NAME];
                }
                else if (sqlViews[i].name == SQLQUERY_DS_App_Data_Summary_NAME){
                    delete requiredViews[SQLQUERY_DS_App_Data_Summary_NAME];
                }
                else if (sqlViews[i].name == SQLQUERY_DS_App_Periods_NAME){
                    delete requiredViews[SQLQUERY_DS_App_Periods_NAME];
                }
                else if (sqlViews[i].name == SQLQUERY_DS_App_User_Details_NAME){
                    delete requiredViews[SQLQUERY_DS_App_User_Details_NAME];
                }
                else if (sqlViews[i].name == SQLQUERY_DS_App_GetDataSetId_NAME){
                    delete requiredViews[SQLQUERY_DS_App_GetDataSetId_NAME];
                }
                else if (sqlViews[i].name == SQLQUERY_DS_App_GetOrgUnitId_NAME){
                    delete requiredViews[SQLQUERY_DS_App_GetOrgUnitId_NAME];
                }
            }
    
            createRequiredViews(requiredViews);
        })
    }
    
      function createRequiredViews(reqViews){
    
        $.getScript('scripts/utility-functions.js', function () 
        {          
             const SQLView_Init_Map = prepareIdToObjectMap(SQLView_Init,"name"); 
             
             for (var key in reqViews){
    
                var sqlViewTemplate =
                {
                    "name": SQLView_Init_Map[key].name,
                    "sqlQuery": SQLView_Init_Map[key].query,
                    "displayName": SQLView_Init_Map[key].name,
                    "description": SQLView_Init_Map[key].desc,
                    "type": SQLView_Init_Map[key].type
                }
        
                createSQLView(Object.assign({},sqlViewTemplate)).then(function(response){
                    SQLViewsName2IdMap[response.name] = response.response.lastImported;
                    console.log("SQL View created.");
                    //debugger
        
                })
            }
        }); 
    }