"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPlayers = function (player1, player2) {
    if (player2.teamid > player1.teamid)
        return -1;
    if (player2.teamid < player1.teamid)
        return 1;
    if (player2.id > player1.id)
        return -1;
    if (player2.id < player1.id)
        return 1;
    return 0;
};
//# sourceMappingURL=sort.js.map