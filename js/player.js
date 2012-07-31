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

var PLAYER_ZORDER = 1;
var STEP_WIDTH  = CELL_WIDTH,
    STEP_HEIGHT = CELL_HEIGHT;

Crafty.c("Player", {
    init: function() {
        this.addComponent("2D, DOM, KeyboardEvent, sprite_hero");
        this.attr({x: BOARD_LEFT, y: BOARD_TOP, w:CELL_WIDTH, h:CELL_HEIGHT, z: PLAYER_ZORDER});

        this.bind('KeyDown', function(e) {
            var moved = this._navigatePlayer(e.key);
            if (this._playerUpdateCallback != undefined) {
                this._playerUpdateCallback(this.x, this.y, moved);
            }
        });
    },
    _navigatePlayer: function(key) {
        if (this._canGoLeft()) {
            var cell = this._board._getCellOnLeft(this.x, this.y);
            if(cell._isAssignedKey(key)) {
                this._goLeft();
                return true;
            }
        }
        if (this._canGoRight()) {
            var cell = this._board._getCellOnRight(this.x, this.y);
            if(cell._isAssignedKey(key)) {
                this._goRight();
                return true;
            }
        }
        if (this._canGoUp()) {
            var cell = this._board._getCellOnTop(this.x, this.y);
            if(cell._isAssignedKey(key)) {
                this._goUp();
                return true;
            }
        }
        if (this._canGoDown()) {
            var cell = this._board._getCellOnBottom(this.x, this.y);
            if(cell._isAssignedKey(key)) {
                this._goDown();
                return true;
            }
        }

        // This is used for easier development, should be removed
        if (DEBUG == 1) {
            if(key == Crafty.keys['LEFT_ARROW']) {
                this._goLeft();
                return true;
            } else if (key == Crafty.keys['RIGHT_ARROW']) {
                this._goRight();
                return true;
            } else if (key == Crafty.keys['UP_ARROW']) {
                this._goUp();
                return true;
            } else if (key == Crafty.keys['DOWN_ARROW']) {
                this._goDown();
                return true;
            }
        }
        return false;
    },
    _setBoard: function(board) {
        this._board = board;
        return this;
    },
    _setUpdateCallback: function(callback) {
        this._playerUpdateCallback = callback;
    },
    _setStartPosition: function(x, y) {
        this.attr({x: x, y: y});
        return this;
    },
    _canGoToCell: function(cell) {
        if (cell == undefined || cell._type == CELL_TYPE_SOLID) {
            return false;
        }
        return true;
    },
    _canGoUp: function() {
        var cell = this._board._getCellOnTop(this.x, this.y);
        return this._canGoToCell(cell);
    },
    _canGoDown: function() {
        var cell = this._board._getCellOnBottom(this.x, this.y);
        return this._canGoToCell(cell);
    },
    _canGoLeft: function() {
        var cell = this._board._getCellOnLeft(this.x, this.y);
        return this._canGoToCell(cell);
    },
    _canGoRight: function() {
        var cell = this._board._getCellOnRight(this.x, this.y);
        return this._canGoToCell(cell);
    },
    _goUp: function () {
        if(this._canGoUp()) {this.y = this.y - STEP_HEIGHT;}
    },
    _goDown: function () {
        if(this._canGoDown()) {this.y = this.y + STEP_HEIGHT;}
    },
    _goLeft: function () {
        if(this._canGoLeft()) {this.x = this.x - STEP_WIDTH;}
    },
    _goRight: function () {
        if(this._canGoRight()) {this.x = this.x + STEP_WIDTH;}
    }
});
