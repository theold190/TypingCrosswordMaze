isListEmpty = function(task) {
    for (i in task) {
        if (task[i] != undefined && task[i] > 0) {
            return false;
        }
    }
    return true;
}

