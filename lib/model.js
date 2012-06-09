Rook;
var BOTTOM, Bishop, Grid, King, Knight, LEFT, Pawn, Player, Position, Queen, RIGHT, Rook, TOP, TOTAL_HEIGHT, TOTAL_WIDTH, acrossFn, iterateFn, sideWaysFn, straightFn,
  __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

TOTAL_HEIGHT = 8;

TOTAL_WIDTH = 8;

TOP = 1;

BOTTOM = -1;

LEFT = -1;

RIGHT = 1;

Position = (function() {

  function Position(x, y, grid) {
    this.x = x;
    this.y = y;
    this.grid = grid;
  }

  Position.prototype.setPlayer = function(player) {
    return this.player = player;
  };

  Position.prototype.getPlayer = function() {
    return this.player;
  };

  Position.prototype.removePlayer = function() {
    return this.player = null;
  };

  Position.prototype.hasPlayer = function() {
    return this.player != null;
  };

  Position.prototype.straight = function(ascending) {
    return this.grid.getPosition(this.x + (1 * ascending), this.y);
  };

  Position.prototype.sideWays = function(right) {
    return this.grid.getPosition(this.x, this.y + (1 * right));
  };

  Position.prototype.across = function(top, right) {
    return this.grid.getPosition(this.x + (1 * top), this.y + (1 * right));
  };

  Position.prototype.canReach = function(targetPosition) {
    return __indexOf.call(this.player.potentialMoves(), targetPosition) >= 0;
  };

  return Position;

})();

straightFn = function(direction) {
  return function(position) {
    return position != null ? position.straight(direction) : void 0;
  };
};

sideWaysFn = function(direction) {
  return function(position) {
    return position != null ? position.sideWays(direction) : void 0;
  };
};

acrossFn = function(top, right) {
  return function(position) {
    return position != null ? position.across(top, right) : void 0;
  };
};

