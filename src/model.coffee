Rook# Creats a new Position class
# In Chess all items are positions.

TOTAL_HEIGHT = 8;
TOTAL_WIDTH = 8;
TOP = 1
BOTTOM = -1
LEFT = -1
RIGHT = 1

class Position
  constructor: (@x, @y, @grid) ->

  setPlayer: (player) ->
    @player = player

  getPlayer: () ->
    @player  

  removePlayer: () ->
    @player = null

  hasPlayer: () ->
    @player?

  # Ascending is +1 for going up and -1 for going down
  straight: (ascending) ->
    return @grid.getPosition(@x + (1 * ascending), @y)

  # if right is +1 we go right, if -1, we go left
  sideWays: (right) ->
    return @grid.getPosition(@x, @y + (1 * right))

  # Top, Right is 1, 1. Top Left is: 1, -1, Bottom right is: -1, +1, bottom left: -1, -1
  across: (top, right) ->
    return @grid.getPosition(@x + (1 * top), @y + (1 * right))

  canReach:(targetPosition) ->
    targetPosition in @player.potentialMoves()

# Function to move stright, i.e. Top or Bottom
straightFn = (direction) -> (position) -> position?.straight(direction)
# Function to move Sideways, i.e. Left or Right
sideWaysFn = (direction) -> (position) -> position?.sideWays(direction)
# Function to move across
acrossFn = (top, right) -> (position) -> position?.across(top, right)

# Function to iterate
iterateFn = (start, startFn) ->
  startCache = start
  moves = []
  while (true)
    start = startFn(start)
    if start
      if !start.hasPlayer()
        moves.push(start)
      else if start.hasPlayer() and start.getPlayer().getColor() != startCache.getPlayer().getColor()
        moves.push(start)
        break
      else
        break
    else 
      break
  return moves

class Grid
  constructor:() ->
    @grid = []

    for i in [0..7]
      @grid[i] = []
      for j in [0..7]
      	@grid[i].push(new Position(i, j, this))

  initialize:() ->
    colors = [
      'white',
      'black'
    ]

    # Create all the players at the correct positions
    rows = [0, 1, 6, 7]
    for rowValue,index in rows
    	for j in [0..7]
        color = colors[if index < 2 then 0 else 1]
        position = @grid[rowValue][j]
        player = null
        switch rowValue
          when 1, 6
            player = new Pawn(if index < 2 then TOP else BOTTOM)
          when 0, 7
            switch j
              when 0, 7
                player = new Rook()
              when 1, 6
                player = new Knight()
              when 2, 5
                player = new Bishop()
              when 3
                player = new Queen()
              when 4
                player = new King()  

        player.setColor(color)
        player.setPosition(position)
        position.setPlayer(player)

  getPosition:(x, y) ->
    @grid[x]?[y]
    
class Player
  setPosition: (@position) ->

  potentialMoves: () ->
    throw Error("Not Implemented")

  delete: () ->
    @deleted = true

  setColor: (@color) ->

  getColor: () ->
    @color

  getLabel: () ->
    throw new Error("Unimplemented getLabel()")

class Pawn extends Player
  # ascending is +1 or -1
  constructor: (@ascending) ->

  getLabel: () ->
    if @color == 'white'
      '\u2659'
    else
      '\u265F'

  potentialMoves: () ->
    result = [] 
    straight = @position.straight(@ascending)
    result.push(straight) if straight and !straight.hasPlayer()
    acrossMoveFn = (pos) =>
      pos and pos.getPlayer() and pos.getPlayer().getColor() != @color

    killMoveRight = @position.across(@ascending, RIGHT)
    result.push killMoveRight if acrossMoveFn(killMoveRight)
    killMoveLeft = @position.across(@ascending, LEFT)
    result.push killMoveLeft if acrossMoveFn(killMoveLeft)
    return result


