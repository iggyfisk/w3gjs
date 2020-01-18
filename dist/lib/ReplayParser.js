"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var binary_parser_1 = require("binary-parser");
var actions_1 = require("./parsers/actions");
var header_1 = require("./parsers/header");
var gamedata_1 = require("./parsers/gamedata");
// Cannot import node modules directly because error with rollup
// https://rollupjs.org/guide/en#error-name-is-not-exported-by-module-
var readFileSync = require('fs').readFileSync;
var _a = require('zlib'), inflateSync = _a.inflateSync, constants = _a.constants;
var GameDataParserComposed = new binary_parser_1.Parser()
    .nest('meta', { type: header_1.GameMetaData })
    .nest('blocks', { type: gamedata_1.GameDataParser });
var GameDataReforgedParserComposed = function (buildNo) { return new binary_parser_1.Parser()
    .nest('meta', { type: header_1.GameMetaDataReforged(buildNo) })
    .nest('blocks', { type: gamedata_1.GameDataParser }); };
var EventEmitter = require('events');
var ReplayParser = /** @class */ (function (_super) {
    __extends(ReplayParser, _super);
    function ReplayParser() {
        var _this = _super.call(this) || this;
        _this.msElapsed = 0;
        _this.buffer = Buffer.from('');
        _this.filename = '';
        _this.decompressed = Buffer.from('');
        return _this;
    }
    ReplayParser.prototype.parse = function ($buffer) {
        this.msElapsed = 0;
        this.buffer = Buffer.isBuffer($buffer) ? $buffer : readFileSync($buffer);
        this.buffer = this.buffer.slice(this.buffer.indexOf('Warcraft III recorded game'));
        this.filename = Buffer.isBuffer($buffer) ? 'buffer' : $buffer;
        var decompressed = [];
        this._parseHeader();
        this.header.blocks.forEach(function (block) {
            if (block.blockSize > 0 && block.blockDecompressedSize === 8192) {
                try {
                    var r = inflateSync(block.compressed, { finishFlush: constants.Z_SYNC_FLUSH });
                    if (r.byteLength > 0 && block.compressed.byteLength > 0) {
                        decompressed.push(r);
                    }
                }
                catch (ex) {
                    console.log(ex);
                }
            }
        });
        this.decompressed = Buffer.concat(decompressed);
        this.gameMetaDataDecoded = this.header.buildNo >= 6102
            ? GameDataReforgedParserComposed(this.header.buildNo).parse(this.decompressed)
            : GameDataParserComposed.parse(this.decompressed);
        var decodedMetaStringBuffer = this.decodeGameMetaString(this.gameMetaDataDecoded.meta.encodedString);
        var meta = __assign(__assign(__assign({}, this.gameMetaDataDecoded), this.gameMetaDataDecoded.meta), header_1.EncodedMapMetaString.parse(decodedMetaStringBuffer));
        var newMeta = meta;
        delete newMeta.meta;
        this.emit('gamemetadata', newMeta);
        this._parseGameDataBlocks();
    };
    ReplayParser.prototype._parseHeader = function () {
        this.header = header_1.ReplayHeader.parse(this.buffer);
    };
    ReplayParser.prototype._parseGameDataBlocks = function () {
        var _this = this;
        this.gameMetaDataDecoded.blocks.forEach(function (block) {
            _this.emit('gamedatablock', block);
            _this._processGameDataBlock(block);
        });
    };
    ReplayParser.prototype._processGameDataBlock = function (block) {
        switch (block.type) {
            case 31:
            case 30:
                this.msElapsed += block.timeIncrement;
                this.emit('timeslotblock', block);
                this._processTimeSlot(block);
                break;
        }
    };
    ReplayParser.prototype._processTimeSlot = function (timeSlotBlock) {
        var _this = this;
        timeSlotBlock.actions.forEach(function (block) {
            _this._processCommandDataBlock(block);
            _this.emit('commandblock', block);
        });
    };
    ReplayParser.prototype._processCommandDataBlock = function (actionBlock) {
        var _this = this;
        try {
            actions_1.ActionBlockList.parse(actionBlock.actions).forEach(function (action) {
                _this.emit('actionblock', action, actionBlock.playerId);
            });
        }
        catch (ex) {
            console.error(ex);
        }
    };
    ReplayParser.prototype.decodeGameMetaString = function (str) {
        var test = Buffer.from(str, 'hex');
        var decoded = Buffer.alloc(test.length);
        var mask = 0;
        var dpos = 0;
        for (var i = 0; i < test.length; i++) {
            if (i % 8 === 0) {
                mask = test[i];
            }
            else {
                if ((mask & (0x1 << (i % 8))) === 0) {
                    decoded.writeUInt8(test[i] - 1, dpos++);
                }
                else {
                    decoded.writeUInt8(test[i], dpos++);
                }
            }
        }
        return decoded;
    };
    return ReplayParser;
}(EventEmitter));
exports.default = ReplayParser;
//# sourceMappingURL=ReplayParser.js.map