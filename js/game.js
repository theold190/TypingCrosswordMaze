var NUMBER_GAMES = 3;

var SCORE_COLDEN  = 1,
    SCORE_MISTAKE = -5,
    SCORE_DAMAGE  = -2;

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
    _isScreenDisplayed: function(screen) {
        var screens = Crafty(screen);
        if (screens.length > 0) {
            return true;
        }
        return false;
    },
    _isGameEnded: function() {
        return this._isScreenDisplayed('FinalScreen');
    },
    _isRoundEnded: function() {
        return this._isScreenDisplayed('IntermediateScreen');
    },
    _isGameStart: function() {
        return this._isScreenDisplayed('WelcomeScreen');
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
        this._totalGames = totalGames;
        this._mistakes = 0;
        this._golden = 0;
        this._damage = 0;

        this._clearAll();
        Crafty.e("WelcomeScreen");
    },
    _startRound: function() {
        this._clearAll();
        var board = Crafty.e("Board");
        this._setBoard(board);

        var finishPosition = board._getRandomCell();
        board._setAsFinish(finishPosition);

        var startPosition = board._getRandomCell(CELL_TYPE_NORMAL);

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
    _getCurrentScore: function() {
        var game = Crafty(Crafty('Game')[0]);
        return game._mistakes*SCORE_MISTAKE
                + game._golden*SCORE_COLDEN
                + game._damage*SCORE_DAMAGE;
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
                var totalScore = game._getCurrentScore();
                screen._setStatistics(
                    {mistakes: game._mistakes, golden: game._golden, score: totalScore});
            } else {
                var screen = Crafty.e("IntermediateScreen");
                screen._setStatistics(
                    {currentGame: game._currentGame, totalGames: game._totalGames});
            }
        } else if (cell._type == CELL_TYPE_GOLDEN) {
            game._golden++;
            cell._removeGold();
        } else if (cell._type == CELL_TYPE_DANGER) {
            game._damage++;
            cell._removeDanger(cell);
        }
    },
    _isGameComplete: function() {
        return this._totalGames <= this._currentGame;
    }
});
