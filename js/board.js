// Crossword Maze is a javascript game where you practice typing
// while having fun.
// Copyright (C) 2012  Oleg Krasnukhin
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
    CELL_TYPE_PORTAL = 1;
    CELL_TYPE_SOLID  = 2,
    CELL_TYPE_NORMAL = 3,
    CELL_TYPE_GOLDEN = 4,
    CELL_TYPE_DANGER = 5;

var TEXT_COLOR_NORMAL = '#000000',
    TEXT_COLOR_GOLDEN = '#FFD700',
    TEXT_COLOR_DANGER = '#FF0000';

var BOARD_LETTERS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

// Cell should have indexes in a board and not x and y as coordinates
// This way it will be easier to search cells
Crafty.c("Cell", {
    init: function() {
        this.addComponent("2D, DOM");
        this.attr({w:CELL_WIDTH, h:CELL_HEIGHT});
    },
    _type: CELL_TYPE_NORMAL,
    _makeCell: function(x, y, type, text) {
        this.attr({x: x, y: y});
        this._type = type;

        if (this._type == CELL_TYPE_NORMAL
            || this._type == CELL_TYPE_GOLDEN
            || this._type == CELL_TYPE_DANGER)
        {
            var TEXT_COLORS = [TEXT_COLOR_NORMAL, TEXT_COLOR_GOLDEN, TEXT_COLOR_DANGER];
            var index = this._type - CELL_TYPE_NORMAL;
            if(!this.has("Text")) {
                this.addComponent("Text");
                this.css({textAlign: 'center'});
                this.textFont({size: '50px', family: 'Arial'});
            }
            this.textColor(TEXT_COLORS[index], 1);
            this.text(text);

            if(!this.has("Sprite")) {
                if(Crafty.math.randomInt(1,100) < 40) {
                    this.addComponent("sprite_grass_"+Crafty.math.randomInt(1,8));
                } else {
                    this.addComponent("sprite_grass");
                }
            }
        } else if (this._type == CELL_TYPE_FINISH) {
            if(this.has("Sprite")) {
                this.removeComponent("Sprite");
            }
            this.addComponent("sprite_finish");
        } else if (this._type == CELL_TYPE_PORTAL) {
            if(this.has("Sprite")) {
                this.removeComponent("Sprite");
            }
            this.addComponent("sprite_portal");
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
        this._makeCell(this.x, this.y, CELL_TYPE_GOLDEN, this.text());
    },
    _removeGold: function() {
        this._makeCell(this.x, this.y, CELL_TYPE_NORMAL, this.text());
    },
    _setDanger: function() {
        this._makeCell(this.x, this.y, CELL_TYPE_DANGER, this.text());
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
        if ((this._type == CELL_TYPE_FINISH
            || this._type == CELL_TYPE_PORTAL)
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
    init: function() {
        this.addComponent("2D, Canvas, sprite_background");
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
                                                     Crafty.math.randomElementOfArray(BOARD_LETTERS));
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
    // This methods should be in Cell, but in that case I have refresh problems
    // if golden letter is removed from the left. Finish is refreshed
    // partially - to the width of the text (" ") in it.
    _setAsPortal: function(cell) {
        var newCell = Crafty.e("Cell")._makeCell(cell.x, cell.y, CELL_TYPE_PORTAL, cell.text());
        this._replaceCell(cell, newCell);
    },
    _setAsFinish: function(cell) {
        var newCell = Crafty.e("Cell")._makeCell(cell.x, cell.y, CELL_TYPE_FINISH, cell.text());
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
