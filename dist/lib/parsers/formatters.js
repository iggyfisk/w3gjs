"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var objectIdFormatter = function (arr) {
    if (arr[3] >= 0x41 && arr[3] <= 0x7A) {
        return { type: 'stringencoded', value: arr.map(function (e) { return String.fromCharCode(parseInt(e, 10)); }).reverse().join('') };
    }
    return { type: 'alphanumeric', value: arr.map(function (e) { return parseInt(e, 16); }) };
};
exports.objectIdFormatter = objectIdFormatter;
var raceFlagFormatter = function (flag) {
    switch (flag) {
        case 0x01:
        case 0x41:
            return 'H';
        case 0x02:
        case 0x42:
            return 'O';
        case 0x04:
        case 0x44:
            return 'N';
        case 0x08:
        case 0x48:
            return 'U';
        case 0x20:
        case 0x60:
            return 'R';
    }
    return flag;
};
exports.raceFlagFormatter = raceFlagFormatter;
var chatModeFormatter = function (flag) {
    switch (flag) {
        case 0x00:
            return 'ALL';
        case 0x01:
            return 'ALLY';
        case 0x02:
            return 'OBS';
    }
    if (flag >= 3 && flag <= 27) {
        return "PRIVATE" + flag;
    }
    return flag;
};
exports.chatModeFormatter = chatModeFormatter;
//# sourceMappingURL=formatters.js.map