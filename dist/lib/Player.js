"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var convert_1 = require("./convert");
var mappings_1 = require("./mappings");
/**
 * Helpers
 */
var isRightclickAction = function (input) { return input[0] === 0x03 && input[1] === 0; };
var isBasicAction = function (input) { return input[0] <= 0x19 && input[1] === 0; };
exports.reduceHeroes = function (heroCollector) {
    return Object.values(heroCollector).sort(function (h1, h2) { return h1.order - h2.order; }).reduce(function (aggregator, hero) {
        hero.level = Object.values(hero.abilities).reduce(function (prev, curr) { return prev + curr; }, 0);
        delete hero.order;
        aggregator.push(hero);
        return aggregator;
    }, []);
};
var Player = /** @class */ (function () {
    function Player(id, name, teamid, color, race) {
        this.id = id;
        this.name = name;
        this.teamid = teamid;
        this.color = convert_1.default.playerColor(color);
        this.race = race;
        this.raceDetected = '';
        this.units = { summary: {}, order: [] };
        this.upgrades = { summary: {}, order: [] };
        this.items = { summary: {}, order: [] };
        this.buildings = { summary: {}, order: [] };
        this.pings = [];
        this.heroes = [];
        this.heroCollector = {};
        this.heroCount = 0;
        this.actions = {
            timed: [],
            assigngroup: 0,
            rightclick: 0,
            basic: 0,
            buildtrain: 0,
            ability: 0,
            item: 0,
            select: 0,
            removeunit: 0,
            subgroup: 0,
            selecthotkey: 0,
            esc: 0,
            ping: 0
        };
        this._currentlyTrackedAPM = 0;
        this._lastActionWasDeselect = false;
        this._retrainingMetadata = {};
        this._lastRetrainingTime = 0;
        this.currentTimePlayed = 0;
        this.apm = 0;
        return this;
    }
    Player.prototype.newActionTrackingSegment = function (timeTrackingInterval) {
        if (timeTrackingInterval === void 0) { timeTrackingInterval = 60000; }
        this.actions.timed.push(Math.floor(this._currentlyTrackedAPM * (60000.0 / timeTrackingInterval)));
        this._currentlyTrackedAPM = 0;
    };
    Player.prototype.detectRaceByActionId = function (actionId) {
        switch (actionId[0]) {
            case 'e':
                this.raceDetected = 'N';
                break;
            case 'o':
                this.raceDetected = 'O';
                break;
            case 'h':
                this.raceDetected = 'H';
                break;
            case 'u':
                this.raceDetected = 'U';
                break;
        }
    };
    Player.prototype.handleStringencodedItemID = function (actionId, gametime) {
        if (mappings_1.units[actionId]) {
            this.units.summary[actionId] = this.units.summary[actionId] + 1 || 1;
            this.units.order.push({ id: actionId, ms: gametime });
        }
        else if (mappings_1.items[actionId]) {
            this.items.summary[actionId] = this.items.summary[actionId] + 1 || 1;
            this.items.order.push({ id: actionId, ms: gametime });
        }
        else if (mappings_1.buildings[actionId]) {
            this.buildings.summary[actionId] = this.buildings.summary[actionId] + 1 || 1;
            this.buildings.order.push({ id: actionId, ms: gametime });
        }
        else if (mappings_1.upgrades[actionId]) {
            this.upgrades.summary[actionId] = this.upgrades.summary[actionId] + 1 || 1;
            this.upgrades.order.push({ id: actionId, ms: gametime });
        }
    };
    Player.prototype.handleHeroSkill = function (actionId, gametime) {
        var heroId = mappings_1.abilityToHero[actionId];
        if (this.heroCollector[heroId] === undefined) {
            this.heroCount += 1;
            this.heroCollector[heroId] = { level: 0, abilities: {}, order: this.heroCount, id: heroId, abilityOrder: [], retrainingHistory: [] };
        }
        if (this._lastRetrainingTime > 0) {
            this.heroCollector[heroId].retrainingHistory.push({ time: this._lastRetrainingTime, abilities: this.heroCollector[heroId].abilities });
            this.heroCollector[heroId].abilities = {};
            this.heroCollector[heroId].abilityOrder.push({ type: 'retraining', time: this._lastRetrainingTime });
            this._lastRetrainingTime = 0;
        }
        this.heroCollector[heroId].abilities[actionId] = this.heroCollector[heroId].abilities[actionId] || 0;
        this.heroCollector[heroId].abilities[actionId] += 1;
        this.heroCollector[heroId].abilityOrder.push({ type: 'ability', time: gametime, value: actionId });
    };
    Player.prototype.handleRetraining = function (gametime) {
        this._lastRetrainingTime = gametime;
    };
    Player.prototype.handle0x10 = function (itemid, gametime) {
        switch (itemid.value[0]) {
            case 'A':
                this.handleHeroSkill(itemid.value, gametime);
                break;
            case 'R':
                this.handleStringencodedItemID(itemid.value, gametime);
                break;
            case 'u':
            case 'e':
            case 'h':
            case 'o':
                if (!this.raceDetected) {
                    this.detectRaceByActionId(itemid.value);
                }
                this.handleStringencodedItemID(itemid.value, gametime);
                break;
            default:
                this.handleStringencodedItemID(itemid.value, gametime);
        }
        itemid.value[0] !== '0'
            ? this.actions.buildtrain = this.actions.buildtrain + 1 || 1
            : this.actions.ability = this.actions.ability + 1 || 1;
        this._currentlyTrackedAPM++;
    };
    Player.prototype.handle0x11 = function (itemid, gametime) {
        this._currentlyTrackedAPM++;
        if (itemid.type === 'alphanumeric') {
            if (itemid.value[0] <= 0x19 && itemid.value[1] === 0) {
                this.actions.basic = this.actions.basic + 1 || 1;
            }
            else {
                this.actions.ability = this.actions.ability + 1 || 1;
            }
        }
        else {
            this.handleStringencodedItemID(itemid.value, gametime);
        }
    };
    Player.prototype.handle0x12 = function (itemid) {
        if (isRightclickAction(itemid.value)) {
            this.actions.rightclick = this.actions.rightclick + 1 || 1;
        }
        else if (isBasicAction(itemid.value)) {
            this.actions.basic = this.actions.basic + 1 || 1;
        }
        else {
            this.actions.ability = this.actions.ability + 1 || 1;
        }
        this._currentlyTrackedAPM++;
    };
    Player.prototype.handle0x13 = function (itemid) {
        this.actions.item = this.actions.item + 1 || 1;
        this._currentlyTrackedAPM++;
    };
    Player.prototype.handle0x14 = function (itemid) {
        if (isRightclickAction(itemid.value)) {
            this.actions.rightclick = this.actions.rightclick + 1 || 1;
        }
        else if (isBasicAction(itemid.value)) {
            this.actions.basic = this.actions.basic + 1 || 1;
        }
        else {
            this.actions.ability = this.actions.ability + 1 || 1;
        }
        this._currentlyTrackedAPM++;
    };
    Player.prototype.handle0x16 = function (selectMode, isAPM) {
        if (isAPM) {
            this.actions.select = this.actions.select + 1 || 1;
            this._currentlyTrackedAPM++;
        }
    };
    Player.prototype.handleOther = function (actionId) {
        switch (actionId) {
            case 0x17:
                this.actions.assigngroup = this.actions.assigngroup + 1 || 1;
                this._currentlyTrackedAPM++;
                break;
            case 0x18:
                this.actions.selecthotkey = this.actions.selecthotkey + 1 || 1;
                this._currentlyTrackedAPM++;
                break;
            case 0x1C:
            case 0x1D:
            case 0x66:
            case 0x67:
                this._currentlyTrackedAPM++;
                break;
            case 0x1E:
                this.actions.removeunit = this.actions.removeunit + 1 || 1;
                this._currentlyTrackedAPM++;
                break;
            case 0x61:
                this.actions.esc = this.actions.esc + 1 || 1;
                this._currentlyTrackedAPM++;
                break;
        }
    };
    Player.prototype.handlePing = function (gametime, x, y) {
        this.pings.push({ ms: gametime, x: x, y: y });
        this.actions.ping = this.actions.ping + 1 || 1;
        this._currentlyTrackedAPM++;
    };
    Player.prototype.cleanup = function () {
        var apmSum = this.actions.timed.reduce(function (a, b) { return a + b; });
        this.apm = Math.round(apmSum / this.actions.timed.length);
        this.heroes = exports.reduceHeroes(this.heroCollector);
        delete this._currentlyTrackedAPM;
    };
    return Player;
}());
exports.default = Player;
//# sourceMappingURL=Player.js.map