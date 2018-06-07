
DataStatusApp.controller('DataStatusController',
    function ($rootScope,$scope, $http, $location,periodService,$window,organisationUnitGroupService,sqlviewservice,
              userService,DataSetService,$timeout,OrganisationUnitService,ReportConfigurationService,MetadataService)
    {

		$scope.selOrgUnit = selection.getSelected();
		$scope.filteredOrgUnitList=[];
            OrganisationUnitService.getAllChildrenOfSelectedOrgUnit( $scope.selOrgUnit[0] ).then(function(orgUnitList){
                    $scope.allChildrenList = orgUnitList.organisationUnits;
                    angular.forEach( $scope.allChildrenList, function(child){
                                $scope.filteredOrgUnitList.push( child.id );
                            
                    });
                }
			);
			
       
	$scope.basicUrl = "../../sqlViews/";
		
	sqlviewservice.getAll().then(function(data)
	{
        $scope.sqlViews = data.sqlViews;
			
		for(var i=0;i<data.sqlViews.length;i++)
		{
			if($scope.sqlViews[i].name=="DS_App_Data_Status")
			{
				$scope.dataStatusSV=$scope.sqlViews[i].id;
			}
		
			if($scope.sqlViews[i].name=="DS_App_Data_Summary")
			{
				$scope.dataSummarySV=$scope.sqlViews[i].id;
			}

			if($scope.sqlViews[i].name=="DS_App_User_Details")
			{
				$scope.userDetailsSV=$scope.sqlViews[i].id;
			}
			
			if($scope.sqlViews[i].name=="DS_App_Periods")
			{
				$scope.periodsSV=$scope.sqlViews[i].id;
			}

			if($scope.sqlViews[i].name=="DS_App_Get_Organisation Id")
			{
            	$scope.orgUnitSV=$scope.sqlViews[i].id;
			}

            if($scope.sqlViews[i].name=="DS_App Get_Category_Combo_Id")
            {
                $scope.CategoryComboId=$scope.sqlViews[i].id;
			}
			
            if($scope.sqlViews[i].name=="DS_App_Get_DataSet_Id")
            {
                $scope.getDataSetid=$scope.sqlViews[i].id;
			}

		}

    });
		
	
        $scope.currentSelection = {
            "orgUnit":"",
            "orgUnitName":"",
            "dataStatusReport":"",
            "includeZero":true,
            "dataSet":"",
            "startPeriodMonth":"",
            "startPeriodYear":"",
            "endPeriodMonth":"",
            "endPeriodYear":""
        };


        var clearAllValues = function(){
            $scope.currentSelection={
                "orgUnit":"",
                "orgUnitName":"",
                "dataStatusReport":"",
                "includeZero":true,
                "dataSet":"",
                "startPeriodMonth":"",
                "startPeriodYear":"",
                "endPeriodMonth":"",
                "endPeriodYear":""
            }
        };


     /*   DataSetService.getAllDataSet().then(function(data){
                $scope.dataSets = data.dataSets;
                $scope.updatePeriods();
			});*/
		$scope.dataSetReport = function(){
			var url = "../../dataSets.json?fields=name,id,attributeValues[attribute[id,name],value]&filter=attributeValues.attribute.id:eq:XSZbdSOTfDY"; // data sets based on report app attribute
			$.get(url, function(data){
				$scope.dataSets = data.dataSets;
			});
		};
		$scope.dataSetHospital = function(){
			var url = "../../dataSets.json?fields=name,id,attributeValues[attribute[id,name],value]&filter=attributeValues.attribute.id:eq:KImLMEN4m8O"; // data sets based on Hospital attribute
			$.get(url, function(data){
				$scope.dataSets = data.dataSets;
			});
		};
		$scope.dataSetMedical = function(){
			var url = "../../dataSets.json?fields=name,id,attributeValues[attribute[id,name],value]&filter=attributeValues.attribute.id:eq:DG8A7Ha62vY"; // data sets based on Muncipalities attribute
			$.get(url, function(data){
				$scope.dataSets = data.dataSets;
			});
		};

        
		$.ajaxSetup({
            async:false
        });

        $scope.updatePeriods = function(){
            if(true){
                var currentDate = new Date();
                $scope.monthList = periodService.getMonthList();
                $scope.yearList = periodService.getYearListBetweenTwoYears(1900,currentDate.getFullYear());

            }else{
                $scope.periodList = periodService.getLast12Months();
            }
        };

        $scope.listenToOuChange = function(){
            $timeout(function() {
                $scope.selectedOrgUnit = selection.getSelected();
                $scope.currentSelection.orgUnit = $scope.selectedOrgUnit;
                OrganisationUnitService.getOrgUnitNameAndLevelByUid( $scope.selectedOrgUnit ).then(function(data){
						$scope.currentSelection.orgUnitName = data.organisationUnits[0].name;
						$scope.orgLevel = data.organisationUnits[0].level;
						if($scope.orgLevel == 1 && $scope.currentSelection.orgUnitName == "Libya")
						{
							$scope.dataSetReport();
							$scope.updatePeriods();	
						}
						if($scope.orgLevel == 2 && $scope.currentSelection.orgUnitName == "Muncipalities")
						{
							$scope.dataSetMedical();
							$scope.updatePeriods();	
						}
						if($scope.orgLevel == 2 && $scope.currentSelection.orgUnitName == "Hospitals and Medical Centres")
						{
							$scope.dataSetHospital();
							$scope.updatePeriods();	
						}
                        ReportConfigurationService.getAllReportConfiguration().then(function (resultData) {
                            if(resultData != "") {
                                $scope.configurationParameters = resultData;
                                $scope.currentSelection.dataStatusReport = $scope.ReportAppConfigurationSettings.parameters['ds_status_report'].value;
                            }
                        });
                    }
                );
				url=  $scope.basicUrl + $scope.orgUnitSV + "/data.json?var=orgUnitId:"+$scope.selectedOrgUnit +"";			
				$.get(url, function(data){
				
				$scope.organisationunitid_1=data.rows[0];				
				
				});

            }, 10);
			
			$scope.showHideButtons();
        };

        selection.setListenerFunction($scope.listenToOuChange);

        $scope.generateDataStatusReport = function(){
           
            var date = new Date();
            var currentMonthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var currentMonthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            var selectedStartPeriod = "";
            var lastDayOfSelStartPeriod = "";
            var lastDayOfSelEndPeriod = "";


            var isValidated = "true";
            if( $scope.currentSelection.orgUnitName === "" || $scope.currentSelection.orgUnitName === undefined )
            {
				alert( "Please select organisation unit");
				window.location.reload();
                isValidated = "false";
                return;
            }
           
            else if( $scope.currentSelection.dataSet === "" || $scope.currentSelection.dataSet === undefined )
            {
				alert( "Please select data set");
				window.location.reload();
                isValidated = "false";
                return;
            }
            else if( $scope.currentSelection.startPeriodMonth === "" || $scope.currentSelection.startPeriodMonth === undefined )
            {
				alert( "Please select start period month");
				window.location.reload();
                isValidated = "false";
                return;
            }

            else if( $scope.currentSelection.startPeriodYear === "" || $scope.currentSelection.startPeriodYear === undefined )
            {
				alert( "Please select start period year");
				window.location.reload();
                isValidated = "false";
                return;
            }
            else if( $scope.currentSelection.endPeriodMonth === "" || $scope.currentSelection.endPeriodMonth === undefined )
            {
				alert( "Please select end period month");
				window.location.reload();
                isValidated = "false";
                return;
            }

            else if( $scope.currentSelection.endPeriodYear === "" || $scope.currentSelection.endPeriodYear === undefined )
            {
				alert( "Please select end period year");
				window.location.reload();
                isValidated = "false";
                return;
            }
            if( $scope.currentSelection.startPeriodMonth != undefined && $scope.currentSelection.startPeriodYear != undefined  )
            {
                var selStartYear = $scope.currentSelection.startPeriodYear;
                var selStartMonth = $scope.currentSelection.startPeriodMonth;
                selectedStartPeriod = new Date( selStartYear + "-" + selStartMonth + "-01" );
                lastDayOfSelStartPeriod = new Date(selectedStartPeriod.getFullYear(), selectedStartPeriod.getMonth() + 1, 0);

                if( lastDayOfSelStartPeriod > currentMonthLastDay )
                {
					alert( "You can not select future period for start period");
					window.location.reload();
                    isValidated = "false";
                    return;
                }
            }
            if( $scope.currentSelection.endPeriodMonth != undefined && $scope.currentSelection.endPeriodYear != undefined  )
            {
                var selEndYear = $scope.currentSelection.endPeriodYear;
                var selEndMonth = $scope.currentSelection.endPeriodMonth;
                var selectedEndPeriod = new Date( selEndYear + "-" + selEndMonth + "-01" );
                lastDayOfSelEndPeriod = new Date(selectedEndPeriod.getFullYear(), selectedEndPeriod.getMonth() + 1, 0);

                if( lastDayOfSelEndPeriod > currentMonthLastDay )
                {
					alert( "You can not select future period for end period");
					window.location.reload();
                    isValidated = "false";
                    return;
                }
            }

            if( $scope.currentSelection.startPeriodMonth != undefined && $scope.currentSelection.startPeriodYear != undefined
                    && $scope.currentSelection.endPeriodMonth != undefined && $scope.currentSelection.endPeriodYear != undefined )
            {
                var selStartYear = $scope.currentSelection.startPeriodYear;
                var selStartMonth = $scope.currentSelection.startPeriodMonth;
                var selectedStartPeriod = new Date( selStartYear + "-" + selStartMonth + "-01" );

                var selEndYear = $scope.currentSelection.endPeriodYear;
                var selEndMonth = $scope.currentSelection.endPeriodMonth;
                var selectedEndPeriod = new Date( selEndYear + "-" + selEndMonth + "-01" );

                if( selectedStartPeriod > selectedEndPeriod )
                {
					alert( "Start period should not be greater then end period");
					window.location.reload();
                    isValidated = "false";
                    return;
                }
            }

        

            if( isValidated === "true")
            {
                var selOrgUnit = selection.getSelected();
                var selDataSetUid = $scope.currentSelection.dataSet;
                var selStartPeriod = $scope.currentSelection.startPeriodYear + "" + $scope.currentSelection.startPeriodMonth;
                var selEndPeriod = $scope.currentSelection.endPeriodYear + "" + $scope.currentSelection.endPeriodMonth;
                var reportUid = $scope.currentSelection.dataStatusReport;
                var includeZero = $scope.currentSelection.includeZero;
                OrganisationUnitService.getOrganisationUnitLevelLength().then(function(data){
                        $scope.level = data.organisationUnitLevels.length;
                    }
                );

                DataSetService.getDataSetPeriodTypeAndSource( selDataSetUid ).then(function(data){
                        $scope.dataSetPeriodType = data.dataSets[0].periodType;
                        $scope.dataSetSource = data.dataSets[0].organisationUnits;

                        sessionStorage.setItem('selOrgUnit',selOrgUnit);
                        sessionStorage.setItem('selDataSetUid',selDataSetUid);
                        sessionStorage.setItem('dataSetPeriodType',$scope.dataSetPeriodType);
                        sessionStorage.setItem('dataSetSource',$scope.dataSetSource);
                        sessionStorage.setItem('selStartPeriod',selStartPeriod);
                        sessionStorage.setItem('selEndPeriod',selEndPeriod);
                        sessionStorage.setItem('selectedStartPeriod',selectedStartPeriod);
                        sessionStorage.setItem('lastDayOfSelStartPeriod',lastDayOfSelStartPeriod);
                        sessionStorage.setItem('lastDayOfSelEndPeriod',lastDayOfSelEndPeriod);

                        $window.location.href = "../dhis-web-reporting/generateHtmlReport.action?uid="+reportUid+"&orgUnitUID="+selOrgUnit+"&dataSetUID="+selDataSetUid+"&dataSetPeriodType="+$scope.dataSetPeriodType
                        +"&startDate="+selStartPeriod+"&endDate="+selEndPeriod+"&includeZero="+includeZero ;


                    }
                );


			}


        }
		
		//Results
		
		$scope.allOrgUnitChildren = [];
		$scope.allPeriods = [];
		$scope.compulsoryDECount = 1;
		$scope.totalOrgLevels = 1;
		$scope.grandParentLevel = 1;
		$scope.grandParentName="";
        //*****************************************************************************
        //GET END PERIOD
        //*****************************************************************************
		function getEndPeriod(startPeriodYear,startPeriodMonth)
		{
			var date="",EndDate;
			if(startPeriodMonth=="01" || startPeriodMonth=="03" || startPeriodMonth=="05" || startPeriodMonth=="07" || startPeriodMonth=="08" || startPeriodMonth=="10" || startPeriodMonth=="12")
			{
                date=31;
			}
			else if(startPeriodMonth=="02")
			{
				if(startPeriodYear/4==0)
				{
					date=29;
				}
				else
				{
					date=28;
				}

			}
            else if(startPeriodMonth=="04" || startPeriodMonth=="06" || startPeriodMonth=="09" || startPeriodMonth=="11")
            {
                date=30;
            }

            EndDate=startPeriodYear+startPeriodMonth+date;

			return EndDate;
		}


		//*****************************************************************************
		//Data Summary Result
		//*****************************************************************************
					
		$scope.showDataSummary = function(){

			// $scope.generateDataStatusReport();
            Loader.showLoader();
            $("#coverLoad").show();
			$("#headTitle").html("Data Summary - Data Sets");
			$("#tableContent").html("");
			$("#modal-header").fadeIn();
			$("#modal-body").delay(300).fadeIn();
			$("#modal-footer").delay(600).fadeIn();
			$("#resultModal").delay(900).fadeIn();
			$("#dwnLoad").fadeOut();
			
			//passing variables to query
			var selOrgUnit = selection.getSelected();
			var selDataSetUid = $scope.currentSelection.dataSet;
			var selStartPeriod = $scope.currentSelection.startPeriodYear + "" + $scope.currentSelection.startPeriodMonth + "01";

			var selEndPeriod = getEndPeriod($scope.currentSelection.endPeriodYear, $scope.currentSelection.endPeriodMonth);

			var includeZero = $scope.currentSelection.includeZero;
			$scope.organisationUnits_id=[];
			
			$.get( "../../dataSets/"+ selDataSetUid +".json",function(json){
						for(var i=0;i<json.organisationUnits.length;i++)
						{
							for(var j=0;j<$scope.allOrgUnitChildren.length;j++)
							{
								if(json.organisationUnits[i].id==$scope.allOrgUnitChildren[j].uid)
								$scope.organisationUnits_id.push(json.organisationUnits[i].id);
							}
						}
					});

					var url1 = "../../dataSets/"+ selDataSetUid +".json?fields=periodType";
					$.get(url1 , function(dp)
					{
						$scope.dsPeriodType = dp.periodType;
					});
		
					
				var url = $scope.basicUrl + $scope.dataSummarySV + "/data.json?";
		
            url+= "var=compulsoryDECount:" + $scope.compulsoryDECount + ",dataSetUid:" + selDataSetUid + ",orgUnitUid:" + selOrgUnit + ",startDate:" + selStartPeriod + ",endDate:" + selEndPeriod + ",orgUnitUids:" +$scope.organisationunitid_1[0] ;
			
			$.get(url, function(data){
				var summaryData = data.rows;
				
				var totPeriods = $scope.allPeriods.length + 2 ;
				
				var htmlString = "";
				htmlString += "<tr style = 'background:#eee'><td colspan = '"+ totPeriods +"'  style='padding:2px 15px'> <b>Root Organisation Unit : </b>" + $scope.currentSelection.orgUnitName +"</td></tr>";
				htmlString += "<tr style = 'background:#eee'><td colspan = '"+ totPeriods +"'  style='padding:2px 15px'> <b>Data Set : </b>" + $("#dataSetId option:selected").text() +"</td></tr>";
				var durationString = $scope.durationString($scope.currentSelection.startPeriodYear + "-" + $scope.currentSelection.startPeriodMonth ) + " to " + $scope.durationString($scope.currentSelection.endPeriodYear + "-" + $scope.currentSelection.endPeriodMonth );	
				htmlString += "<tr style = 'background:#eee'><td colspan = '"+ totPeriods +"'  style='padding:2px 15px'> <b>Duration : </b>" + durationString +"</td></tr>";
				htmlString += "<tr style = 'background:#fff'><td colspan = '"+ totPeriods +"' ></td></tr>";
				
				htmlString += "<tr><td  style = 'background:#99FF99;padding:0'></td><td colspan='"+ (totPeriods-1) +"'  style='padding:0 15px'> Entered </td></tr>";
				htmlString += "<tr><td  style = 'background:#FFCCCC;padding:0'></td><td colspan='"+ (totPeriods-1) +"'  style='padding:0 15px'> Not Entered </td></tr>";
				
				htmlString += "<tr style = 'background:#fff'><td colspan = '"+ totPeriods +"' ></td></tr>";
				
				htmlString += "<tr style = 'background:#fff'><td colspan = '"+ totPeriods +"' ></td></tr>";
				
				htmlString += "<tr style = 'background:#ddd'><th style='min-width:150px'>Organisation Units</th>";
				
				$scope.allPeriods.forEach(function(p){
					htmlString += "<th style='min-width:100px;max-width:100px;'>" + $scope.periodString( p[0],$scope.dsPeriodType)  + "</th>";					
				});
				
				htmlString += "</tr>";
				var ParentName_1="",ParentName_2="",ParentName_3="",ParentName_4="",ParentName_5="",ParentName_6="",ParentName_7="",ParentName_8="";
				var currentStatus= 0;
				var currentColor = "#eeeeee";
				var currentText = "";
				var statusText = "";
				
				$scope.final_org=[];
				$scope.Final_orgNameWithBreaks=[];
				
				$scope.allOrgUnitChildren.forEach(function(org){
					
					var orgNameWithBreaks = "";
					var totBreaks = org.level - $scope.grandParentLevel;
					var grandParentName1=$scope.grandParentName;
					
					if(totBreaks==0)
					{
						ParentName_1=org.name;
						orgNameWithBreaks=ParentName_1;
					}
					else if(totBreaks==1)
					{
						ParentName_2=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks = ParentName_1+" / "+ParentName_2;
					}
					else if(totBreaks==2)
					{
						ParentName_3=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3;
					}
					else if(totBreaks==3)
					{
						ParentName_4=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3+" / "+ParentName_4;
					}
					else if(totBreaks==4)
					{
						ParentName_5=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3+" / "+ParentName_4+" / "+ParentName_5;
					}
					else if(totBreaks==5)
					{
						ParentName_6=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3+" / "+ParentName_4+" / "+ParentName_5+" / "+ParentName_6;
					}
					else if(totBreaks==6)
					{
						ParentName_7=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3+" / "+ParentName_4+" / "+ParentName_5+" / "+ParentName_6+" / "+ParentName_7;
					}
					$scope.compulsoryDECount = 1;
	
					
					if($scope.GetUID($scope.organisationUnits_id,org.uid))
					{

						$scope.Final_orgNameWithBreaks[orgNameWithBreaks]=org.uid;
						
					}

				});
				$scope.Final_orgNameWithBreaks.sort();
				for(var key in $scope.Final_orgNameWithBreaks)
				{
					htmlString += "<tr><td style='padding:0 15px'>" + key + "</td>";
				
					$scope.allPeriods.forEach(function(pr){
						
							
												currentStatus = 0;
												statusText = "";
												currentColor = "#FFCCCC";//light purple
												currentText = "Not Entered";
										
											var val= $scope.isOrgFound_1( $scope.Final_orgNameWithBreaks[key], summaryData ) ;
												if( val)
												{
												currentStatus = 0;
												currentColor = "#FFCCCC";//pink
												currentText = "Not Entered";
												statusText = "0(" + $scope.compulsoryDECount + ")";

												summaryData.forEach(function(sdata){
													
													if( sdata[3] == $scope.Final_orgNameWithBreaks[key] && sdata[1] == pr[0] )
													{
														currentStatus= sdata[4]/$scope.compulsoryDECount;
														statusText = sdata[4] + "(" + $scope.compulsoryDECount + ")";

													}
														
												
											});
											
											if( currentStatus >= 1 )
											{
												currentColor = "#99FF99";//green
												currentText = "Entered";
											}
										}
									
								htmlString += "<td style='background:"+ currentColor +"'  style='padding:2px 15px;border-color: #0000ff;'>"+currentText+"</td>";
							
								})
				
								htmlString += "</tr>";		
				
				}
					
               $("#tableContent").html(htmlString);
				$("#dwnLoad").fadeIn();
				$("#coverLoad").hide();
			});
		};
	
		//*****************************************************************************
		//Data Status Result
		//*****************************************************************************
		
		
		$scope.showDataStatus = function(){
			// $scope.generateDataStatusReport();

            Loader.showLoader();
			$("#tableContent").html("");
			$("#coverLoad").show();
			$("#headTitle").html("Data Status -  Data Sets");
			$("#modal-header").fadeIn();
			$("#modal-body").delay(300).fadeIn();
			$("#modal-footer").delay(600).fadeIn();
			$("#resultModal").delay(900).fadeIn();
			$("#dwnLoad").fadeOut();
			
			
			//passing variables to query
			var selOrgUnit = selection.getSelected();
			var selDataSetUid = $scope.currentSelection.dataSet;
			var selStartPeriod = $scope.currentSelection.startPeriodYear + "" + $scope.currentSelection.startPeriodMonth + "01";
            var selEndPeriod = getEndPeriod($scope.currentSelection.endPeriodYear, $scope.currentSelection.endPeriodMonth);
            var includeZero = $scope.currentSelection.includeZero;
			$scope.organisationUnits_id=[];
			$scope.catcombo=[];$scope.dataSetElement_len="";

            newurl1=$scope.basicUrl + $scope.getDataSetid + "/data.json?var=dataSetID:"+selDataSetUid+"";

            $.get(newurl1, function(data){

                $scope.dataSetID=data.rows[0];


            });
			var newurl=$scope.basicUrl+$scope.CategoryComboId+"/data.json?var=datasetelementid:"+$scope.dataSetID[0]+"";
            $.get(newurl ,function(json) {

                $scope.compulsoryDECount=json.height;


			});
			
			var url1 = "../../dataSets/"+ selDataSetUid +".json?fields=periodType";
			$.get(url1 , function(dp)
			{
				$scope.dsPeriodType = dp.periodType;
			});


                $.get("../../dataSets/"+ selDataSetUid +".json?fields=*,dataSetElements[id,categoryCombo]&skipPaging=true" ,function(json){


						for(var i=0;i<json.organisationUnits.length;i++)
						{
							for(var j=0;j<$scope.allOrgUnitChildren.length;j++)
							{
								if(json.organisationUnits[i].id==$scope.allOrgUnitChildren[j].uid)
								$scope.organisationUnits_id.push(json.organisationUnits[i].id);
							}
						}
					});

				$scope.OrgUnit_uid	=$scope.filteredOrgUnitList.toString();
				var url = $scope.basicUrl + $scope.dataStatusSV + "/data.json?";
				
			url+= "var=compulsoryDECount:" + $scope.compulsoryDECount + ",dataSetUid:" + selDataSetUid + ",orgUnitUids:" +$scope.organisationunitid_1[0] + ",startDate:" + selStartPeriod + ",endDate:" + selEndPeriod;	;	
						
			$.get(url, function(data){
				var summaryData = data.rows;
				
				var totPeriods = $scope.allPeriods.length + 2 ;
				
				var htmlString = "";
				htmlString += "<tr style = 'background:#eee'><td colspan = '"+ totPeriods +"'  style='padding:2px 15px'> <b>Root Organisation Unit : </b>" + $scope.currentSelection.orgUnitName +"</td></tr>";
				htmlString += "<tr style = 'background:#eee'><td colspan = '"+ totPeriods +"'  style='padding:2px 15px'> <b>Data Set : </b>" + $("#dataSetId option:selected").text() +"</td></tr>";
				htmlString += "<tr style = 'background:#eee'><td colspan = '"+ totPeriods +"'  style='padding:2px 15px'> <b>Total Data Elements : </b>" + $scope.compulsoryDECount  +"</td></tr>";
				var durationString = $scope.durationString($scope.currentSelection.startPeriodYear + "-" + $scope.currentSelection.startPeriodMonth ) + " to " + $scope.durationString($scope.currentSelection.endPeriodYear + "-" + $scope.currentSelection.endPeriodMonth );	
				htmlString += "<tr style = 'background:#eee'><td colspan = '"+ totPeriods +"'  style='padding:2px 15px'> <b>Duration : </b>" + durationString +"</td></tr>";
				htmlString += "<tr style = 'background:#fff'><td colspan = '"+ totPeriods +"' ></td></tr>";
				
				htmlString += "<tr><td  style = 'background:#66FF99;padding:0'></td><td colspan='"+ (totPeriods-1) +"'  style='padding:0 15px'> Completed (75+)% </td></tr>";
				htmlString += "<tr><td  style = 'background:#FF99FF;padding:0'></td><td colspan='"+ (totPeriods-1) +"'  style='padding:0 15px'> Partially Completed (41-75)% </td></tr>";
				htmlString += "<tr><td  style = 'background:#FFFF99;padding:0'></td><td colspan='"+ (totPeriods-1) +"'  style='padding:0 15px'> Not Completed(1-40)% </td></tr>";
				htmlString += "<tr><td  style = 'background:#FF9999;padding:0'></td><td colspan='"+ (totPeriods-1) +"'  style='padding:0 15px'> Not Entered (0)% </td></tr>";

				
				htmlString += "<tr style = 'background:#fff'><td colspan = '"+ totPeriods +"' ></td></tr>";
				
				htmlString += "<tr style = 'background:#ddd'><th style='min-width:150px'>Organisation Units</th>";
				
				$scope.allPeriods.forEach(function(p){
					htmlString += "<th style='min-width:100px;max-width:100px;'>" + $scope.periodString( p[0],$scope.dsPeriodType)  + "</th>";					
				});
				
				htmlString += "</tr>";
				var ParentName_1="",ParentName_2="",ParentName_3="",ParentName_4="",ParentName_5="",ParentName_6="",ParentName_7="",ParentName_8="";
				var currentStatus= 0;
				var currentColor = "#eeeeee";
				var statusText = "";
				$scope.Final_orgNameWithBreaks=[];
				
				
				$scope.allOrgUnitChildren.forEach(function(org){
					
					var orgNameWithBreaks = "";
					var totBreaks = org.level - $scope.grandParentLevel;
					
					for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks += "|-------------";
					if(totBreaks==0)
					{
						ParentName_1=org.name;
						orgNameWithBreaks=ParentName_1;
					}
					else if(totBreaks==1)
					{
						ParentName_2=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks = ParentName_1+" / "+ParentName_2;
					}
					else if(totBreaks==2)
					{
						ParentName_3=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3;
					}
					else if(totBreaks==3)
					{
						ParentName_4=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3+" / "+ParentName_4;
					}
					else if(totBreaks==4)
					{
						ParentName_5=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3+" / "+ParentName_4+" / "+ParentName_5;
					}
					else if(totBreaks==5)
					{
						ParentName_6=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3+" / "+ParentName_4+" / "+ParentName_5+" / "+ParentName_6;
					}
					else if(totBreaks==6)
					{
						ParentName_7=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3+" / "+ParentName_4+" / "+ParentName_5+" / "+ParentName_6+" / "+ParentName_7;
					}
					

					if($scope.GetUID($scope.organisationUnits_id,org.uid))
					{

						$scope.Final_orgNameWithBreaks[orgNameWithBreaks]=org.uid;
						
					}


				});
						
					for(var key in $scope.Final_orgNameWithBreaks)
					{
						htmlString += "<tr><td style='padding:0 15px'>" + key + "</td>";
						
					$scope.allPeriods.forEach(function(pr){
						
											currentStatus = 0;
											statusText = "";
											currentColor = "#FF9999";//light purple
											statusText = 0;
									
									 
									if( $scope.isOrgFound_1( $scope.Final_orgNameWithBreaks[key], summaryData ) )
									{
										statusText = 0;//"0(" + $scope.compulsoryDECount + ")";
										
										summaryData.forEach(function(sdata){
											if( sdata[3] == $scope.Final_orgNameWithBreaks[key] && sdata[1] == pr[0] )
											{
												currentStatus= sdata[4]/$scope.compulsoryDECount*100;
												statusText =  Math.ceil(currentStatus) ;//+ "(" + $scope.compulsoryDECount + ")";
											}
										});
										
										if( currentStatus >= 75 )
											currentColor = "#66FF99";
										else if( currentStatus >= 41 )
											currentColor = "#FF99FF";
										else if( currentStatus >= 1 )
											currentColor = "#FFFF99";
										else
											currentColor = "#FF9999";	
									}
								
								
								
						htmlString += "<td style='background:"+ currentColor +";padding:0 15px'>"+statusText +"</td>";
					});
					htmlString += "</tr>";
				}			
					
				$("#tableContent").html(htmlString);
				$("#dwnLoad").fadeIn();
				$("#coverLoad").hide();
			});
		};
		
		//*****************************************************************************
		//Data Status - DEG Result
		//*****************************************************************************
		$scope.showDataStatusDEG = function(){
			$("#coverLoad").show();
			$("#headTitle").html("Data Status - Data Element Groups");
			$("#resultModal").modal('show');	
			$("#dwnLoad").fadeOut();
		};
		
		//*****************************************************************************
		//User Details Result
		//*****************************************************************************
		$scope.showUserDetails = function(){
			// $scope.generateDataStatusReport();
            Loader.showLoader();
			$("#tableContent").html("");
			$("#coverLoad").show();
			$("#headTitle").html("User Details - Latest");
			$("#modal-header").fadeIn();
			$("#modal-body").delay(300).fadeIn();
			$("#modal-footer").delay(600).fadeIn();
			$("#resultModal").delay(900).fadeIn();
			$("#dwnLoad").fadeOut();
			
			//passing variables to query
			var selOrgUnit = selection.getSelected();
			var selDataSetUid = $scope.currentSelection.dataSet;
			var selStartPeriod = $scope.currentSelection.startPeriodYear + "" + $scope.currentSelection.startPeriodMonth + "01";
			var selEndPeriod = $scope.currentSelection.endPeriodYear + "" + $scope.currentSelection.endPeriodMonth + "01";	
			var includeZero = $scope.currentSelection.includeZero;
			
				var url = $scope.basicUrl + $scope.userDetailsSV + "/data.json?";
					
			url+= "var=dataSetUid:" + selDataSetUid + ",orgUnitUid:" + selOrgUnit  + ",startDate:" + selStartPeriod + ",endDate:" + selEndPeriod;	;	

			var url1 = "../../dataSets/"+ selDataSetUid +".json?fields=periodType";			
			$.get(url1 , function(dp)
			{
				$scope.dsPeriodType = dp.periodType;
			});
			$.get(url, function(data){
				var summaryData = data.rows;
				
				var currentPeriodId = -1;
				var currentPeriodStartDate = -1;
				var currentUser = "";
				
				
				var summaryData = data.rows;
				
				var totPeriods = $scope.allPeriods.length + 2 ;
				
				var htmlString = "";
				htmlString += "<tr style = 'background:#eee'><td colspan = '"+ totPeriods +"'  style='padding:2px 15px'> <b>Root Organisation Unit : </b>" + $scope.currentSelection.orgUnitName +"</td></tr>";
				htmlString += "<tr style = 'background:#eee'><td colspan = '"+ totPeriods +"'  style='padding:2px 15px'> <b>Data Set : </b>" + $("#dataSetId option:selected").text() +"</td></tr>";
				var durationString = $scope.durationString($scope.currentSelection.startPeriodYear + "-" + $scope.currentSelection.startPeriodMonth ) + " to " + $scope.durationString($scope.currentSelection.endPeriodYear + "-" + $scope.currentSelection.endPeriodMonth );	
				htmlString += "<tr style = 'background:#eee'><td colspan = '"+ totPeriods +"'  style='padding:2px 15px'> <b>Duration : </b>" + durationString +"</td></tr>";
				htmlString += "<tr style = 'background:#fff'><td colspan = '"+ totPeriods +"' ></td></tr>";
				
				
				htmlString += "<tr style = 'background:#fff'><td colspan = '3' ></td></tr>";
				
				htmlString += "<tr style = 'background:#ddd'><th style='min-width:150px'>Organisation Units</th>";
				
				$scope.allPeriods.forEach(function(p){
					htmlString += "<th style='min-width:100px;max-width:100px;'>" + $scope.periodString( p[0],$scope.dsPeriodType)  + "</th>";					
				});
				
				htmlString += "</tr>";
				
				var currentUser= "";
				var currentColor = "#fff";
				var ParentName_1="",ParentName_2="",ParentName_3="",ParentName_4="",ParentName_5="",ParentName_6="",ParentName_7="",ParentName_8="";
				
				$scope.allOrgUnitChildren.forEach(function(org){
					
					var orgNameWithBreaks = "";
					
					var orgNameWithBreaks = "";
					var totBreaks = org.level - $scope.grandParentLevel;
					
					for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks += "|-------------";
					if(totBreaks==0)
					{
						ParentName_1=org.name;
						orgNameWithBreaks=ParentName_1;
					}
					else if(totBreaks==1)
					{
						ParentName_2=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks = ParentName_1+" / "+ParentName_2;
					}
					else if(totBreaks==2)
					{
						ParentName_3=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3;
					}
					else if(totBreaks==3)
					{
						ParentName_4=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3+" / "+ParentName_4;
					}
					else if(totBreaks==4)
					{
						ParentName_5=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3+" / "+ParentName_4+" / "+ParentName_5;
					}
					else if(totBreaks==5)
					{
						ParentName_6=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3+" / "+ParentName_4+" / "+ParentName_5+" / "+ParentName_6;
					}
					else if(totBreaks==6)
					{
						ParentName_7=org.name;
						for( var x = 0 ; x < totBreaks ; x++ )
						orgNameWithBreaks =  ParentName_1+" / "+ParentName_2+" / "+ParentName_3+" / "+ParentName_4+" / "+ParentName_5+" / "+ParentName_6+" / "+ParentName_7;
					}
			
					
					htmlString += "<tr><td style='padding:0 15px'>" + orgNameWithBreaks + "</td>";
					$scope.allPeriods.forEach(function(pr){
						currentUser = "";
						currentColor = "#eee";
						
						if( $scope.isOrgFound( org.uid, summaryData ) )
						{
							currentUser = "-";
							currentColor = "#fff";
							
							summaryData.forEach(function(sdata){
								if( sdata[0] == org.uid && sdata[1] == pr[0] )
								{
									currentUser= sdata[2];
								}
							});
						}
						htmlString += "<td style='background:"+ currentColor +";padding:0 15px'>" + currentUser + "</td>";
					});
					htmlString += "</tr>";
				});
				
				$("#tableContent").html(htmlString);
				$("#dwnLoad").fadeIn();
				$("#coverLoad").hide();
			});
		};
		
		//*****************************************************************************
		//Validation Status Result
		//*****************************************************************************
		$scope.showValidationStatus = function(){
			$("#coverLoad").show();
			$("#headTitle").html("Validation Status");
			$("#resultModal").modal('show');			
		};
		
		
		// common functions
		
		//*****************************************************************************
		//Check whether an organisation found in the result set
		//*****************************************************************************
		$scope.isOrgFound = function( org, rs ){
			var isFound = false;			
			rs.forEach(function(sdata){				
				if( sdata[0] == org )
					isFound = true;
				
			});
			return isFound;
		};
		
		$scope.isOrgFound_1 = function( org, rs ){
			var isFound = false;			
			rs.forEach(function(sdata){				
				if( sdata[3] == org )
					isFound = true;
				
			});
			return isFound;
		};
		
		$scope.GetUID=function(orguid,uid){
			var isFound = false;	
			orguid.forEach(function(id){
				if(id==uid)
					isFound = true;
			});
				return isFound;			
			
		}
		//*****************************************************************************
		//Show and Hide buttons
		//*****************************************************************************
		$scope.showHideButtons = function(){
			$("#loading").show();
			if( 
					$scope.currentSelection.orgUnitName &&
					$scope.currentSelection.dataSet  &&
					$scope.currentSelection.startPeriodMonth &&
					$scope.currentSelection.startPeriodYear &&
					$scope.currentSelection.endPeriodMonth &&
					$scope.currentSelection.endPeriodYear		
			)
			{
				$.get("../../organisationUnits/"+ selection.getSelected() +".json?fields=id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level]]]]]" , function(data){
					$scope.extractOrgUnits(data);
					
				})
				.then(function(){
					$.get("../../dataSets/"+ $scope.currentSelection.dataSet +".json" ,function(json){
						if( json.dataSetElements.length == 0 )
							$scope.compulsoryDECount = 1;
						else
						$scope.compulsoryDECount = json.dataSetElements.length;
					});
				})
				.then(function(){
					var selStartPeriod = $scope.currentSelection.startPeriodYear + "" + $scope.currentSelection.startPeriodMonth + "01";
					var selEndPeriod = $scope.currentSelection.endPeriodYear + "" + $scope.currentSelection.endPeriodMonth + "01";
					
					$.get("../../sqlViews/"+ $scope.periodsSV +"/data.json?var=startDate:"+ selStartPeriod +",endDate:" + selEndPeriod +",dataSetUidForLevel:" + $scope.currentSelection.dataSet , function(pr){						
						$scope.allPeriods = pr.rows;
						
						$("#btn1").fadeIn();
						$("#btn2").fadeIn();
						$("#btn3").fadeIn();
						$("#btn4").fadeIn();
						$("#btn5").fadeIn();
						$("#btn6").fadeIn();
						$("#loading").hide();
					});
				});
			}
			else
			{
				$("#btn1").fadeOut();
				$("#btn2").fadeOut();
				$("#btn3").fadeOut();
				$("#btn4").fadeOut();
				$("#btn5").fadeOut();
				$("#btn6").fadeOut();
				$("#loading").hide();
			}
		};
		
		
		//*****************************************************************************
		//Extracting orgUnit meta data for labelling purpose
		//*****************************************************************************		
		$scope.extractOrgUnits = function( data ){
			$scope.allOrgUnitChildren = [];
			var grandParent = {};
			grandParent.uid = data.id; grandParent.name = data.name, grandParent.level = data.level;
			$scope.grandParentLevel = data.level;
			$scope.grandParentName=data.name;
			$scope.allOrgUnitChildren.push(grandParent);
			
			$scope.totalOrgLevels = 1;
			
			//level 2
			data.children.forEach(function(o){
				var orgUnit = {};
				orgUnit.uid = o.id; orgUnit.name = o.name, orgUnit.level = o.level;				
				$scope.allOrgUnitChildren.push(orgUnit);
				
				if( $scope.totalOrgLevels < 2 )
					$scope.totalOrgLevels = 2;
				
				//level3
				o.children.forEach(function(a){
					var orgUnit2 = {};
					orgUnit2.uid = a.id; orgUnit2.name = a.name, orgUnit2.level = a.level;
					$scope.allOrgUnitChildren.push(orgUnit2);
					
					if( $scope.totalOrgLevels < 3 )
						$scope.totalOrgLevels = 3;				
					
					//level4
					a.children.forEach(function(b){
						var orgUnit3 = {};
						orgUnit3.uid = b.id; orgUnit3.name = b.name, orgUnit3.level = b.level;
						$scope.allOrgUnitChildren.push(orgUnit3);
					
						if( $scope.totalOrgLevels < 4 )
							$scope.totalOrgLevels = 4;
				
						//level5
						b.children.forEach(function(c){
							var orgUnit4 = {};
							orgUnit4.uid = c.id; orgUnit4.name = c.name, orgUnit4.level = c.level;
							$scope.allOrgUnitChildren.push(orgUnit4);
					
							if( $scope.totalOrgLevels < 5 )
								$scope.totalOrgLevels = 5;
				
							//level6
							c.children.forEach(function(d){
								var orgUnit5 = {};
								orgUnit5.uid = d.id; orgUnit5.name = d.name, orgUnit5.level = d.level;
								$scope.allOrgUnitChildren.push(orgUnit5);
						
								if( $scope.totalOrgLevels < 6 )
									$scope.totalOrgLevels = 6;
				
								//level7
								d.children.forEach(function(e){
									var orgUnit6 = {};
									orgUnit6.uid = e.id; orgUnit6.name = e.name, orgUnit6.level = e.level;
									$scope.allOrgUnitChildren.push(orgUnit6);
														
									if( $scope.totalOrgLevels < 7 )
										$scope.totalOrgLevels = 7;				
				
									//level8
									e.children.forEach(function(f){
										var orgUnit7 = {};
										orgUnit7.uid = f.id; orgUnit7.name = f.name, orgUnit7.level = f.level;
										$scope.allOrgUnitChildren.push(orgUnit7);								
								
										if( $scope.totalOrgLevels < 8 )
											$scope.totalOrgLevels = 8;
				
									});
								});
							});
						});
					});
				});
			});

		};


		//*****************************************************************************
		//Format Date
		//*****************************************************************************
		$scope.formatDate = function( date ){
			var dateString = "";
			dateString += date.getDate()+"/";
			dateString += (date.getMonth() + 1 ) +"/";
			dateString += date.getFullYear() + " at ";
			
			if( date.getHours() > 12 )
				dateString += ( date.getHours() - 12 ) + ":" + date.getMinutes() + "PM";
			else if( date.getHours() == 12 )
				dateString += "12:" + date.getMinutes() + "PM";
			else
				dateString += date.getHours() + ":" + date.getMinutes() + "AM";
			
			return dateString;
		};
		//*****************************************************************************
		//Duration String
		//*****************************************************************************

		$scope.durationString = function( dte ){
			
			var monthNumber = parseInt(dte.split("-")[1]);
			var monthName = "";
			
			if( monthNumber == 1)
				monthName = "Jan";
			else if( monthNumber == 2)
				monthName = "Feb";
			else if( monthNumber == 3)
				monthName = "Mar";
			else if( monthNumber == 4)
				monthName = "Apr";
			else if( monthNumber == 5)
				monthName = "May";
			else if( monthNumber == 6)
				monthName = "Jun";
			else if( monthNumber == 7)
				monthName = "Jul";
			else if( monthNumber == 8)
				monthName = "Aug";
			else if( monthNumber == 9)
				monthName = "Sep";
			else if( monthNumber == 10)
				monthName = "Oct";
			else if( monthNumber == 11)
				monthName = "Nov";
			else if( monthNumber == 12)
				monthName = "Dec";
			
			return monthName + " " + dte.split("-")[0];
		};

		//*****************************************************************************
		//Period String
		//*****************************************************************************
		$scope.periodString = function( dte,pt ){

			if(pt == "Weekly")
			{
				var weekDate = parseInt(dte.split("-")[2]);
				var monthNumber = parseInt(dte.split("-")[1]);
				var yearNumber = parseInt(dte.split("-")[0]);
				var tempDate = yearNumber+","+monthNumber+","+weekDate;
				var myDate = new Date(tempDate);

				var weekNumber = myDate.getWeek();

			return "W"+weekNumber + " "+ dte.split("-")[0];

			}
			if(pt == "Yearly")
			{
				var yearNumber = parseInt(dte.split("-")[0]);
				return yearNumber;

			}
			if(pt == "Quarterly")
			{
				var monthNumber = parseInt(dte.split("-")[1]);

				if(monthNumber == 1 || monthNumber == 2 || monthNumber == 3)
				{
					var quaterName = "January - March";
				}
				if(monthNumber == 4 || monthNumber == 5 || monthNumber == 6)
				{
					var quaterName = "April - June";
				}
				if(monthNumber == 7 || monthNumber == 8 || monthNumber == 9)
				{
					var quaterName = "July - September";
				}
				if(monthNumber == 10 || monthNumber == 11 || monthNumber == 12)
				{
					var quaterName = "October - December";
				}

				return quaterName + " " + dte.split("-")[0];
			}
			if(pt == "Monthly")
			{
				var monthNumber = parseInt(dte.split("-")[1]);
				var monthName = "";
				
				if( monthNumber == 1)
					monthName = "Jan";
				else if( monthNumber == 2)
					monthName = "Feb";
				else if( monthNumber == 3)
					monthName = "Mar";
				else if( monthNumber == 4)
					monthName = "Apr";
				else if( monthNumber == 5)
					monthName = "May";
				else if( monthNumber == 6)
					monthName = "Jun";
				else if( monthNumber == 7)
					monthName = "Jul";
				else if( monthNumber == 8)
					monthName = "Aug";
				else if( monthNumber == 9)
					monthName = "Sep";
				else if( monthNumber == 10)
					monthName = "Oct";
				else if( monthNumber == 11)
					monthName = "Nov";
				else if( monthNumber == 12)
					monthName = "Dec";
				
				return monthName + " " + dte.split("-")[0];
			}
			
		};

		Date.prototype.getWeek = function() {
			var dt = new Date(this.getFullYear(),0,1);
			return Math.ceil((((this - dt) / 86400000) + dt.getDay()+1)/7);
		};
		
    });