##############################################################################################################
# Start Class Rook.
# Rook moves along a straight line always.
##############################################################################################################
class Rook extends Player

  getLabel: () ->
    if @color == 'white'
      '\u2656'
    else
      '\u265C'

  potentialMoves: () ->
	  result = []
	  
	  for fn in [straightFn(TOP), straightFn(BOTTOM), sideWaysFn(RIGHT), sideWaysFn(BOTTOM)]
	    result.push move for move in iterateFn(@position, fn)
	  return result

##############################################################################################################
# Start Class Bishop.
# Bishop moves across only.
##############################################################################################################
class Bishop extends Player

  getLabel: () ->
    if @color == 'white'
      '\u2657'
    else
      '\u265D'

  potentialMoves: ->
    result = []

    for fn in [acrossFn(TOP, RIGHT), acrossFn(TOP, LEFT), acrossFn(BOTTOM, LEFT), acrossFn(BOTTOM, RIGHT)]
      result.push move for move in iterateFn(@position, fn)

    return result

##############################################################################################################
# Start Class Knight.
# Knight moves two and half
##############################################################################################################
class Knight extends Player

  getLabel: () ->
    if @color == 'white'
      '\u2658'
    else
      '\u265E'

  potentialMoves: ->
    result = []

    horseMoveFn = (move2, move1) -> (position) ->
      startCache = position
      position = move2(position)
      position = move2(position)
      position = move1(position)
      if position
        if !position.getPlayer()
          return position
        else if position.getPlayer().getColor() != startCache.getPlayer().getColor()
          return position

    horseMoveFns = [
      horseMoveFn(straightFn(TOP), sideWaysFn(RIGHT))
      horseMoveFn(straightFn(TOP), sideWaysFn(LEFT)),      
      horseMoveFn(straightFn(BOTTOM), sideWaysFn(RIGHT)),
      horseMoveFn(straightFn(BOTTOM), sideWaysFn(LEFT)),
      horseMoveFn(sideWaysFn(RIGHT), straightFn(TOP)),
      horseMoveFn(sideWaysFn(RIGHT), straightFn(BOTTOM)),
      horseMoveFn(sideWaysFn(LEFT), straightFn(TOP)),
      horseMoveFn(sideWaysFn(LEFT), straightFn(BOTTOM))]

    for horseMoveFn in horseMoveFns
      potentialPosition = horseMoveFn(@position)
      result.push potentialPosition if potentialPosition

    return result  

##############################################################################################################
# Start Class Queen.
# Queen goes everywhere except Knight
##############################################################################################################
class Queen extends Player
  
  getLabel: () ->
    if @color == 'white'
      '\u2655'
    else
      '\u265B'

  potentialMoves: () ->
    result = []

    for fn in [acrossFn(TOP, RIGHT), acrossFn(TOP, LEFT), acrossFn(BOTTOM, LEFT), acrossFn(BOTTOM, RIGHT)]
      result.push move for move in iterateFn(@position, fn)

    for fn in [straightFn(TOP), straightFn(BOTTOM), sideWaysFn(RIGHT), sideWaysFn(BOTTOM)]
      result.push move for move in iterateFn(@position, fn)

    return result

##############################################################################################################
# Start Class King.
# King goes everywhere but one step at a time
##############################################################################################################
class King extends Player
  getLabel: () ->
    if @color == 'white'
      '\u2654'
    else
      '\u265A'

  potentialMoves: () ->
    result = []

    for fn in [
      acrossFn(TOP, RIGHT),
      acrossFn(TOP, LEFT),
      acrossFn(BOTTOM, LEFT),
      acrossFn(BOTTOM, RIGHT),
      straightFn(TOP),
      straightFn(BOTTOM),
      sideWaysFn(RIGHT),
      sideWaysFn(BOTTOM)
      ]
      result.push fn(@position) if (fn(@position) and (!fn(@position).getPlayer()? or fn(@position).getPlayer().getColor() != @color))

    return result
