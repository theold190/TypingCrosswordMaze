var NUMBER_GAMES = 3;

var NUMBER_GOAL_LETTERS = 5;

var SCORE_COLDEN  = 1,
    SCORE_MISTAKE = -3,
    SCORE_DAMAGE  = -3
    SCORE_COLLECTED = 2
    SCORE_COLLECTED_ALL = 5;

Crafty.c("Game", {
    init: function() {
        this.addComponent("");
        this.bind('KeyDown', function(e) {
            if (this._isNextScreenKey(e.key)) {
                if (this._isWelcomeScreen()) {
                    this._generateTask();
                    return;
                }
                if (this._isTaskScreen()) {
                    this._startRound();
                    return;
                }
                if (this._isIntermediateScreen()) {
                    this._startRound();
                    return;
                }
                if (this._isFinalScreen()) {
                    this._startGame(this._totalGames);
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
    _isWelcomeScreen: function() {
        return this._isScreenDisplayed('WelcomeScreen');
    },
    _isTaskScreen: function() {
        return this._isScreenDisplayed('TaskScreen');
    },
    _isIntermediateScreen: function() {
        return this._isScreenDisplayed('IntermediateScreen');
    },
    _isFinalScreen: function() {
        return this._isScreenDisplayed('FinalScreen');
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
        this._collected = 0;

        if (this._task != undefined) {
            delete this._task;
        }
        this._task = new Object;

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
        var golden = 0, counter = 0;
        var empty = isListEmpty(game._task);

        var score = game._mistakes*SCORE_MISTAKE
                + game._golden*SCORE_COLDEN
                + game._damage*SCORE_DAMAGE
                + game._collected*SCORE_COLLECTED
                + (empty ? SCORE_COLLECTED_ALL : 0);
        //var msg = "M: "+game._mistakes+" G: "+game._golden+" D: "+game._damage+" C: "+game._collected+" E: "+empty+" S: "+score;
        //alert(msg);
        return score;
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
                    {score: totalScore, taskLeft: game._task});
            } else {
                var screen = Crafty.e("IntermediateScreen");
                screen._setStatistics(
                    {currentGame: game._currentGame, totalGames: game._totalGames, taskLeft: game._task});
            }
        } else if (cell._type == CELL_TYPE_GOLDEN) {
            var text = cell.text();
            game._golden++;
            cell._removeGold();
            if (game._task[text] != undefined
                && game._task[text] > 0)
            {
                game._task[text]--;
                // For now every collected gives gold + collection reward
                game._collected++;
            }
        } else if (cell._type == CELL_TYPE_DANGER) {
            game._damage++;
            cell._removeDanger(cell);
        }
    },
    _isGameComplete: function() {
        return this._totalGames <= this._currentGame;
    },
    _generateTask: function() {
        var num = Crafty.math.randomNumber(3, NUMBER_GOAL_LETTERS);
        //var num = NUMBER_GOAL_LETTERS;
        for(var i=0; i<num; i++) {
            var letter = Crafty.math.randomElementOfArray(BOARD_LETTERS);
            if (this._task[letter] == undefined) {
                this._task[letter] = 0;
            }
            this._task[letter]++;
        }
        this._clearAll();
        Crafty.e("TaskScreen")._setStatistics({currentGame: this._currentGame, totalGames: this._totalGames, taskLeft: this._task});
    }
});
