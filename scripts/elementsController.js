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
    $scope.selectalldes = false;

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
      $(".selected").addClass("fa-check");
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

    //function to download excel
    fnExcelReport = function (id) {

      // var blob = new Blob([id], {
      //   type: 'text/plain;charset=utf-8'
      // });
      // saveAs(blob, "Tracker Rate Report.xls");

      //getting data from our table
      var data_type = 'data:application/vnd.ms-excel';
      var table_div = id;
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
            (totalPrograms == 1) ? $('#selectedItem').text(firstProgram): $('#selectedItem').text(firstProgram + ", +" + (totalPrograms - 1));

          } else {
            $('#selectedItem').text("");
          }
          break;

        case "ps":
          var totalProgramStages = Object.keys($scope.selectedProgramStages).length;
          if (totalProgramStages != 0) {
            var firstProgramStage = $scope.selectedProgramStages[Object.keys($scope.selectedProgramStages)[0]].name;
            (totalProgramStages == 1) ? $('#selectedItem').text(firstProgramStage): $('#selectedItem').text(firstProgramStage + ", +" + (totalProgramStages - 1));

          } else {
            $('#selectedItem').text("");
          }
          break;

        case "de":
          var totalDes = Object.keys($scope.selectedDes).length;
          if (totalDes != 0) {
            var firstDe = $scope.selectedDes[Object.keys($scope.selectedDes)[0]].dename;
            (totalDes == 1) ? $('#selectedItem').text(firstDe): $('#selectedItem').text(firstDe + ", +" + (totalDes - 1));
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
      document.getElementById('loader').style.display = "block";
      $timeout(function () {
        document.getElementById('myModal').style.display = 'block';
        document.getElementById('loader').style.display = "none";
        if (v == 'pr') $scope.updateSelectionIcons($scope.selectedPrograms);
        if (v == 'ps') $scope.updateSelectionIcons($scope.selectedProgramStages);
        if (v == 'de') $scope.updateSelectionIcons($scope.selectedDes);
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
            (totalPrograms == 1) ? $('#prBtn').text(firstProgram): $('#prBtn').text((firstProgram + ", +" + (totalPrograms - 1)));
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
            (totalProgramStages == 1) ? $('#psBtn').text(firstProgramStage): $('#psBtn').text(firstProgramStage + ", +" + (totalProgramStages - 1));
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
            (totalDes == 1) ? $('#deBtn').text(firstDe): $('#deBtn').text(firstDe + ", +" + (totalDes - 1));
            $("#deBtn").addClass('active');
          } else {
            $('#deBtn').text("No data element selected");
            $("#deBtn").removeClass('active');
          }
          break;

        default:
          return;
      }
      document.getElementById('myModal').style.display = 'none';
    }

    $scope.programSelections = function (index, pr) {
      var $this = $('.pr-table tr').eq(index).children('td:first').find('i');
      if (!$this.hasClass('selected')) {
        $scope.selectedPrograms[pr.id] = pr;
        $scope.selectedPrograms[pr.id].selectedPS = [];
        $this.addClass('selected');
      } else {
        delete $scope.selectedPrograms[pr.id];
        $scope.selectedProgramStages = [];
        $this.removeClass('selected');
      }
      $scope.updateSelections("pr");
    };

    $scope.programStageSelections = function (index, ps) {
      var $this = $('.ps-table tr').eq(index).children('td:first').find('i');
      if (!$this.hasClass('selected')) {
        $scope.selectedProgramStages[ps.id] = ps;
        $scope.selectedPrograms[ps.program.id].selectedPS[ps.id] = ps.name;
        $this.addClass('selected');
      } else {
        delete $scope.selectedProgramStages[ps.id];
        delete $scope.selectedPrograms[ps.program.id].selectedPS[ps.id];
        $this.removeClass('selected');
      }
      $scope.updateSelections("ps");
    };

    $scope.dataElementsSelections = function (index, de) {
      var $this = $('.de-table tr').eq(index).children('td:first').find('i');
      if (!$this.hasClass('selected')) {
        $scope.selectedDes[de.deid] = de;
        $this.addClass('selected');
      } else {
        delete $scope.selectedDes[de.deid];
        $this.removeClass('selected');
      }
      $scope.updateSelections("de");
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
          $(varr).addClass('selected');
        }
      } else if (type == "deremove") {
        for (var k = 0; k < arr.length; k++) {
          var varr = "#" + arr[k].deid;
          $(varr).removeClass('selected');
        }
      } else {
        for (var k = 0; k < Object.keys(arr).length; k++) {
          var varr = "#" + Object.keys(arr)[k];
          $(varr).addClass('selected');
        }
      }
    };

    $scope.toggleSelectAll = function () {
      if (!$scope.selectalldes) {
        $("#selectAll").find("i").addClass("selected");
        $scope.selectedDes = [];
        for (var l = 0; l < $scope.mappedDataElements.length; l++) {
          if ($scope.mappedDataElements[l].deid !== undefined) {
            $scope.selectedDes[$scope.mappedDataElements[l].deid] = $scope.mappedDataElements[l];
          }
        }
        $scope.updateSelectionIcons($scope.selectedDes, "deadd");
      } else {
        $("#selectAll").find("i").removeClass("selected");
        $scope.selectedDes = [];
        $scope.updateSelectionIcons($scope.mappedDataElements, "deremove");
      }
      $scope.updateSelections("de");
      $scope.selectalldes = !$scope.selectalldes;
    }

    $scope.generateReport = function (type) {
      if (type == "ev") $scope.loadMetaDataEv();
      else $scope.loadMetaDataEn();
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
            ($scope.elementsMap[selectedPsId + "_" + deid] === undefined) ? value = 0: value = $scope.elementsMap[selectedPsId + "_" + deid];
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
          for (var j = 0; j < Object.keys($scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].selectedPS).length; j++) {
            var prid = $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].id;

            var selectedPsId = Object.keys($scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].selectedPS)[j];

            var table = "<div id='div_" + selectedPsId + "' class='container'><table class='table table-hovered table-bordered table-striped custom-data-table' id='table_" + selectedPsId + "'>";

            var programHeaderRow = "<thead><tr><th colspan='3'>Program:  " + $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].name + "<span class='icon-div' onClick='fnExcelReport(table_" + selectedPsId + ")'><i class='fa fa-download icon-table' data-toggle='tooltip' data-placement='top' title='Export this table in excel'></i></span><span class='icon-div'><i class='fa fa-bar-chart icon-table' data-toggle='tooltip' data-placement='top' title='Switch to graph'></i></span></th></tr>";

            var programStageHeaderRow = "<tr><th colspan='3'>Program Stage:  " + $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[i]].selectedPS[selectedPsId] + "<p style='float:right;color:white'>Total Enrollments : " + $scope.elementsMap[selectedPsId] + "</p></th></tr>";

            var deHeaderRow = "<tr><th>Data Elements</th><th>Count</th><th>Percentage (%)</th></tr></thead>"
            var selectedDeRow = "";
            for (var k = 0; k < Object.keys($scope.selectedDes).length; k++) {
              var DePsId = $scope.selectedDes[Object.keys($scope.selectedDes)[k]].psid;
              var value = "";
              ($scope.elementsMap[selectedPsId + "_" + deid] === undefined) ? value = 0: value = $scope.elementsMap[selectedPsId + "_" + deid];
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
      }
    };


    $scope.loadMetaDataEv = function () {
      $scope.elementsMap = [];
      document.getElementById('loader2').style.display = "block";
      document.getElementById("loadtext").innerHTML = "loading metadata.."
      MetadataService.getEvents($scope.selectedOrgUnit.id, $scope.startdate, $scope.enddate).then(function (data) {
        var events = data.events;
        for (var p = 0; p < events.length; p++) {
          var perc = ((p / events.length - 1) * 100).toFixed(2);
          document.getElementById("loadtext").innerHTML = perc + "% metadata loaded!";
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

    $scope.home = function () {
      var host = $window.location.href;
      var newLocation = host.split('api')[0] + "dhis-web-dashboard-integration/index.html";
      $window.location.href = newLocation;
    }


  });