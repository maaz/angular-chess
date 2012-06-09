var ChessCtrl;

ChessCtrl = (function() {

  function ChessCtrl($scope) {
    $scope.grid = new Grid();
    $scope.grid.initialize();
    $scope.whiteTurn = true;
    $scope.selectedPosition = null;
    $scope.currentColor = function() {
      if ($scope.whiteTurn) {
        return 'white';
      } else {
        return 'black';
      }
    };
    $scope.moveMessage = function() {
      if ($scope.selectedPosition) {
        return "Please select final position";
      } else {
        return "Please select initial position";
      }
    };
    $scope.getLabel = function(x, y) {
      var _ref, _ref2;
      return ((_ref = $scope.grid.getPosition(x, y)) != null ? (_ref2 = _ref.getPlayer()) != null ? _ref2.getLabel() : void 0 : void 0) || "";
    };
    $scope.isSelected = function(x, y) {
      var box_class, classes, isBlack, position;
      classes = ['box'];
      box_class = 'chess-white';
      isBlack = x % 2 === 0;
      isBlack = y % 2 === 0 ? isBlack : !isBlack;
      classes.push(isBlack ? 'chess-black' : 'chess-white');
      position = $scope.grid.getPosition(x, y);
      if ((position != null ? position.getPlayer() : void 0) != null) {
        classes.push("has-player");
      }
      if ($scope.selectedPosition) {
        if ($scope.selectedPosition === position) {
          classes.push('current-selected');
        } else if ($scope.selectedPosition.canReach(position)) {
          classes.push('reachable');
          if (position != null ? position.hasPlayer() : void 0) {
            classes.push('chess-kill');
          }
        }
      }
      return classes.join(' ');
    };
    $scope.select = function(x, y) {
      var player, position;
      $scope.errorMessage = '';
      position = $scope.grid.getPosition(x, y);
      if (!$scope.selectedPosition) {
        if (position.getPlayer().getColor() === $scope.currentColor()) {
          $scope.selectedPosition = position;
        } else {
          $scope.errorMessage = 'Please select player of color: ' + $scope.currentColor();
          return;
        }
        return;
      }
      if (position === $scope.selectedPosition) {
        return $scope.selectedPosition = null;
      } else {
        if ($scope.selectedPosition.canReach(position)) {
          player = $scope.selectedPosition.getPlayer();
          if (position.hasPlayer()) {
            position.getPlayer()["delete"]();
            position.removePlayer();
          }
          position.setPlayer(player);
          player.setPosition(position);
          $scope.selectedPosition.removePlayer();
          $scope.selectedPosition = null;
          return $scope.whiteTurn = !$scope.whiteTurn;
        } else {
          return $scope.errorMessage = 'Invalid Move position.\
            Please select a different move position.';
        }
      }
    };
  }

  return ChessCtrl;

})();
