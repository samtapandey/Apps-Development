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
  .controller('elementsController', function ($rootScope,
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
    //onload functions
    window.onclick = function (event) {
      $(".selected").addClass("fa-check");
    }

    //date load
    $(function () {
      $('input[name="daterange"]').daterangepicker({
        opens: 'left'
      }, function (start, end, label) {
        $scope.startdate = start.format('YYYY-MM-DD');
        $scope.enddate = end.format('YYYY-MM-DD');
        console.log("A new date selection was made: " + +' to ' + end.format('YYYY-MM-DD'));
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
          // for (var g = 0; g < stages.programStages[j].programStageDataElements.length; g++) {
          $scope.programStagesDataElements[stages.programStages[j].id] = stages.programStages[j].programStageDataElements;
          // }
        }
      });
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
          $('#ouBtn').html("<i class='fa fa-plus'></i> " + ($scope.selectedOrgUnit === undefined ? "" : $scope.selectedOrgUnit.name));
          $("#ouBtn").addClass("btn-success");
          break;

        case "pr":
          var totalPrograms = Object.keys($scope.selectedPrograms).length;
          if (totalPrograms != 0) {
            var firstProgram = $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[0]].name;
            (totalPrograms == 1) ? $('#prBtn').html("<i class='fa fa-plus'></i> " + firstProgram): $('#prBtn').html("<i class='fa fa-plus'></i> " + (firstProgram + ", +" + (totalPrograms - 1)));
            $("#prBtn").addClass("btn-success");
            $scope.updateProgramStages($scope.selectedPrograms);
          } else {
            $('#prBtn').html("<i class='fa fa-plus'></i> Select Program");
            $("#prBtn").removeClass("btn-success");
          }
          break;

        case "ps":
          var totalProgramStages = Object.keys($scope.selectedProgramStages).length;
          if (totalProgramStages != 0) {
            var firstProgramStage = $scope.selectedProgramStages[Object.keys($scope.selectedProgramStages)[0]].name;
            (totalProgramStages == 1) ? $('#psBtn').html("<i class='fa fa-plus'></i> " + firstProgramStage): $('#psBtn').html("<i class='fa fa-plus'></i> " + (firstProgramStage + ", +" + (totalProgramStages - 1)));
            $("#psBtn").addClass("btn-success");
            $scope.updateDataElements($scope.selectedProgramStages);
          } else {
            $('#psBtn').html("<i class='fa fa-plus'></i> Select Program Stage");
            $("#psBtn").removeClass("btn-success");
          }
          break;

        case "de":
          var totalDes = Object.keys($scope.selectedDes).length;
          if (totalDes != 0) {
            var firstDe = $scope.selectedDes[Object.keys($scope.selectedDes)[0]].dename;
            (totalDes == 1) ? $('#deBtn').html("<i class='fa fa-plus'></i> " + firstDe): $('#deBtn').html("<i class='fa fa-plus'></i> " + (firstDe + ", +" + (totalDes - 1)));
            $("#deBtn").addClass("btn-success");
            console.log($scope.selectedDes);
          } else {
            $('#deBtn').html("<i class='fa fa-plus'></i> Select Data Elements");
            $("#deBtn").removeClass("btn-success");
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
        $this.addClass('selected');
      } else {
        delete $scope.selectedProgramStages[ps.id];
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
          // console.log(Object.keys(arr)[k] + "---"  + $scope.programStages[i].program.name);
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
          // console.log(Object.keys(arr)[k] + "---"  + $scope.programStages[i].program.name);
          $scope.mappedDataElements.push({
            'pr': arr[Object.keys(arr)[k]].program.name,
            'ps': arr[Object.keys(arr)[k]].name,
            'dename': psde[i].dataElement.name,
            'deid': psde[i].dataElement.id
          });
        }
      }
      console.log($scope.mappedDataElements);
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

    $scope.generateReport = function () {
      console.log($scope.startdate + " - -- -- - " + $scope.enddate);
    };
  });