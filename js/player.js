var STEP_WIDTH  = 60,
    STEP_HEIGHT = 60;

Crafty.c("Player", {
    init: function() {
        this.addComponent("2D, Canvas, Color, KeyboardEvent");
        this.attr({x: BOARD_LEFT, y: BOARD_TOP, w:CELL_WIDTH, h:CELL_HEIGHT});
        this.color("#FFAA11");

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
    _canGoUp: function() {
        var cell = this._board._getCellOnTop(this.x, this.y);
        if (cell == undefined || cell._type == CELL_TYPE_SOLID) {
            return false;
        }
        return true;
    },
    _canGoDown: function() {
        var cell = this._board._getCellOnBottom(this.x, this.y);
        if (cell == undefined || cell._type == CELL_TYPE_SOLID) {
            return false;
        }
        return true;
    },
    _canGoLeft: function() {
        var cell = this._board._getCellOnLeft(this.x, this.y);
        if (cell == undefined || cell._type == CELL_TYPE_SOLID) {
            return false;
        }
        return true;
    },
    _canGoRight: function() {
        var cell = this._board._getCellOnRight(this.x, this.y);
        if (cell == undefined || cell._type == CELL_TYPE_SOLID) {
            return false;
        }
        return true;
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
