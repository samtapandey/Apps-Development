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
      var span = document.getElementsByClassName("close")[0];
      if (event.target == span) {
        modal.style.display = "none";
      }
    }
    $(document).on('keyup', function (evt) {
      if (evt.keyCode == 27) {
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
      }
      if (evt.keyCode == 13) {
        execute();
      }
    });

    //initially load tree
    selection.load();

    // Listen for OU changes
    selection.setListenerFunction(function () {
      $scope.selectedOrgUnitUid = selection.getSelected();
      loadPrograms();
    }, false);

    loadPrograms = function () {
      MetadataService.getOrgUnit($scope.selectedOrgUnitUid).then(function (orgUnit) {
        $timeout(function () {
          $scope.selectedOrgUnit = orgUnit;
          if ($scope.popup == 'ou') {
            $('#selectedItem').text($scope.selectedOrgUnit.name);
          }
        });
      });
    }

    // function to view popups
    $scope.updatePopup = function (v) {
      if (v == 'ou') {
        $scope.popup = 'ou';
        $('#selectedItem').text($scope.selectedOrgUnit === undefined ? "" : $scope.selectedOrgUnit.name);
        selection.load();
      }
      if (v == 'pr') {
        $scope.popup = 'pr';
        $('#selectedItem').text(($scope.selectedPrograms[0] === undefined ? "" : $scope.selectedPrograms[0] + ", +") + $scope.selectedPrograms.length == 0 ? "" : $scope.selectedPrograms.length);
      }
      if (v == 'ps') {
        $scope.popup = 'ps';
        // $('#selectedItem').text($scope.selectedPs[0] + ", +" + $scope.selectedPs.length);
        $('#selectedItem').text(($scope.selectedPs[0] === undefined ? "" : $scope.selectedPs[0] + ", +") + $scope.selectedPs.length == 0 ? "" : $scope.selectedPs.length);
      }
      if (v == 'de') {
        $scope.popup = 'de';
        // $('#selectedItem').text($scope.selectedDes[0] + ", +" + $scope.selectedDes.length);
        $('#selectedItem').text(($scope.selectedDes[0] === undefined ? "" : $scope.selectedDes[0] + ", +") + $scope.selectedDes.length == 0 ? "" : $scope.selectedDes.length);
      }
      document.getElementById('loader').style.display = "block";
      $timeout(function () {
        document.getElementById('myModal').style.display = 'block';
        document.getElementById('loader').style.display = "none";
      }, 1000);

    };

    $scope.params = function (v) {

      if ($scope.popup == 'ou') {
        $('#ouBtn').html("<i class='fa fa-plus'></i> " + $scope.selectedOrgUnit.name);
        $("#ouBtn").addClass("btn-success");
      }
      if ($scope.popup == 'pr') {

      }
      if ($scope.popup == 'ps') {

      }
      if ($scope.popup == 'de') {

      }
      document.getElementById('myModal').style.display = 'none';
    }
  });