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
    $scope.selectedPs = [];
    $scope.selectedDes = []
    //onload functions
    window.onclick = function (event) {
      var modal = document.getElementById("myModal");
      var span = document.getElementsByClassName("closeit")[0];
      if (event.target == span) {
        modal.style.display = "none";
      }

      $(".selected").addClass("fa-check");
    }

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
        $timeout(function () {
          $scope.selectedOrgUnit = orgUnit;
          if ($scope.popup == 'ou') {
            $scope.updateSelections("ou");
          }
        });
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
        for (var j = 0; j < stages.programStages.length; j++) {
          $scope.programStages.push(stages.programStages[j]);
        }
      });
    };


    //function to change selections in popup

    $scope.updateSelections = function (value) {
      switch (value) {
        case "ou":
          $('#selectedItem').text($scope.selectedOrgUnit.name);
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
          break;

        case "de":
          break;

        default:
          break;
      }
    };

    // function to view popups
    $scope.updatePopup = function (v) {
      if (v == 'ou') {
        $scope.popup = 'ou';
        $('#selectedItem').text($scope.selectedOrgUnit === undefined ? "" : $scope.selectedOrgUnit.name);
        selection.load();
      }
      if (v == 'pr') {
        $scope.popup = 'pr';
        var totalPrograms = Object.keys($scope.selectedPrograms).length;
        if (totalPrograms != 0) {
          var firstProgram = $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[0]].name;
          (totalPrograms == 1) ? $('#selectedItem').text(firstProgram): $('#selectedItem').text(firstProgram + ", +" + (totalPrograms - 1));
        } else {
          $('#selectedItem').text("");
        }
      }
      if (v == 'ps') {
        $scope.popup = 'ps';
        $('#selectedItem').text(($scope.selectedPs[0] === undefined ? "" : $scope.selectedPs[0] + ", +") + $scope.selectedPs.length == 0 ? "" : $scope.selectedPs.length);
      }
      if (v == 'de') {
        $scope.popup = 'de';
        $('#selectedItem').text(($scope.selectedDes[0] === undefined ? "" : $scope.selectedDes[0] + ", +") + $scope.selectedDes.length == 0 ? "" : $scope.selectedDes.length);
      }
      document.getElementById('loader').style.display = "block";
      $timeout(function () {
        document.getElementById('myModal').style.display = 'block';
        document.getElementById('loader').style.display = "none";
      }, 1000);

    };

    $scope.params = function (v) {

      switch ($scope.popup) {

        case "ou":
          $('#ouBtn').html("<i class='fa fa-plus'></i> " + $scope.selectedOrgUnit === undefined ? "" : $scope.selectedOrgUnit.name);
          $("#ouBtn").addClass("btn-success");
          break;

        case "pr":
          var totalPrograms = Object.keys($scope.selectedPrograms).length;
          if (totalPrograms != 0) {
            var firstProgram = $scope.selectedPrograms[Object.keys($scope.selectedPrograms)[0]].name;
            (totalPrograms == 1) ? $('#prBtn').html("<i class='fa fa-plus'></i> " + firstProgram): $('#prBtn').html("<i class='fa fa-plus'></i> " + (firstProgram + ", +" + (totalPrograms - 1)));
            $("#prBtn").addClass("btn-success");
            $scope.updateProgramStages($scope.selectedPrograms);
          }
          break;

        case "ps":
          break;

        case "de":
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
        $this.addClass('selected fa-check');
      } else {
        delete $scope.selectedPrograms[pr.id];
        $this.removeClass('selected fa-check');
      }
      $scope.updateSelections("pr");
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
  });