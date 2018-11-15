/**
 * Created by hisp on 2/12/15.
 */
trackerElementsReport.directive('calendar', function () {
  return {
    require: 'ngModel',
    link: function (scope, el, attr, ngModel) {
      $(el).datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect: function (dateText) {
          scope.$apply(function () {
            ngModel.$setViewValue(dateText);
          });
        }
      });
    }
  };
});
trackerElementsReport
  .controller('elementsController', function ($window,
    $scope,
    $timeout,
    MetadataService) {

    //variables using
    $scope.popup = "none";
    $scope.selectedPrograms = [];
    $scope.selectedProgramStages = [];
    $scope.selectedDes = [];
    $scope.selectedTrs = [];
    $scope.selectalldes = false;
    $scope.selectalltrs = false;

    $('.headerRow').bind('click', function () {
      return false;
    });

    $(function () {
      $('[data-toggle="tooltip"]').tooltip();

      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');
      });
    })
    //onload functions
    window.onclick = function (event) {
      $(".selectedd").addClass("fa-check");
    }

    //date load
    $(function () {
      $('input[name="daterange"]').daterangepicker({
        opens: 'right'
      }, function (start, end, label) {
        $scope.startdate = start.format('YYYY-MM-DD');
        $scope.enddate = end.format('YYYY-MM-DD');
      });

    });

    //initially load tree
    selection.load();

    getAllPrograms();
    getAllProgramStages();
    getAllTeas();
    // Listen for OU changes
    selection.setListenerFunction(function () {
      $scope.selectedOrgUnitUid = selection.getSelected();
      loadOus();
    }, false);

    loadOus = function () {
      MetadataService.getOrgUnit($scope.selectedOrgUnitUid).then(function (orgUnit) {
        // $timeout(function () {
        $scope.selectedOrgUnit = orgUnit;
        if ($scope.popup == 'ou') {
          $scope.updateSelections("ou");
        }
        // });
      });
    }

    // $scope.selectedProgram = {};
    function getAllPrograms() {
      MetadataService.getAllPrograms().then(function (prog) {
        $scope.allPrograms = prog.programs;
        $scope.programs = [];
        for (var i = 0; i < prog.programs.length; i++) {
          //if (prog.programs[i].withoutRegistration == false) {
          $scope.programs.push(prog.programs[i]);
        }
      });
    }

    function getAllProgramStages() {
      MetadataService.getProgramStages().then(function (stages) {
        $scope.programStages = [];
        $scope.programStagesDataElements = [];
        for (var j = 0; j < stages.programStages.length; j++) {
          $scope.programStages.push(stages.programStages[j]);

          $scope.programStagesDataElements[stages.programStages[j].id] = stages.programStages[j].programStageDataElements;

        }
      });
    };

    function getAllTeas() {
      MetadataService.getALLAttributes().then(function (teas) {
        $scope.trackedEntityAttributes = [];
        for (var j = 0; j < teas.trackedEntityAttributes.length; j++) {
          $scope.trackedEntityAttributes.push(teas.trackedEntityAttributes[j]);
        }
      });
    }

    //function to download excel single table
    fnExcelReport = function (id) {
      var data_type = 'data:application/vnd.ms-excel';
      var table_div = id;
      var table_html = table_div.outerHTML.replace(/ /g, '%20');
      var a = document.createElement('a');
      a.href = data_type + ', ' + table_html;
      a.download = 'Tracker Rate Report.xls';
      a.click();
    };

    //function to download excel complete
    $scope.fnExcelReportAll = function () {
      var data_type = 'data:application/vnd.ms-excel';
      var table_div = document.getElementById('alltables');
      var table_html = table_div.outerHTML.replace(/ /g, '%20');
      var a = document.createElement('a');
      a.href = data_type + ', ' + table_html;
      a.download = 'Tracker Rate Report.xls';
      a.click();
    };

    //function to change selections in popup

    $scope.updateSelections = function (value) {
      switch (value) {
        case "ou":
          $('#selectedItem').text($scope.selectedOrgUnit === undefined ? "" : $scope.selectedOrgUnit.name);
          break;

        case "pr":
          var totalPrograms = Object.keys($scope.selectedPrograms).length;
          if (totalPrograms != 0) {
            var firstProgram = $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[0]].name;
            (totalPrograms == 1) ? $('#selectedItem').text(firstProgram) : $('#selectedItem').text(firstProgram + ", +" + (totalPrograms - 1));

          } else {
            $('#selectedItem').text("");
          }
          break;

        case "ps":
          var totalProgramStages = Object.keys($scope.selectedProgramStages).length;
          if (totalProgramStages != 0) {
            var firstProgramStage = $scope.selectedProgramStages[Object.keys($scope.selectedProgramStages)[0]].name;
            (totalProgramStages == 1) ? $('#selectedItem').text(firstProgramStage) : $('#selectedItem').text(firstProgramStage + ", +" + (totalProgramStages - 1));

          } else {
            $('#selectedItem').text("");
          }
          break;

        case "de":
          var totalDes = Object.keys($scope.selectedDes).length;
          if (totalDes != 0) {
            var firstDe = $scope.selectedDes[Object.keys($scope.selectedDes)[0]].dename;
            (totalDes == 1) ? $('#selectedItem').text(firstDe) : $('#selectedItem').text(firstDe + ", +" + (totalDes - 1));
          } else {
            $('#selectedItem').text("");
          }
          break;

        case "tr":
          var totalTrs = Object.keys($scope.selectedTrs).length;
          if (totalTrs != 0) {
            var firstTr = $scope.selectedTrs[Object.keys($scope.selectedTrs)[0]].name;
            (totalTrs == 1) ? $('#selectedItem').text(firstTr) : $('#selectedItem').text(firstTr + ", +" + (totalTrs - 1));
          } else {
            $('#selectedItem').text("");
          }
          break;

        default:
          break;
      }
    };

    // function to view popups
    $scope.updatePopup = function (v) {
      if (v == 'ou') {
        $scope.popup = 'ou';
        $('#modalContent').removeClass('modal-content-custom');
        $('#selection').removeClass('selection-custom');

        selection.load();
      }
      if (v == 'pr') {
        $scope.popup = 'pr';
        $('#modalContent').removeClass('modal-content-custom');
        $('#selection').removeClass('selection-custom');
        $scope.updateSelections("pr");
      }
      if (v == 'ps') {
        $scope.popup = 'ps';
        $('#modalContent').removeClass('modal-content-custom');
        $('#selection').removeClass('selection-custom');
        $scope.updateSelections("ps");
      }
      if (v == 'de') {
        $scope.popup = 'de';
        $('#modalContent').addClass('modal-content-custom');
        $('#selection').addClass('selection-custom');
        $scope.updateSelections("de");
      }
      if (v == 'tr') {
        $scope.popup = 'tr';
        $('#modalContent').addClass('modal-content-custom');
        $('#selection').addClass('selection-custom');
        $scope.updateSelections("tr");
      }
      document.getElementById('loader').style.display = "block";
      $timeout(function () {
        document.getElementById('myModal').style.display = 'block';
        document.getElementById('loader').style.display = "none";
        if (v == 'pr') $scope.updateSelectionIcons($scope.selectedPrograms);
        if (v == 'ps') $scope.updateSelectionIcons($scope.selectedProgramStages);
        if (v == 'de') $scope.updateSelectionIcons($scope.selectedDes);
        if (v == 'tr') $scope.updateSelectionIcons($scope.selectedTrs);
      }, 1000);

    };

    $scope.params = function (v) {

      switch ($scope.popup) {

        case "ou":
          $('#ouBtn').text($scope.selectedOrgUnit === undefined ? "" : $scope.selectedOrgUnit.name);
          $("#ouBtn").toggleClass('active');
          break;

        case "pr":
          var totalPrograms = Object.keys($scope.selectedPrograms).length;
          if (totalPrograms != 0) {
            var firstProgram = $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[0]].name;
            (totalPrograms == 1) ? $('#prBtn').text(firstProgram) : $('#prBtn').text((firstProgram + ", +" + (totalPrograms - 1)));
            $("#prBtn").addClass('active');
            $scope.updateProgramStages($scope.selectedPrograms);
          } else {
            $('#prBtn').text("Np program selecteds");
            $("#prBtn").removeClass('active');
          }
          break;

        case "ps":
          var totalProgramStages = Object.keys($scope.selectedProgramStages).length;
          if (totalProgramStages != 0) {
            var firstProgramStage = $scope.selectedProgramStages[Object.keys($scope.selectedProgramStages)[0]].name;
            (totalProgramStages == 1) ? $('#psBtn').text(firstProgramStage) : $('#psBtn').text(firstProgramStage + ", +" + (totalProgramStages - 1));
            $("#psBtn").addClass('active');
            $scope.updateDataElements($scope.selectedProgramStages);
          } else {
            $('#psBtn').text("No program stage selected");
            $("#psBtn").removeClass('active');
          }
          break;

        case "de":
          var totalDes = Object.keys($scope.selectedDes).length;
          if (totalDes != 0) {
            var firstDe = $scope.selectedDes[Object.keys($scope.selectedDes)[0]].dename;
            (totalDes == 1) ? $('#deBtn').text(firstDe) : $('#deBtn').text(firstDe + ", +" + (totalDes - 1));
            $("#deBtn").addClass('active');
          } else {
            $('#deBtn').text("No data element selected");
            $("#deBtn").removeClass('active');
          }
          break;

        case "tr":
          var totalTrs = Object.keys($scope.selectedTrs).length;
          if (totalTrs != 0) {
            var firstTr = $scope.selectedTrs[Object.keys($scope.selectedTrs)[0]].name;
            (totalTrs == 1) ? $('#trBtn').text(firstTr) : $('#trBtn').text(firstTr + ", +" + (totalTrs - 1));
            $("#trBtn").addClass('active');
          } else {
            $('#trBtn').text("");
            $("#trBtn").removeClass('active');
          }
          break;

        default:
          return;
      }
      document.getElementById('myModal').style.display = 'none';
    }

    $scope.programSelections = function (index, pr) {
      var $this = $('.pr-table tr').eq(index).children('td:first').find('i');
      if (!$this.hasClass('selectedd')) {
        $scope.selectedPrograms[pr.id] = pr;
        $scope.selectedPrograms[pr.id].selectedPS = [];
        $this.addClass('selectedd');
      } else {
        delete $scope.selectedPrograms[pr.id];
        $scope.selectedProgramStages = [];
        $this.removeClass('selectedd');
      }
      $scope.updateSelections("pr");
    };

    $scope.programStageSelections = function (index, ps) {
      var $this = $('.ps-table tr').eq(index).children('td:first').find('i');
      if (!$this.hasClass('selectedd')) {
        $scope.selectedProgramStages[ps.id] = ps;
        $scope.selectedPrograms[ps.program.id].selectedPS[ps.id] = ps.name;
        $this.addClass('selectedd');
      } else {
        delete $scope.selectedProgramStages[ps.id];
        delete $scope.selectedPrograms[ps.program.id].selectedPS[ps.id];
        $this.removeClass('selectedd');
      }
      $scope.updateSelections("ps");
    };

    $scope.dataElementsSelections = function (index, de) {
      var $this = $('.de-table tr').eq(index).children('td:first').find('i');
      if (!$this.hasClass('selectedd')) {
        $scope.selectedDes[de.deid + "_" + de.psid] = de;
        $this.addClass('selectedd');
      } else {
        delete $scope.selectedDes[de.deid + "_" + de.psid];
        $this.removeClass('selectedd');
      }
      $scope.updateSelections("de");
    };

    $scope.teaSelections = function (index, tr) {
      var $this = $('.tr-table tr').eq(index).children('td:first').find('i');
      if (!$this.hasClass('selectedd')) {
        $scope.selectedTrs[tr.id] = tr;
        $this.addClass('selectedd');
      } else {
        delete $scope.selectedTrs[tr.id];
        $this.removeClass('selectedd');
      }
      $scope.updateSelections("tr");
    };

    $scope.updateProgramStages = function (arr) {
      $scope.mappedProgramStages = [];
      for (var k = 0; k < Object.keys(arr).length; k++) {
        $scope.mappedProgramStages.push(arr[Object.keys(arr)[k]].name);
        for (var i = 0; i < $scope.programStages.length; i++) {

          if (Object.keys(arr)[k] == $scope.programStages[i].program.id) {
            $scope.mappedProgramStages.push($scope.programStages[i]);
          }
        }
      }
    };

    $scope.updateDataElements = function (arr) {
      $scope.mappedDataElements = [];
      for (var k = 0; k < Object.keys(arr).length; k++) {
        $scope.mappedDataElements.push({
          'pr': arr[Object.keys(arr)[k]].program.name,
          'ps': arr[Object.keys(arr)[k]].name
        });
        var psde = arr[Object.keys(arr)[k]].programStageDataElements;
        for (var i = 0; i < psde.length; i++) {

          $scope.mappedDataElements.push({
            'pr': arr[Object.keys(arr)[k]].program.name,
            'prid': arr[Object.keys(arr)[k]].program.id,
            'ps': arr[Object.keys(arr)[k]].name,
            'psid': arr[Object.keys(arr)[k]].id,
            'dename': psde[i].dataElement.name,
            'deid': psde[i].dataElement.id
          });
        }
      }
    };

    $scope.updateSelectionIcons = function (arr, type) {
      if (type == "deadd") {
        for (var k = 0; k < Object.keys(arr).length; k++) {
          var varr = "#" + Object.keys(arr)[k];
          $(varr).addClass('selectedd');
        }
      } else if (type == "deremove") {
        for (var k = 0; k < arr.length; k++) {
          var varr = "#" + arr[k].deid;
          $(varr + "_" + arr[k].psid).removeClass('selectedd');
        }
      } else if (type == "trremove") {
        for (var k = 0; k < arr.length; k++) {
          var varr = "#" + arr[k].id;
          $(varr).removeClass('selectedd');
        }
      }
         else {
          for (var k = 0; k < Object.keys(arr).length; k++) {
            var varr = "#" + Object.keys(arr)[k];
            $(varr).addClass('selectedd');
          }
        }
      };

      $scope.toggleSelectAll = function () {
        if (!$scope.selectalldes) {
          $("#selectAll").find("i").addClass("selectedd");
          $scope.selectedDes = [];
          for (var l = 0; l < $scope.mappedDataElements.length; l++) {
            if ($scope.mappedDataElements[l].deid !== undefined) {
              $scope.selectedDes[$scope.mappedDataElements[l].deid + "_" + $scope.mappedDataElements[l].psid] = $scope.mappedDataElements[l];
            }
          }
          $scope.updateSelectionIcons($scope.selectedDes, "deadd");
        } else {
          $("#selectAll").find("i").removeClass("selectedd");
          $scope.selectedDes = [];
          $scope.updateSelectionIcons($scope.mappedDataElements, "deremove");
        }
        $scope.updateSelections("de");
        $scope.selectalldes = !$scope.selectalldes;
      }

      $scope.toggleSelectAllTeas = function () {
        if (!$scope.selectalltrs) {
          $("#selectAlltrs").find("i").addClass("selectedd");
          $scope.selectedTrs = [];
          for (var l = 0; l < $scope.trackedEntityAttributes.length; l++) {
            $scope.selectedTrs[$scope.trackedEntityAttributes[l].id] = $scope.trackedEntityAttributes[l];

          }
          $scope.updateSelectionIcons($scope.selectedTrs, "deadd");
        } else {
          $("#selectAlltrs").find("i").removeClass("selectedd");
          $scope.selectedTrs = [];
          $scope.updateSelectionIcons($scope.trackedEntityAttributes, "trremove");
        }
        $scope.updateSelections("tr");
        $scope.selectalltrs = !$scope.selectalltrs;
      }

      $scope.generateReport = function (type) {
        var returnvalue = $scope.validate();
        if (returnvalue == 1) {
          if (type == "ev") $scope.loadMetaDataEv();
          else $scope.loadMetaDataEn();
        } else {
          return;
        }
      };

      $scope.generateReportByEvents = function () {
        $('.data-table').empty();
        for (var i = 0; i < Object.keys($scope.selectedPrograms).length; i++) {
          for (var j = 0; j < Object.keys($scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].selectedPS).length; j++) {
            var prid = $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].id;

            var selectedPsId = Object.keys($scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].selectedPS)[j];

            var table = "<div id='div_" + selectedPsId + "' class='container'><table class='table table-hovered table-bordered table-striped custom-data-table' id='table_" + selectedPsId + "'>";

            var programHeaderRow = "<thead><tr><th colspan='3'>Program:  " + $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].name + "<span class='icon-div' onClick='fnExcelReport(table_" + selectedPsId + ")'><i class='fa fa-download icon-table' data-toggle='tooltip' data-placement='top' title='Export this table in excel'></i></span><span class='icon-div'><i class='fa fa-bar-chart icon-table' data-toggle='tooltip' data-placement='top' title='Switch to graph'></i></span></th></tr>";

            var programStageHeaderRow = "<tr><th colspan='3'>Program Stage:  " + $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].selectedPS[selectedPsId] + "<p style='float:right;color:white'>Total Events : " + $scope.elementsMap[selectedPsId] + "</p></th></tr>";

            var deHeaderRow = "<tr><th>Data Elements</th><th>Count</th><th>Percentage (%)</th></tr></thead>"
            var selectedDeRow = "";
            for (var k = 0; k < Object.keys($scope.selectedDes).length; k++) {
              var DePsId = $scope.selectedDes[Object.keys($scope.selectedDes)[k]].psid;
              var value = "";
              ($scope.elementsMap[selectedPsId + "_" + deid] === undefined) ? value = 0 : value = $scope.elementsMap[selectedPsId + "_" + deid];
              if (selectedPsId == DePsId) {
                var deid = $scope.selectedDes[Object.keys($scope.selectedDes)[k]].deid;
                selectedDeRow = selectedDeRow + "<tr><td>" + $scope.selectedDes[Object.keys($scope.selectedDes)[k]].dename + "</td><td id='" + deid + "'>" +
                  value +
                  "</td><td>" + ((value / $scope.elementsMap[selectedPsId]) * 100).toFixed(2) + "</td></tr>";
              }
            }
            var tableAppend = table + programHeaderRow + programStageHeaderRow + deHeaderRow + selectedDeRow + "</table></div><br><br>";
            $(".data-table").append(tableAppend);
          }

        }
      };

      $scope.generateReportByEnrollments = function () {
        $('.data-table').empty();
        for (var i = 0; i < Object.keys($scope.selectedPrograms).length; i++) {
          if (!$scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].withoutRegistration) {
            var prid = $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].id;
            $scope.getTrackedEntityAttributesMap(prid);

            for (var j = 0; j < Object.keys($scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].selectedPS).length; j++) {

              var selectedPsId = Object.keys($scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].selectedPS)[j];

              var table = "<div id='div_" + selectedPsId + "' class='container'><table class='table table-hovered table-bordered table-striped custom-data-table' id='table_" + selectedPsId + "'>";

              var programHeaderRow = "<thead><tr><th colspan='3'>Program:  " + $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].name + "<span class='icon-div' onClick='fnExcelReport(table_" + selectedPsId + ")'><i class='fa fa-download icon-table' data-toggle='tooltip' data-placement='top' title='Export this table in excel'></i></span><span class='icon-div'><i class='fa fa-bar-chart icon-table' data-toggle='tooltip' data-placement='top' title='Switch to graph'></i></span></th></tr>";

              var programStageHeaderRow = "<tr><th colspan='3'>Program Stage:  " + $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].selectedPS[selectedPsId] + "<p style='float:right;color:white'>Total Enrollments : " + $scope.elementsMap[selectedPsId] + "</p></th></tr>";

              var deHeaderRow = "<tr><th>Data Elements</th><th>Count</th><th>Percentage (%)</th></tr></thead>"
              var selectedDeRow = "";
              for (var k = 0; k < Object.keys($scope.selectedDes).length; k++) {
                var DePsId = $scope.selectedDes[Object.keys($scope.selectedDes)[k]].psid;
                var value = "";
                var deid = $scope.selectedDes[Object.keys($scope.selectedDes)[k]].deid;
                ($scope.elementsMap[selectedPsId + "_" + deid] === undefined) ? value = 0 : value = $scope.elementsMap[selectedPsId + "_" + deid];
                if (selectedPsId == DePsId) {
                  selectedDeRow = selectedDeRow + "<tr><td>" + $scope.selectedDes[Object.keys($scope.selectedDes)[k]].dename + "</td><td id='" + deid + "'>" +
                    value +
                    "</td><td>" + ((value / $scope.elementsMap[selectedPsId]) * 100).toFixed(2) + "</td></tr>";
                }
              }
              var tableAppend = table + programHeaderRow + programStageHeaderRow + deHeaderRow + selectedDeRow + "</table></div><br><br>";
              $(".data-table").append(tableAppend);
            }
          }
        }

      };


      $scope.loadMetaDataEv = function () {
        $scope.elementsMap = [];
        document.getElementById('loader2').style.display = "block";
        document.getElementById("loadtext").innerHTML = "loading data.."
        MetadataService.getEvents($scope.selectedOrgUnit.id, $scope.startdate, $scope.enddate).then(function (data) {
          var events = data.events;
          for (var p = 0; p < events.length; p++) {
            var perc = ((p / events.length - 1) * 100).toFixed(2);
            // document.getElementById("loadtext").innerHTML = perc + "% data loaded!";
            if (events[p].eventDate !== undefined) {
              var date = events[p].eventDate;
              var first = date.split('T')[0];
              var evdate = new Date(first);
              if (evdate <= new Date($scope.enddate) && evdate >= new Date($scope.startdate)) {
                var ps = events[p].programStage;
                $scope.generateElementsMap(ps);
                for (var q = 0; q < events[p].dataValues.length; q++) {
                  var de = events[p].dataValues[q].dataElement;
                  $scope.generateElementsMap(ps, de);
                }
              }
            }
            if (p == events.length - 1) {
              document.getElementById('loader2').style.display = "none";
              $scope.generateReportByEvents();
            }
          }
        });
      };

      $scope.loadMetaDataEn = function () {
        $scope.elementsMap = [];
        $scope.teiMap = [];
        document.getElementById('loader2').style.display = "block";
        document.getElementById("loadtext").innerHTML = "loading data.."
        MetadataService.getEvents($scope.selectedOrgUnit.id, $scope.startdate, $scope.enddate).then(function (data) {
          var events = data.events;
          for (var p = 0; p < events.length; p++) {
            // document.getElementById("loadtext").innerHTML = perc + "% data loaded!";
            if (events[p].eventDate !== undefined) {
              var date = events[p].eventDate;
              var first = date.split('T')[0];
              var evdate = new Date(first);
              if (evdate <= new Date($scope.enddate) && evdate >= new Date($scope.startdate)) {
                var tei = events[p].trackedEntityInstance;
                var ps = events[p].programStage;
                $scope.generateElementsMapTei(ps, tei);
                for (var q = 0; q < events[p].dataValues.length; q++) {
                  var de = events[p].dataValues[q].dataElement;
                  $scope.generateElementsMapTei(ps, tei, de);
                }

              }
            }
            if (p == events.length - 1) {
              document.getElementById('loader2').style.display = "none";
              $scope.generateReportByEnrollments();
            }
          }
        });
      };

      $scope.generateElementsMap = function (ps, de) {

        if (de === undefined) {
          if ($scope.elementsMap[ps] === undefined) {
            $scope.elementsMap[ps] = 1;
          } else {
            $scope.elementsMap[ps] += 1;
          }
        } else {
          if ($scope.elementsMap[ps + "_" + de] === undefined) {
            $scope.elementsMap[ps + "_" + de] = 1;
          } else {
            $scope.elementsMap[ps + "_" + de] += 1;
          }
        }
      };

      $scope.generateElementsMapTei = function (ps, tei, de) {

        if (de === undefined) {
          if ($scope.teiMap[tei + "_" + ps] === undefined) {
            if ($scope.elementsMap[ps] === undefined) $scope.elementsMap[ps] = 1;
            else $scope.elementsMap[ps] += 1;
            $scope.teiMap[tei + "_" + ps] = true;
          }
        } else {
          if ($scope.teiMap[tei + "_" + ps + "_" + de] === undefined) {
            if ($scope.elementsMap[ps + "_" + de] === undefined) $scope.elementsMap[ps + "_" + de] = 1;
            else $scope.elementsMap[ps + "_" + de] += 1;
            $scope.teiMap[tei + "_" + ps + "_" + de] = true;
          }
        }
      };

      $scope.home = function () {
        var host = $window.location.href;
        var newLocation = host.split('api')[0] + "dhis-web-dashboard-integration/index.html";
        $window.location.href = newLocation;
      }

      $scope.validate = function () {
        if ($scope.selectedOrgUnit === undefined) {
          alert("Select Orgunit!");
          return 0;
        } else if (Object.keys($scope.selectedPrograms).length == 0) {
          alert("Select at least one program!");
          return 0;
        } else if (Object.keys($scope.selectedProgramStages).length == 0) {
          alert("Select at least one program stage!");
          return 0;
        } else if (Object.keys($scope.selectedDes).length == 0) {
          alert("Select at least one data element!");
          return 0;
        } else if ($scope.startdate === undefined || $scope.enddate === undefined) {
          alert("Select date range!");
          return 0;
        } else {
          return 1;
        }
      };

      $scope.getTrackedEntityAttributesMap = function (prid) {
        $scope.teasMap = [];
        var totalen = 0;
        MetadataService.getAllTeas($scope.selectedOrgUnit.id, prid).then(function (data) {
          var teis = data.trackedEntityInstances;
          for (var i = 0; i < teis.length; i++) {
            if (teis[i].created !== undefined) {
              var date = teis[i].created;
              var first = date.split('T')[0];
              var evdate = new Date(first);
              if (evdate <= new Date($scope.enddate) && evdate >= new Date($scope.startdate)) {
                totalen++;
                var attrs = teis[i].attributes;
                for (var j = 0; j < attrs.length; j++) {
                  if ($scope.teasMap[prid + "_" + attrs[j].attribute]) {
                    $scope.teasMap[prid + "_" + attrs[j].attribute] += 1;
                  }
                  else {
                    $scope.teasMap[prid + "_" + attrs[j].attribute] = 1;
                  }
                }
              }
            }
            if (i == teis.length - 1) { $scope.teasMap[prid] = totalen; $scope.generateTeaTable(prid); }
          }
        });
      };

      $scope.generateTeaTable = function (prid) {
        var table = "<div id='div_" + prid + "' class='container'><table class='table table-hovered table-bordered table-striped custom-data-table' id='table_" + prid + "'>";

        var programHeaderRow = "<thead><tr><th colspan='3'>Program:  " + $scope.selectedPrograms[prid].name + "<span class='icon-div' onClick='fnExcelReport(table_" + prid + ")'><i class='fa fa-download icon-table' data-toggle='tooltip' data-placement='top' title='Export this table in excel'></i></span><span class='icon-div'><i class='fa fa-bar-chart icon-table' data-toggle='tooltip' data-placement='top' title='Switch to graph'></i></span></th></tr>";

        var programStageHeaderRow = "<tr><th colspan='3'><p style='float:right;color:white'>Total Enrollments : " + $scope.teasMap[prid] + "</p></th></tr>";

        var trHeaderRow = "<tr><th>Tracked Entity Attributes</th><th>Count</th><th>Percentage (%)</th></tr></thead>"
        var selectedTrRow = "";
        for (var k = 0; k < Object.keys($scope.selectedTrs).length; k++) {
          var value = "";
          var trid = $scope.selectedTrs[Object.keys($scope.selectedTrs)[k]].id;
          ($scope.teasMap[prid + "_" + trid] === undefined) ? value = 0 : value = $scope.teasMap[prid + "_" + trid];
          selectedTrRow = selectedTrRow + "<tr><td>" + $scope.selectedTrs[Object.keys($scope.selectedTrs)[k]].name + "</td><td id='" + trid + "'>" +
            value +
            "</td><td>" + ((value / $scope.teasMap[prid]) * 100).toFixed(2) + "</td></tr>";
        }
        var tableAppend = table + programHeaderRow + programStageHeaderRow + trHeaderRow + selectedTrRow + "</table></div><br><br>";
        $(".data-table").append(tableAppend);
      };
    });