iterateFn = function(start, startFn) {
  var moves, startCache;
  startCache = start;
  moves = [];
  while (true) {
    start = startFn(start);
    if (start) {
      if (!start.hasPlayer()) {
        moves.push(start);
      } else if (start.hasPlayer() && start.getPlayer().getColor() !== startCache.getPlayer().getColor()) {
        moves.push(start);
        break;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return moves;
};

Grid = (function() {

  function Grid() {
    var i, j;
    this.grid = [];
    for (i = 0; i <= 7; i++) {
      this.grid[i] = [];
      for (j = 0; j <= 7; j++) {
        this.grid[i].push(new Position(i, j, this));
      }
    }
  }

  Grid.prototype.initialize = function() {
    var color, colors, index, j, player, position, rowValue, rows, _len, _results;
    colors = ['white', 'black'];
    rows = [0, 1, 6, 7];
    _results = [];
    for (index = 0, _len = rows.length; index < _len; index++) {
      rowValue = rows[index];
      _results.push((function() {
        var _results2;
        _results2 = [];
        for (j = 0; j <= 7; j++) {
          color = colors[index < 2 ? 0 : 1];
          position = this.grid[rowValue][j];
          player = null;
          switch (rowValue) {
            case 1:
            case 6:
              player = new Pawn(index < 2 ? TOP : BOTTOM);
              break;
            case 0:
            case 7:
              switch (j) {
                case 0:
                case 7:
                  player = new Rook();
                  break;
                case 1:
                case 6:
                  player = new Knight();
                  break;
                case 2:
                case 5:
                  player = new Bishop();
                  break;
                case 3:
                  player = new Queen();
                  break;
                case 4:
                  player = new King();
              }
          }
          player.setColor(color);
          player.setPosition(position);
          _results2.push(position.setPlayer(player));
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };

  Grid.prototype.getPosition = function(x, y) {
    var _ref;
    return (_ref = this.grid[x]) != null ? _ref[y] : void 0;
  };

  return Grid;

})();

Player = (function() {

  function Player() {}

  Player.prototype.setPosition = function(position) {
    this.position = position;
  };

  Player.prototype.potentialMoves = function() {
    throw Error("Not Implemented");
  };

  Player.prototype["delete"] = function() {
    return this.deleted = true;
  };

  Player.prototype.setColor = function(color) {
    this.color = color;
  };

  Player.prototype.getColor = function() {
    return this.color;
  };

  Player.prototype.getLabel = function() {
    throw new Error("Unimplemented getLabel()");
  };

  return Player;

})();

Pawn = (function(_super) {

  __extends(Pawn, _super);

  function Pawn(ascending) {
    this.ascending = ascending;
  }

  Pawn.prototype.getLabel = function() {
    if (this.color === 'white') {
      return '\u2659';
    } else {
      return '\u265F';
    }
  };

  Pawn.prototype.potentialMoves = function() {
    var acrossMoveFn, killMoveLeft, killMoveRight, result, straight,
      _this = this;
    result = [];
    straight = this.position.straight(this.ascending);
    if (straight && !straight.hasPlayer()) result.push(straight);
    acrossMoveFn = function(pos) {
      return pos && pos.getPlayer() && pos.getPlayer().getColor() !== _this.color;
    };
    killMoveRight = this.position.across(this.ascending, RIGHT);
    if (acrossMoveFn(killMoveRight)) result.push(killMoveRight);
    killMoveLeft = this.position.across(this.ascending, LEFT);
    if (acrossMoveFn(killMoveLeft)) result.push(killMoveLeft);
    return result;
  };

  return Pawn;

})(Player);

Rook = (function(_super) {

  __extends(Rook, _super);

  function Rook() {
    Rook.__super__.constructor.apply(this, arguments);
  }

  Rook.prototype.getLabel = function() {
    if (this.color === 'white') {
      return '\u2656';
    } else {
      return '\u265C';
    }
  };

  Rook.prototype.potentialMoves = function() {
    var fn, move, result, _i, _j, _len, _len2, _ref, _ref2;
    result = [];
    _ref = [straightFn(TOP), straightFn(BOTTOM), sideWaysFn(RIGHT), sideWaysFn(BOTTOM)];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      fn = _ref[_i];
      _ref2 = iterateFn(this.position, fn);
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        move = _ref2[_j];
        result.push(move);
      }
    }
    return result;
  };

  return Rook;

})(Player);

Bishop = (function(_super) {

  __extends(Bishop, _super);

  function Bishop() {
    Bishop.__super__.constructor.apply(this, arguments);
  }

  Bishop.prototype.getLabel = function() {
    if (this.color === 'white') {
      return '\u2657';
    } else {
      return '\u265D';
    }
  };

  Bishop.prototype.potentialMoves = function() {
    var fn, move, result, _i, _j, _len, _len2, _ref, _ref2;
    result = [];
    _ref = [acrossFn(TOP, RIGHT), acrossFn(TOP, LEFT), acrossFn(BOTTOM, LEFT), acrossFn(BOTTOM, RIGHT)];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      fn = _ref[_i];
      _ref2 = iterateFn(this.position, fn);
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        move = _ref2[_j];
        result.push(move);
      }
    }
    return result;
  };

  return Bishop;

})(Player);

Knight = (function(_super) {

  __extends(Knight, _super);

  function Knight() {
    Knight.__super__.constructor.apply(this, arguments);
  }

  Knight.prototype.getLabel = function() {
    if (this.color === 'white') {
      return '\u2658';
    } else {
      return '\u265E';
    }
  };

  Knight.prototype.potentialMoves = function() {
    var horseMoveFn, horseMoveFns, potentialPosition, result, _i, _len;
    result = [];
    horseMoveFn = function(move2, move1) {
      return function(position) {
        var startCache;
        startCache = position;
        position = move2(position);
        position = move2(position);
        position = move1(position);
        if (position) {
          if (!position.getPlayer()) {
            return position;
          } else if (position.getPlayer().getColor() !== startCache.getPlayer().getColor()) {
            return position;
          }
        }
      };
    };
    horseMoveFns = [horseMoveFn(straightFn(TOP), sideWaysFn(RIGHT)), horseMoveFn(straightFn(TOP), sideWaysFn(LEFT)), horseMoveFn(straightFn(BOTTOM), sideWaysFn(RIGHT)), horseMoveFn(straightFn(BOTTOM), sideWaysFn(LEFT)), horseMoveFn(sideWaysFn(RIGHT), straightFn(TOP)), horseMoveFn(sideWaysFn(RIGHT), straightFn(BOTTOM)), horseMoveFn(sideWaysFn(LEFT), straightFn(TOP)), horseMoveFn(sideWaysFn(LEFT), straightFn(BOTTOM))];
    for (_i = 0, _len = horseMoveFns.length; _i < _len; _i++) {
      horseMoveFn = horseMoveFns[_i];
      potentialPosition = horseMoveFn(this.position);
      if (potentialPosition) result.push(potentialPosition);
    }
    return result;
  };

  return Knight;

})(Player);

Queen = (function(_super) {

  __extends(Queen, _super);

  function Queen() {
    Queen.__super__.constructor.apply(this, arguments);
  }

  Queen.prototype.getLabel = function() {
    if (this.color === 'white') {
      return '\u2655';
    } else {
      return '\u265B';
    }
  };

  Queen.prototype.potentialMoves = function() {
    var fn, move, result, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4;
    result = [];
    _ref = [acrossFn(TOP, RIGHT), acrossFn(TOP, LEFT), acrossFn(BOTTOM, LEFT), acrossFn(BOTTOM, RIGHT)];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      fn = _ref[_i];
      _ref2 = iterateFn(this.position, fn);
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        move = _ref2[_j];
        result.push(move);
      }
    }
    _ref3 = [straightFn(TOP), straightFn(BOTTOM), sideWaysFn(RIGHT), sideWaysFn(BOTTOM)];
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      fn = _ref3[_k];
      _ref4 = iterateFn(this.position, fn);
      for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
        move = _ref4[_l];
        result.push(move);
      }
    }
    return result;
  };

  return Queen;

})(Player);

King = (function(_super) {

  __extends(King, _super);

  function King() {
    King.__super__.constructor.apply(this, arguments);
  }

  King.prototype.getLabel = function() {
    if (this.color === 'white') {
      return '\u2654';
    } else {
      return '\u265A';
    }
  };

  King.prototype.potentialMoves = function() {
    var fn, result, _i, _len, _ref;
    result = [];
    _ref = [acrossFn(TOP, RIGHT), acrossFn(TOP, LEFT), acrossFn(BOTTOM, LEFT), acrossFn(BOTTOM, RIGHT), straightFn(TOP), straightFn(BOTTOM), sideWaysFn(RIGHT), sideWaysFn(BOTTOM)];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      fn = _ref[_i];
      if (fn(this.position) && (!(fn(this.position).getPlayer() != null) || fn(this.position).getPlayer().getColor() !== this.color)) {
        result.push(fn(this.position));
      }
    }
    return result;
  };

  return King;

})(Player);
