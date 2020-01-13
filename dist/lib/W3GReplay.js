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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("./parsers/actions");
var Player_1 = require("./Player");
var convert_1 = require("./convert");
var ReplayParser_1 = require("./ReplayParser");
var sort_1 = require("./sort");
// Cannot import node modules directly because error with rollup
// https://rollupjs.org/guide/en#error-name-is-not-exported-by-module-
var createHash = require('crypto').createHash;
var performance = require('perf_hooks').performance;
var W3GReplay = /** @class */ (function (_super) {
    __extends(W3GReplay, _super);
    function W3GReplay() {
        var _this = _super.call(this) || this;
        _this.playerActionTracker = {};
        _this.id = '';
        _this.totalTimeTracker = 0;
        _this.timeSegmentTracker = 0;
        _this.playerActionTrackInterval = 60000;
        _this.gametype = '';
        _this.matchup = '';
        _this.on('gamemetadata', function (metaData) { return _this.handleMetaData(metaData); });
        _this.on('gamedatablock', function (block) { return _this.processGameDataBlock(block); });
        _this.on('timeslotblock', function (block) { return _this.handleTimeSlot(block); });
        return _this;
    }
    // gamedatablock timeslotblock commandblock actionblock
    W3GReplay.prototype.parse = function ($buffer) {
        var _this = this;
        this.parseStartTime = performance.now();
        this.buffer = Buffer.from('');
        this.filename = '';
        this.id = '';
        this.chatlog = [];
        this.leaveEvents = [];
        this.w3mmd = [];
        this.players = {};
        this.totalTimeTracker = 0;
        this.timeSegmentTracker = 0;
        this.playerActionTrackInterval = 60000;
        _super.prototype.parse.call(this, $buffer);
        this.chatlog = this.chatlog.map(function (elem) {
            return (__assign(__assign({}, elem), { player: _this.players[elem.playerId].name }));
        });
        this.generateID();
        this.determineMatchup();
        this.cleanup();
        return this.finalize();
    };
    W3GReplay.prototype.handleMetaData = function (metaData) {
        var _this = this;
        this.slots = metaData.playerSlotRecords;
        this.playerList = __spreadArrays([metaData.player], metaData.playerList);
        this.meta = metaData;
        var tempPlayers = {};
        this.teams = [];
        this.players = {};
        this.playerList.forEach(function (player) {
            tempPlayers[player.playerId] = player;
        });
        this.slots.forEach(function (slot) {
            if (slot.slotStatus > 1) {
                _this.teams[slot.teamId] = _this.teams[slot.teamId] || [];
                _this.teams[slot.teamId].push(slot.playerId);
                _this.players[slot.playerId] = new Player_1.default(slot.playerId, tempPlayers[slot.playerId]
                    ? tempPlayers[slot.playerId].playerName
                    : 'Computer', slot.teamId, slot.color, slot.raceFlag);
            }
        });
    };
    W3GReplay.prototype.processGameDataBlock = function (block) {
        switch (block.type) {
            case 31:
            case 30:
                this.totalTimeTracker += block.timeIncrement;
                this.timeSegmentTracker += block.timeIncrement;
                if (this.timeSegmentTracker > this.playerActionTrackInterval) {
                    // @ts-ignore
                    Object.values(this.players).forEach(function (p) { return p.newActionTrackingSegment(); });
                    this.timeSegmentTracker = 0;
                }
                break;
            case 32:
                block.timeMS = this.totalTimeTracker;
                this.chatlog.push(block);
                break;
            case 23:
                this.leaveEvents.push(block);
                break;
        }
    };
    W3GReplay.prototype.handleTimeSlot = function (block) {
        var _this = this;
        block.actions.forEach(function (commandBlock) {
            _this.processCommandDataBlock(commandBlock);
        });
    };
    W3GReplay.prototype.processCommandDataBlock = function (block) {
        var _this = this;
        var currentPlayer = this.players[block.playerId];
        currentPlayer.currentTimePlayed = this.totalTimeTracker;
        currentPlayer._lastActionWasDeselect = false;
        try {
            actions_1.ActionBlockList.parse(block.actions).forEach(function (action) {
                _this.handleActionBlock(action, currentPlayer);
            });
        }
        catch (ex) {
            console.error(ex);
        }
    };
    W3GReplay.prototype.handleActionBlock = function (action, currentPlayer) {
        this.playerActionTracker[currentPlayer.id] = this.playerActionTracker[currentPlayer.id] || [];
        this.playerActionTracker[currentPlayer.id].push(action);
        if (action.itemId && (action.itemId.value === 'tert' || action.itemId.value === 'tret')) {
            currentPlayer.handleRetraining(this.totalTimeTracker);
        }
        switch (action.actionId) {
            case 0x10:
                currentPlayer.handle0x10(action.itemId, this.totalTimeTracker);
                break;
            case 0x11:
                currentPlayer.handle0x11(action.itemId, this.totalTimeTracker);
                break;
            case 0x12:
                currentPlayer.handle0x12(action.itemId);
                break;
            case 0x13:
                currentPlayer.handle0x13(action.itemId);
                break;
            case 0x14:
                currentPlayer.handle0x14(action.itemId1);
                break;
            case 0x16:
                if (action.selectMode === 0x02) {
                    currentPlayer._lastActionWasDeselect = true;
                    currentPlayer.handle0x16(action.selectMode, true);
                }
                else {
                    if (currentPlayer._lastActionWasDeselect === false) {
                        currentPlayer.handle0x16(action.selectMode, true);
                    }
                    currentPlayer._lastActionWasDeselect = false;
                }
                break;
            case 0x17:
            case 0x18:
            case 0x1C:
            case 0x1D:
            case 0x1E:
            case 0x61:
            case 0x65:
            case 0x66:
            case 0x67:
                currentPlayer.handleOther(action.actionId);
                break;
            case 0x6b:
                this.w3mmd.push(action);
                break;
        }
    };
    W3GReplay.prototype.isObserver = function (player) {
        return (player.teamid === 24 && this.header.version >= 29) || (player.teamid === 12 && this.header.version < 29);
    };
    W3GReplay.prototype.determineMatchup = function () {
        var _this = this;
        var teamRaces = {};
        Object.values(this.players).forEach(function (p) {
            if (!_this.isObserver(p)) {
                teamRaces[p.teamid] = teamRaces[p.teamid] || [];
                teamRaces[p.teamid].push(p.raceDetected || p.race);
            }
        });
        this.gametype = Object.values(teamRaces).map(function (e) { return e.length; }).sort().join('on');
        this.matchup = Object.values(teamRaces).map(function (e) { return e.sort().join(''); }).sort().join('v');
    };
    W3GReplay.prototype.generateID = function () {
        var _this = this;
        var players = Object.values(this.players).filter(function (p) { return _this.isObserver(p) === false; }).sort(function (player1, player2) {
            if (player1.id < player2.id) {
                return -1;
            }
            return 1;
        }).reduce(function (accumulator, player) {
            accumulator += player.name;
            return accumulator;
        }, '');
        var idBase = this.meta.randomSeed + players + this.meta.mapName;
        this.id = createHash('sha256').update(idBase).digest('hex');
    };
    W3GReplay.prototype.cleanup = function () {
        var _this = this;
        this.observers = [];
        Object.values(this.players).forEach(function (p) {
            p.newActionTrackingSegment(_this.playerActionTrackInterval);
            p.cleanup();
            if (_this.isObserver(p)) {
                _this.observers.push(p.name);
                delete _this.players[p.id];
            }
        });
        if (this.header.version >= 29 && Object.prototype.hasOwnProperty.call(this.teams, '24')) {
            delete this.teams[24];
        }
        else if (Object.prototype.hasOwnProperty.call(this.teams, '12')) {
            delete this.teams[12];
        }
        delete this.slots;
        delete this.playerList;
        delete this.buffer;
        delete this.decompressed;
        delete this.gameMetaDataDecoded;
        delete this.header.blocks;
        delete this.apmTimeSeries;
    };
    W3GReplay.prototype.finalize = function () {
        var settings = {
            referees: !!this.meta.referees,
            fixedTeams: !!this.meta.fixedTeams,
            fullSharedUnitControl: !!this.meta.fullSharedUnitControl,
            alwaysVisible: !!this.meta.alwaysVisible,
            hideTerrain: !!this.meta.hideTerrain,
            mapExplored: !!this.meta.mapExplored,
            teamsTogether: !!this.meta.teamsTogether,
            randomHero: !!this.meta.randomHero,
            randomRaces: !!this.meta.randomRaces,
            speed: this.meta.speed
        };
        var root = {
            id: this.id,
            gamename: this.meta.gameName,
            privateString: this.meta.privateString,
            randomseed: this.meta.randomSeed,
            startSpots: this.meta.startSpotCount,
            observers: this.observers,
            players: Object.values(this.players).sort(sort_1.sortPlayers),
            matchup: this.matchup,
            creator: this.meta.creator,
            type: this.gametype,
            chat: this.chatlog,
            apm: {
                trackingInterval: this.playerActionTrackInterval
            },
            map: {
                path: this.meta.mapName,
                file: convert_1.default.mapFilename(this.meta.mapName),
                checksum: this.meta.mapChecksum
            },
            version: convert_1.default.gameVersion(this.header.version),
            buildNo: this.header.buildNo,
            duration: this.header.replayLengthMS,
            expansion: this.header.gameIdentifier === 'PX3W',
            settings: settings,
            parseTime: Math.round(performance.now() - this.parseStartTime)
        };
        return root;
    };
    return W3GReplay;
}(ReplayParser_1.default));
exports.default = W3GReplay;
//# sourceMappingURL=W3GReplay.js.map