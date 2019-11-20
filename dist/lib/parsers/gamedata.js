"use strict";
/*
  Parses actual game data
  Please note that TimeSlotBlocks do not fully parse included actions.
  They should be parsed block by block manually
  afterwards to ensure proper error handling.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var binary_parser_1 = require("binary-parser");
var actions_1 = require("./actions");
var formatters_1 = require("./formatters");
// 0x17
var LeaveGameBlock = new binary_parser_1.Parser()
    .string('reason', { length: 4, encoding: 'hex' })
    .int8('playerId')
    .string('result', { length: 4, encoding: 'hex' })
    .skip(4);
// 0x1A
var FirstStartBlock = new binary_parser_1.Parser()
    .skip(4);
// 0x1B
var SecondStartBlock = new binary_parser_1.Parser()
    .skip(4);
// 0x1C
var ThirdStartBlock = new binary_parser_1.Parser()
    .skip(4);
// 0x1F 0x1E
var TimeSlotBlock = new binary_parser_1.Parser()
    .int16le('byteCount')
    .int16le('timeIncrement')
    .array('actions', {
    type: actions_1.CommandDataBlock,
    lengthInBytes: function () {
        // @ts-ignore
        return this.byteCount - 2;
    }
});
// 0x20
// @ts-ignore
var PlayerChatMessageBlock = new binary_parser_1.Parser()
    .int8('playerId')
    .int16le('byteCount')
    .int8('flags')
    .choice('', {
    tag: 'flags',
    choices: {
        0x10: new binary_parser_1.Parser(),
        // @ts-ignore
        0x20: new binary_parser_1.Parser().int8('mode', { length: 4, formatter: formatters_1.chatModeFormatter, encoding: 'hex' }).skip(3)
    }
})
    .string('message', { zeroTerminated: true, encoding: 'utf8' });
// 0x22
var Unknown0x22 = new binary_parser_1.Parser()
    .uint8('length')
    .string('content', { length: 'length' });
// 0x23
var Unknown0x23 = new binary_parser_1.Parser()
    .skip(10);
// 0x2F
var ForcedGameEndCountdown = new binary_parser_1.Parser()
    .skip(8);
// @ts-ignore
var GameData = new binary_parser_1.Parser()
    .uint8('type')
    .choice('', {
    tag: 'type',
    choices: {
        0x17: LeaveGameBlock,
        0x1a: FirstStartBlock,
        0x1b: SecondStartBlock,
        0x1c: ThirdStartBlock,
        0x1f: TimeSlotBlock,
        0x1e: TimeSlotBlock,
        0x20: PlayerChatMessageBlock,
        0x22: Unknown0x22,
        0x23: Unknown0x23,
        0x2f: ForcedGameEndCountdown,
        0: new binary_parser_1.Parser()
    }
});
var GameDataParser = new binary_parser_1.Parser()
    // @ts-ignore
    .array(null, { type: GameData, readUntil: 'eof' });
exports.GameDataParser = GameDataParser;
//# sourceMappingURL=gamedata.js.map