Crafty.c("Screen", {
    init: function() {
        this.addComponent("2D, Canvas, Color, Text");
        this.attr({w:BOARD_WIDTH, h:BOARD_HEIGHT});
        this.color('#000000');
        this.textColor('#FFFFFF', 1);
        this.textFont({size: '50px', family: 'Arial'});
    },
    _setStatistics: function (stats) {
        var text = "";
        if (stats.currentGame != undefined && stats.totalGames != undefined) {
            text += " " + stats.currentGame + " / " + stats.totalGames;
        } else {
            if (stats.currentGame != undefined) {
                text += "C: "+stats.currentGame+" ";
            }
            if (stats.totalGames != undefined) {
                text += "G: "+stats.totalGames+" ";
            }
        }
        if (stats.score != undefined) {
            text += "Score: "+stats.score + " ";
        } else {
            if (stats.mistakes != undefined) {
                text += "M: "+stats.mistakes + " ";
            }
            if (stats.golden != undefined) {
                text += "Gold: "+stats.golden + " ";
            }
        }
        this.text(text);
    }
});

Crafty.c("WelcomeScreen", {
    init: function() {
        this.addComponent("Screen");
        this.text("Start!");
    }
});

Crafty.c("IntermediateScreen", {
    init: function() {
        this.addComponent("Screen");
        this.text("Done!");
    }
});

Crafty.c("FinalScreen", {
    init: function() {
        this.addComponent("Screen");
        this.text("Completed!");
        this._totalGames = 1;
    },
});
