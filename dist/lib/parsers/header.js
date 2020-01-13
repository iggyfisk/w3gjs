"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var binary_parser_1 = require("binary-parser");
var formatters_1 = require("./formatters");
var Header = new binary_parser_1.Parser()
    .string('magic', { zeroTerminated: true })
    .int32le('offset')
    .int32le('compressedSize')
    .string('headerVersion', { encoding: 'hex', length: 4 })
    .int32le('decompressedSize')
    .int32le('compressedDataBlockCount');
var SubHeaderV1 = new binary_parser_1.Parser()
    .string('gameIdentifier', { length: 4 })
    .int32le('version')
    .int16le('buildNo')
    .string('flags', { encoding: 'hex', length: 2 })
    .int32le('replayLengthMS')
    .uint32le('checksum');
/*
const SubHeaderV0 = new Parser()
  .string('unknown', {length: 4})
  .int16le('version')
  .int16le('buildNo')
  .string('flags', {encoding: 'hex', length: 2})
  .int32le('replayLengthMS')
  .int32le('checksum')
*/
var DataBlock = new binary_parser_1.Parser()
    .int32le('blockSize')
    .int32le('blockDecompressedSize')
    .string('unknown', { encoding: 'hex', length: 4 })
    .buffer('compressed', { length: 'blockSize' });
exports.DataBlock = DataBlock;
var DataBlocks = new binary_parser_1.Parser()
    .array('blocks', { type: DataBlock, readUntil: 'eof' });
var ReplayHeader = new binary_parser_1.Parser()
    // @ts-ignore
    .nest(null, {
    type: Header
})
    .nest(null, { type: SubHeaderV1 })
    .nest(null, { type: DataBlocks });
exports.ReplayHeader = ReplayHeader;
var PlayerRecordLadder = new binary_parser_1.Parser()
    .string('runtimeMS', { encoding: 'hex', length: 4 })
    .int32le('raceFlags', { formatter: formatters_1.raceFlagFormatter });
var HostRecord = new binary_parser_1.Parser()
    .int8('playerId')
    .string('playerName', { zeroTerminated: true })
    .uint8('addDataFlagHost')
    .choice('additional', {
    tag: 'addDataFlagHost',
    choices: {
        8: PlayerRecordLadder,
        0: new binary_parser_1.Parser().skip(0),
        1: new binary_parser_1.Parser().skip(1),
        2: new binary_parser_1.Parser().skip(2)
    }
});
var PlayerRecord = new binary_parser_1.Parser()
    .int8('playerId')
    .string('playerName', { zeroTerminated: true })
    .uint8('addDataFlag')
    .choice('additional', {
    tag: 'addDataFlag',
    choices: {
        1: new binary_parser_1.Parser().skip(1),
        8: PlayerRecordLadder,
        2: new binary_parser_1.Parser().skip(2),
        0: new binary_parser_1.Parser().skip(0)
    }
});
var PlayerRecordInList = new binary_parser_1.Parser()
    // @ts-ignore
    .nest(null, { type: PlayerRecord })
    .skip(4);
var PlayerSlotRecord = new binary_parser_1.Parser()
    .int8('playerId')
    .skip(1) // mapDownloadPercent
    .int8('slotStatus')
    .int8('computerFlag')
    .int8('teamId')
    .int8('color')
    .int8('raceFlag', { formatter: formatters_1.raceFlagFormatter })
    .int8('aiStrength')
    .int8('handicapFlag');
var GameMetaData = new binary_parser_1.Parser()
    .skip(5)
    .nest('player', { type: HostRecord })
    .string('gameName', { zeroTerminated: true })
    .string('privateString', { zeroTerminated: true })
    .string('encodedString', { zeroTerminated: true, encoding: 'hex' })
    .int32le('playerCount')
    .string('gameType', { length: 4, encoding: 'hex' })
    .string('languageId', { length: 4, encoding: 'hex' })
    .array('playerList', {
    type: new binary_parser_1.Parser()
        .int8('hasRecord')
        // @ts-ignore
        .choice(null, {
        tag: 'hasRecord',
        choices: {
            22: PlayerRecordInList
        },
        defaultChoice: new binary_parser_1.Parser().skip(-1)
    }),
    readUntil: function (item, buffer) {
        // @ts-ignore
        var next = buffer.readInt8();
        return next === 25;
    }
})
    .int8('gameStartRecord')
    .int16('dataByteCount')
    .int8('slotRecordCount')
    .array('playerSlotRecords', { type: PlayerSlotRecord, length: 'slotRecordCount' })
    .int32le('randomSeed')
    .string('selectMode', { length: 1, encoding: 'hex' })
    .int8('startSpotCount');
exports.GameMetaData = GameMetaData;
var GameMetaDataReforged = new binary_parser_1.Parser()
    .skip(5)
    .nest('player', { type: HostRecord })
    .string('gameName', { zeroTerminated: true })
    .string('privateString', { zeroTerminated: true })
    .string('encodedString', { zeroTerminated: true, encoding: 'hex' })
    .int32le('playerCount')
    .string('gameType', { length: 4, encoding: 'hex' })
    .string('languageId', { length: 4, encoding: 'hex' })
    .array('playerList', {
    type: new binary_parser_1.Parser()
        .int8('hasRecord')
        // @ts-ignore
        .choice(null, {
        tag: 'hasRecord',
        choices: {
            22: PlayerRecordInList
        },
        defaultChoice: new binary_parser_1.Parser().skip(-1)
    }),
    readUntil: function (item, buffer) {
        // @ts-ignore
        var next = buffer.readInt8();
        return next === 57;
    }
})
    .skip(4) // GamestartRecord etc used to go here
    .skip(8) // More stuff that happens before the next list of players
    .array('extraPlayerList', {
    type: new binary_parser_1.Parser()
        .int8('preVars1')
        .buffer('pre', { length: 4 })
        .int8('nameLength')
        .string('name', { length: 'nameLength' })
        .skip(1)
        .int8('clanLength')
        .string('clan', { length: 'clanLength' })
        .skip(1)
        .int8('extraLength')
        .buffer('extra', { length: 'extraLength' })
        .buffer('post', { length: 2 }),
    readUntil: function (item, buffer) {
        // @ts-ignore
        var next = buffer.readInt8();
        return next === 25;
    }
})
    .int8('gameStartRecord')
    .int16('dataByteCount')
    .int8('slotRecordCount')
    .array('playerSlotRecords', { type: PlayerSlotRecord, length: 'slotRecordCount' })
    .int32le('randomSeed')
    .string('selectMode', { length: 1, encoding: 'hex' })
    .int8('startSpotCount');
exports.GameMetaDataReforged = GameMetaDataReforged;
var EncodedMapMetaString = new binary_parser_1.Parser()
    .uint8('speed')
    .bit1('hideTerrain')
    .bit1('mapExplored')
    .bit1('alwaysVisible')
    .bit1('default')
    .bit2('observerMode')
    .bit1('teamsTogether')
    .bit2('empty')
    .bit2('fixedTeams')
    .bit5('empty')
    .bit1('fullSharedUnitControl')
    .bit1('randomHero')
    .bit1('randomRaces')
    .bit3('empty')
    .bit1('referees')
    .skip(5)
    .string('mapChecksum', { length: 4, encoding: 'hex' })
    .string('mapName', { zeroTerminated: true })
    .string('creator', { zeroTerminated: true });
exports.EncodedMapMetaString = EncodedMapMetaString;
//# sourceMappingURL=header.js.map