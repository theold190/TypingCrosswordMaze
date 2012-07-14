var BOARD_ROWS = 5,
    BOARD_COLS = 5;
var CELL_WIDTH  = 80,
    CELL_HEIGHT = 80;
var BOARD_LEFT = 0,
    BOARD_TOP  = 0;
var BOARD_WIDTH  = BOARD_COLS*CELL_WIDTH,
    BOARD_HEIGHT = BOARD_ROWS*CELL_HEIGHT;

var CELL_TYPE_FINISH = 0,
    CELL_TYPE_SOLID  = 1,
    CELL_TYPE_LETTER = 2,
    CELL_TYPE_GOLDEN = 3;

Crafty.c("Cell", {
    ready: true,
    init: function() {
        this.addComponent("2D, Canvas, Color, Text");
        this.attr({w:CELL_WIDTH, h:CELL_HEIGHT});
        this.textColor('#000000', 1);
        this.textFont({size: '50px', family: 'Arial'});
    },
    _type: CELL_TYPE_LETTER,
    _makeCell: function(x, y, type, text) {
        var CELL_COLORS = ["#00F", '#000', '#FFF', "#FFF"];
        var TEXT_COLORS = ['#000000', '#FFD700'];
        this.attr({x: x, y: y}).color(CELL_COLORS[type]).text(text);
        this._type = type;

        if (this._type == CELL_TYPE_LETTER
            || this._type == CELL_TYPE_GOLDEN) {
            var index = this._type - CELL_TYPE_LETTER;
            this.textColor(TEXT_COLORS[index], 1);
        }
        return this;
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
    //CELL_TYPE: [CELL_TYPE_LETTER, CELL_TYPE_SOLID],
    CELL_TYPE: [CELL_TYPE_LETTER, CELL_TYPE_GOLDEN],
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
