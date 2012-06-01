# Create the Angular Controller for Chess

class ChessCtrl
  constructor: ($scope) ->
    # Initialize everything
    $scope.grid = new Grid()
    $scope.grid.initialize()
    $scope.whiteTurn = true
    $scope.selectedPosition = null

    $scope.currentColor = () ->
      if $scope.whiteTurn then 'white' else 'black'

    $scope.moveMessage = () ->
      if $scope.selectedPosition
        "Please select final position"
      else
        "Please select initial position"

    $scope.getLabel = (x, y) ->
      $scope.grid.getPosition(x, y)?.getPlayer()?.getLabel() or ""    

    $scope.isSelected = (x, y) ->
      classes = ['box']
      position = $scope.grid.getPosition(x, y)
      if $scope.selectedPosition
        if $scope.selectedPosition == position
          classes.push 'current-selected'
        else if $scope.selectedPosition.canReach(position)
          classes.push 'reachable'
      classes.join ' '      


    $scope.select = (x, y) ->
      $scope.errorMessage = ''
      position = $scope.grid.getPosition(x, y)

      # If Initial position is not selected, select initial position
      if !$scope.selectedPosition
      	if position.getPlayer().getColor() == $scope.currentColor()
      	  $scope.selectedPosition = position
      	else 
          $scope.errorMessage = 'Please select player of color: ' + $scope.currentColor()
          return
        return  

      # If we select the same position again, we are deselecting
      if position == $scope.selectedPosition
        $scope.selectedPosition = null
      # Now, we are selecting the final move position.
      else
        debugger;
        if $scope.selectedPosition.canReach(position)
          player = $scope.selectedPosition.getPlayer()
          if position.hasPlayer()
            position.getPlayer().delete()
            position.removePlayer()
          position.setPlayer(player)
          player.setPosition(position)
          $scope.selectedPosition.removePlayer()
          $scope.selectedPosition = null
          $scope.whiteTurn = !$scope.whiteTurn
        else
          $scope.errorMessage = 'Invalid Move position.
            Please select a different move position.'    

    


