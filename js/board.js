// Select size the way so text in cells doesn't go outsice of boudaries
// (it will not cause a crash, but not all cells will be updated)
var BOARD_ROWS = 5,
    BOARD_COLS = 5;
var CELL_WIDTH  = DISPLAY_WIDTH/BOARD_COLS,
    CELL_HEIGHT = DISPLAY_WIDTH/BOARD_ROWS;
var BOARD_LEFT = 0,
    BOARD_TOP  = 0;
var BOARD_WIDTH  = BOARD_COLS*CELL_WIDTH,
    BOARD_HEIGHT = BOARD_ROWS*CELL_HEIGHT;

var CELL_TYPE_FINISH = 0,
    CELL_TYPE_SOLID  = 1,
    CELL_TYPE_NORMAL = 2,
    CELL_TYPE_GOLDEN = 3,
    CELL_TYPE_DANGER = 4;

var CELL_COLOR_FINISH = "#00F",
    CELL_COLOR_SOLID  = '#000',
    CELL_COLOR_NORMAL = '#FFF',
    CELL_COLOR_GOLDEN = "#FFF",
    CELL_COLOR_DANGER = "#FFF";

var TEXT_COLOR_NORMAL = '#000000',
    TEXT_COLOR_GOLDEN = '#FFD700',
    TEXT_COLOR_DANGER = '#FF0000';

// Cell should have indexes in a board and not x and y as coordinates
// This way it will be easier to search cells
Crafty.c("Cell", {
    init: function() {
        this.addComponent("2D, Canvas, Color");
        this.attr({w:CELL_WIDTH, h:CELL_HEIGHT});
    },
    _type: CELL_TYPE_SOLID,
    _makeCell: function(x, y, type, text) {
        var CELL_COLORS = [CELL_COLOR_FINISH, CELL_COLOR_SOLID, CELL_COLOR_NORMAL, CELL_COLOR_GOLDEN, CELL_COLOR_DANGER];
        this.attr({x: x, y: y}).color(CELL_COLORS[type]);
        this._type = type;

        if (this._type == CELL_TYPE_NORMAL
            || this._type == CELL_TYPE_GOLDEN
            || this._type == CELL_TYPE_DANGER)
        {
            var TEXT_COLORS = [TEXT_COLOR_NORMAL, TEXT_COLOR_GOLDEN, TEXT_COLOR_DANGER];
            var index = this._type - CELL_TYPE_NORMAL;
            if(!this.has("Text")) {
                this.addComponent("Text");
                this.textFont({size: '50px', family: 'Arial'});
            }
            this.textColor(TEXT_COLORS[index], 1);
            this.text(text);
        }
        return this;
    },
    _isSame: function(cell) {
        if (this.x == cell.x && this.y == cell.y) {
            return true;
        }
        return false;
    },
    _setGold: function() {
        this._makeCell(this.x, this.y, CELL_TYPE_GOLDEN, this.text);
    },
    _removeGold: function() {
        this._makeCell(this.x, this.y, CELL_TYPE_NORMAL, this.text);
    },
    _setDanger: function() {
        this._makeCell(this.x, this.y, CELL_TYPE_DANGER, this.text);
    },
    _removeDanger: function() {
        this._setGold();
    },
    _isInsideCell: function(x, y) {
        if (this.x <= x && this.x+this.w > x) {
            if (this.y <= y && this.y+this.h > y) {
                return true;
            }
        }
        return false;
    },
    _isAssignedKey: function(key) {
        if (key == Crafty.keys[this._text]) {
            return true;
        }
        if (this._type == CELL_TYPE_FINISH
            && (key == Crafty.keys['SPACE']
                || key == Crafty.keys['ENTER']))
        {
            return true;
        }
        return false;
    }
});

Crafty.c("Board", {
    //CELL_TYPE: [CELL_TYPE_NORMAL, CELL_TYPE_SOLID],
    CELL_TYPE: [CELL_TYPE_NORMAL, CELL_TYPE_GOLDEN, CELL_TYPE_DANGER],
    LETTERS: ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
    //LETTERS: ["A"],
    init: function() {
        this.addComponent("2D, Canvas");
        this.attr({x: BOARD_LEFT, y: BOARD_TOP, w:BOARD_WIDTH, h:BOARD_HEIGHT});
        this._setupBoard(this.x, this.y, BOARD_ROWS, BOARD_COLS, CELL_WIDTH, CELL_HEIGHT);
    },
    _setupBoard: function(x, y, rows, cols, cw, ch) {
        this._board = [];
        for (var i=0; i<cols; i++) {
            this._board[i] = [];
            for (var j=0; j<rows; j++) {
                var cell = Crafty.e("Cell")._makeCell(x + i*cw,
                                                     y + j*ch,
                                                     Crafty.math.randomElementOfArray(this.CELL_TYPE),
                                                     Crafty.math.randomElementOfArray(this.LETTERS));
                this._board[i][j] = cell;
            }
        }
    },
    _replaceCell: function(oldCell, newCell) {
        var cols = this._board.length;
        var rows = this._board[0].length;

        for (var i=0; i<cols; i++) {
            for (var j=0; j<rows; j++) {
                if(this._board[i][j]._isSame(oldCell)) {
                    this._board[i][j].destroy();
                    this._board[i][j] = newCell;
                }
            }
        }
    },
    // This method should be in Cell, but in that case I have refresh problems
    // if golden letter is removed from the left. Finish is refreshed
    // partially - to the width of the text (" ") in it.
    _setAsFinish: function(cell) {
        var newCell = Crafty.e("Cell")._makeCell(cell.x, cell.y, CELL_TYPE_FINISH, cell.text);
        this._replaceCell(cell, newCell);
    },
    _getRandomCell: function(type) {
        var cols = this._board.length;
        var rows = this._board[0].length;
        var cell, first = false;
        if(type == undefined) {first = true;}

        do {
            var i = Crafty.math.randomInt(0, cols-1);
            var j = Crafty.math.randomInt(0, rows-1);
            cell = this._board[i][j];
        } while (!first && cell._type != type);
        return cell;
    },
    _getCell: function(x, y) {
        var cols = this._board.length;
        var rows = this._board[0].length;

        for (var i=0; i<cols; i++) {
            for (var j=0; j<rows; j++) {
                if(this._board[i][j]._isInsideCell(x,y)) {
                    return this._board[i][j];
                }
            }
        }
    },
    _getCellOnTop: function(x, y) {
        return this._getCell(x, y-CELL_HEIGHT);
    },
    _getCellOnBottom: function(x, y) {
        return this._getCell(x, y+CELL_HEIGHT);
    },
    _getCellOnLeft: function(x, y) {
        return this._getCell(x-CELL_WIDTH, y);
    },
    _getCellOnRight: function(x, y) {
        return this._getCell(x+CELL_WIDTH, y);
    }
});
