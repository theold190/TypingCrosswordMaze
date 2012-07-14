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
        if (stats.currentGame != undefined) {
            text += "C: "+stats.currentGame+" ";
        }
        if (stats.totalGames != undefined) {
            text += "G: "+stats.totalGames+" ";
        }
        if (stats.mistakes != undefined) {
            text += "M: "+stats.mistakes;
        }
        this.text(text);
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
