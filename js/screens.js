var SCREEN_WIDTH = BOARD_WIDTH,
    SCREEN_HEIGHT = BOARD_HEIGHT;

convertTaskToString = function(task) {
    var text = "";
    for (i in task) {
        if (task[i] > 0) {
            text += i + (task[i] > 1 ? ("x" + task[i]) : "") + " ";
        }
    }
    return text;
};

isTaskCompleted = function(task) {
    return isListEmpty(task);
}

Crafty.c("ScreenText", {
    _textSize: 50,
    _textColor: '#FFFFFF',
    init: function() {
        this.addComponent("2D, DOM, Text");
        this.textColor(this._textColor, 1);
        var size = this._textSize + "px";
        this.textFont({size: size, family: 'Arial'});
        this.css({textAlign: 'center'});
    }
});

Crafty.c("Screen", {
    init: function() {
        this.addComponent("2D, Canvas, Color");
        this.attr({w:SCREEN_WIDTH, h:SCREEN_HEIGHT});
        this.color('#000000');
    },
});

Crafty.c("WelcomeScreen", {
    init: function() {
        this.addComponent("Screen");
        var text = Crafty.e("ScreenText");
        text.text("Welcome to").attr({y:SCREEN_HEIGHT/2-text._textSize, w:SCREEN_WIDTH});
        var text2 = Crafty.e("ScreenText");
        text2.text("Crossword Maze").attr({y:SCREEN_HEIGHT/2, w:SCREEN_WIDTH});
    }
});

Crafty.c("TaskScreen", {
    init: function() {
        this.addComponent("Screen");
    },
    _setStatistics: function (stats) {
        if (stats.currentGame != undefined && stats.totalGames != undefined) {
            var msg = " " + stats.currentGame + " / " + stats.totalGames + " ";
            var text = Crafty.e("ScreenText");
            text.text(msg).attr({y:SCREEN_HEIGHT/2-text._textSize, w:SCREEN_WIDTH});
        }
        if (stats.taskLeft != undefined) {
            var msg = "Get: " + convertTaskToString(stats.taskLeft);
            var text = Crafty.e("ScreenText");
            text.text(msg).attr({y:SCREEN_HEIGHT-text._textSize, w:SCREEN_WIDTH});
        }
    }
});

Crafty.c("IntermediateScreen", {
    init: function() {
        this.addComponent("Screen");
    },
    _setStatistics: function (stats) {
        if (stats.currentGame != undefined && stats.totalGames != undefined) {
            var msg = " " + stats.currentGame + " / " + stats.totalGames + " ";
            var text = Crafty.e("ScreenText");
            text.text(msg).attr({y:SCREEN_HEIGHT/2-text._textSize, w:SCREEN_WIDTH});
        }
        if (stats.taskLeft != undefined) {
            var msg = "";
            if (isListEmpty(stats.taskLeft)) {
                msg = "Task completed!";
            } else {
                msg = "Left: " + convertTaskToString(stats.taskLeft);
            }
            var text = Crafty.e("ScreenText");
            text.text(msg).attr({y:SCREEN_HEIGHT-text._textSize, w:SCREEN_WIDTH});
        }
    }
});

Crafty.c("FinalScreen", {
    init: function() {
        this.addComponent("Screen");
        this._totalGames = 1;
    },
    _setStatistics: function (stats) {
        if (stats.score != undefined) {
            var msg = "Score: "+stats.score + " ";
            var text = Crafty.e("ScreenText");
            text.text(msg).attr({y:SCREEN_HEIGHT/2-text._textSize, w:SCREEN_WIDTH});
        }
        if (stats.taskLeft != undefined) {
            var msg = "Task ";

            if (isTaskCompleted(stats.taskLeft)) {
                msg += "completed!";
            } else {
                msg += "failed...";
            }
            var text = Crafty.e("ScreenText");
            text.text(msg).attr({y:SCREEN_HEIGHT-text._textSize, w:SCREEN_WIDTH});
        }
    }
});
