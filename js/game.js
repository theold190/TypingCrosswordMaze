Crafty.c("Game", {
    init: function() {
        this.addComponent("");
        this.bind('KeyDown', function(e) {
            if (this._isNextScreenKey(e.key)) {
                if (this._isGameEnded()) {
                    this._startGame(this._totalGames);
                    return;
                }
                if (this._isRoundEnded()) {
                    this._startRound();
                    return;
                }
                if (this._isGameStart()) {
                    this._startRound();
                    return;
                }
            }
        });
    },
    _isGameEnded: function() {
        var screens = Crafty('FinalScreen');
        if (screens.length > 0) {
            return true;
        }
        return false;
    },
    _isRoundEnded: function() {
        var screens = Crafty('IntermediateScreen');
        if (screens.length > 0) {
            return true;
        }
        return false;
    },
    _isGameStart: function() {
        var screens = Crafty('WelcomeScreen');
        var msg = "" + screens + " "+screen.length;
        if (screens.length > 0) {
            return true;
        }
        return false;
    },
    _isNextScreenKey: function (key) {
        if (key == Crafty.keys['SPACE']
            || key == Crafty.keys['ENTER']) {
            return true;
        }
        return false;
    },
    _startGame: function(totalGames) {
        this._currentGame = 0;
        this._mistakes = 0;
        this._totalGames = totalGames;

        this._clearAll();
        Crafty.e("WelcomeScreen");
    },
    _startRound: function() {
        this._clearAll();
        var board = Crafty.e("Board");
        this._setBoard(board);

        var finishPosition = board._getRandomCell();
        finishPosition._makeCell(finishPosition.x, finishPosition.y, CELL_TYPE_FINISH, " ");
        var startPosition = board._getRandomCell(CELL_TYPE_LETTER);

        var player = Crafty.e("Player")._setBoard(board);
        player._setStartPosition(startPosition.x, startPosition.y);
        player._setUpdateCallback(this._playerUpdate);
    },
    _clearAll: function() {
        var screens = Crafty('2D');
        for (var i=0; i<screens.length; i++) {
            Crafty(screens[i]).destroy();
        }
    },
    _setBoard: function(board) {
        this._board = board;
    },
    _playerUpdate: function(x, y, moved) {
        // If we haven't moved - we have make a typing mistake
        var game = Crafty(Crafty('Game')[0]);
        if (moved == false) {
            game._mistakes++;
            return;
        }
        var cell = game._board._getCell(x, y);
        if (cell._type == CELL_TYPE_FINISH) {
            game._currentGame++;
            game._clearAll();
            if (game._isGameComplete()) {
                var screen = Crafty.e("FinalScreen");
                screen._setStatistics(
                    {totalGames: game._totalGames, mistakes: game._mistakes});
            } else {
                var screen = Crafty.e("IntermediateScreen");
                screen._setStatistics(
                    {currentGame: game._currentGame, totalGames: game._totalGames});
            }
        }
    },
    _isGameComplete: function() {
        return this._totalGames <= this._currentGame;
    }
});
