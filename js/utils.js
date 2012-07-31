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

isListEmpty = function(task) {
    for (i in task) {
        if (task[i] != undefined && task[i] > 0) {
            return false;
        }
    }
    return true;
}

function initCrafty() {
    Crafty.init(DISPLAY_WIDTH, DISPLAY_HEIGHT);
}

function parseQueryString(qsParm) {
    var query = window.location.search.substring(1);
    var parms = query.split('&');
    for (var i=0; i<parms.length; i++) {
        var pos = parms[i].indexOf('=');
        if (pos > 0) {
            var key = parms[i].substring(0,pos);
            var val = parms[i].substring(pos+1);
            qsParm[key] = val;
        }
    }
}
