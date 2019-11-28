"use strict";
/*
  Parses a CommandDataBlock that is contained inside of a TimeSlotBlock
*/
Object.defineProperty(exports, "__esModule", { value: true });
var binary_parser_1 = require("binary-parser");
var formatters_1 = require("./formatters");
var PauseGameAction = new binary_parser_1.Parser();
var ResumeGameAction = new binary_parser_1.Parser();
var SetGameSpeedAction = new binary_parser_1.Parser()
    .int8('speed');
var IncreaseGameSpeedAction = new binary_parser_1.Parser();
var DecreaseGameSpeedAction = new binary_parser_1.Parser();
var SaveGameAction = new binary_parser_1.Parser()
    .string('saveGameName', { zeroTerminated: true });
// @ts-ignore
var SaveGameFinishedAction = new binary_parser_1.Parser()
    .int16le('');
var UnitBuildingAbilityActionNoParams = new binary_parser_1.Parser()
    .int16le('abilityFlags')
    .array('itemId', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: formatters_1.objectIdFormatter
})
    .int32le('unknownA')
    .int32le('unknownB');
var UnitBuildingAbilityActionTargetPosition = new binary_parser_1.Parser()
    .int16le('abilityFlags')
    .array('itemId', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: formatters_1.objectIdFormatter
})
    .int32le('unknownA')
    .int32le('unknownB')
    .floatle('targetX')
    .floatle('targetY');
var UnitBuildingAbilityActionTargetPositionTargetObjectId = new binary_parser_1.Parser()
    .int16le('abilityFlags')
    .array('itemId', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: formatters_1.objectIdFormatter
})
    .int32le('unknownA')
    .int32le('unknownB')
    .floatle('targetX')
    .floatle('targetY')
    .int32le('objectId1')
    .int32le('objectId2');
var GiveItemToUnitAction = new binary_parser_1.Parser()
    .int16le('abilityFlags')
    .array('itemId', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: formatters_1.objectIdFormatter
})
    .int32le('unknownA')
    .int32le('unknownB')
    .floatle('targetX')
    .floatle('targetY')
    .int32le('objectId1')
    .int32le('objectId2')
    .int32le('itemObjectId1')
    .int32le('itemObjectId2');
var UnitBuildingAbilityActionTwoTargetPositions = new binary_parser_1.Parser()
    .int16le('abilityFlags')
    .array('itemId1', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: formatters_1.objectIdFormatter
})
    .int32le('unknownA')
    .int32le('unknownB')
    .floatle('targetAX')
    .floatle('targetAY')
    .array('itemId2', {
    type: 'uint8',
    length: 4,
    formatter: formatters_1.objectIdFormatter
})
    .skip(9)
    .floatle('targetBX')
    .floatle('targetBY');
var SelectionUnit = new binary_parser_1.Parser()
    .array('itemId1', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: formatters_1.objectIdFormatter
})
    .array('itemId2', {
    type: 'uint8',
    length: 4,
    formatter: formatters_1.objectIdFormatter
});
var ChangeSelectionAction = new binary_parser_1.Parser()
    .int8('selectMode')
    .int16le('numberUnits')
    .array('actions', {
    type: SelectionUnit,
    length: 'numberUnits'
});
var AssignGroupHotkeyAction = new binary_parser_1.Parser()
    .int8('groupNumber')
    .int16le('numberUnits')
    .array('actions', {
    type: SelectionUnit,
    length: 'numberUnits'
});
var SelectGroupHotkeyAction = new binary_parser_1.Parser()
    .int8('groupNumber')
    .int8('unknown');
var SelectSubgroupAction = new binary_parser_1.Parser()
    .array('itemId', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: formatters_1.objectIdFormatter
})
    .int32le('objectId1')
    .int32le('objectId2');
var PreSubselectionAction = new binary_parser_1.Parser();
var UnknownAction1B = new binary_parser_1.Parser()
    .skip(9);
var SelectGroundItemAction = new binary_parser_1.Parser()
    .skip(1)
    .array('itemId1', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: formatters_1.objectIdFormatter
})
    .array('itemId2', {
    type: 'uint8',
    length: 4,
    formatter: formatters_1.objectIdFormatter
});
var CancelHeroRevivalAction = new binary_parser_1.Parser()
    .array('itemId1', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: formatters_1.objectIdFormatter
})
    .array('itemId2', {
    type: 'uint8',
    length: 4,
    formatter: formatters_1.objectIdFormatter
});
var RemoveUnitFromBuildingQueueAction = new binary_parser_1.Parser()
    .int8('slotNumber')
    .array('itemId', {
    type: 'uint8',
    length: 4,
    // @ts-ignore
    formatter: formatters_1.objectIdFormatter
});
var ChangeAllyOptionsAction = new binary_parser_1.Parser()
    .int8('slotNumber')
    .int32le('flags');
var TransferResourcesAction = new binary_parser_1.Parser()
    .int8('slotNumber')
    .int32le('gold')
    .int32le('lumber');
var MapTriggerChatAction = new binary_parser_1.Parser()
    .skip(8)
    .string('action', { zeroTerminated: true });
var ESCPressedAction = new binary_parser_1.Parser();
var ChooseHeroSkillSubmenu = new binary_parser_1.Parser();
var EnterBuildingSubmenu = new binary_parser_1.Parser();
var MinimapSignal = new binary_parser_1.Parser()
    .skip(12);
var ContinueGame = new binary_parser_1.Parser()
    .skip(16);
var UnknownAction75 = new binary_parser_1.Parser()
    .skip(1);
var UnknownAction7B = new binary_parser_1.Parser()
    .skip(16);
var ScenarioTriggerAction = new binary_parser_1.Parser()
    .skip(12);
var W3MMDAction = new binary_parser_1.Parser()
    .string('filename', { zeroTerminated: true })
    .string('missionKey', { zeroTerminated: true })
    .string('key', { zeroTerminated: true })
    .int32le('value');
// @ts-ignore
var ActionBlock = new binary_parser_1.Parser()
    .int8('actionId')
    .choice('', {
    tag: 'actionId',
    choices: {
        0x1: PauseGameAction,
        0x2: ResumeGameAction,
        0x3: SetGameSpeedAction,
        0x4: IncreaseGameSpeedAction,
        0x5: DecreaseGameSpeedAction,
        0x6: SaveGameAction,
        0x7: SaveGameFinishedAction,
        0x10: UnitBuildingAbilityActionNoParams,
        0x11: UnitBuildingAbilityActionTargetPosition,
        0x12: UnitBuildingAbilityActionTargetPositionTargetObjectId,
        0x13: GiveItemToUnitAction,
        0x14: UnitBuildingAbilityActionTwoTargetPositions,
        0x16: ChangeSelectionAction,
        0x17: AssignGroupHotkeyAction,
        0x18: SelectGroupHotkeyAction,
        0x19: SelectSubgroupAction,
        0x1A: PreSubselectionAction,
        0x1B: UnknownAction1B,
        0x1C: SelectGroundItemAction,
        0x1D: CancelHeroRevivalAction,
        0x1E: RemoveUnitFromBuildingQueueAction,
        0x1F: RemoveUnitFromBuildingQueueAction,
        0x20: new binary_parser_1.Parser(),
        0x22: new binary_parser_1.Parser(),
        0x23: new binary_parser_1.Parser(),
        0x24: new binary_parser_1.Parser(),
        0x25: new binary_parser_1.Parser(),
        0x26: new binary_parser_1.Parser(),
        0x27: new binary_parser_1.Parser().skip(5),
        0x28: new binary_parser_1.Parser().skip(5),
        0x29: new binary_parser_1.Parser(),
        0x2a: new binary_parser_1.Parser(),
        0x2b: new binary_parser_1.Parser(),
        0x2c: new binary_parser_1.Parser(),
        0x2d: new binary_parser_1.Parser().skip(5),
        0x2e: new binary_parser_1.Parser().skip(4),
        0x2f: new binary_parser_1.Parser(),
        0x30: new binary_parser_1.Parser(),
        0x31: new binary_parser_1.Parser(),
        0x32: new binary_parser_1.Parser(),
        0x50: ChangeAllyOptionsAction,
        0x51: TransferResourcesAction,
        0x60: MapTriggerChatAction,
        0x61: ESCPressedAction,
        0x62: ScenarioTriggerAction,
        0x63: new binary_parser_1.Parser(),
        0x66: ChooseHeroSkillSubmenu,
        0x65: ChooseHeroSkillSubmenu,
        0x67: EnterBuildingSubmenu,
        0x68: MinimapSignal,
        0x69: ContinueGame,
        0x6a: ContinueGame,
        0x6b: W3MMDAction,
        0x6c: new binary_parser_1.Parser(),
        0x6d: new binary_parser_1.Parser(),
        0x75: UnknownAction75,
        0x7B: UnknownAction7B
    }
});
var ActionBlockList = new binary_parser_1.Parser()
    // @ts-ignore
    .array(null, { type: ActionBlock, readUntil: 'eof' });
exports.ActionBlockList = ActionBlockList;
// 0x17
var CommandDataBlock = new binary_parser_1.Parser()
    .int8('playerId')
    .int16le('actionBlockLength')
    .buffer('actions', { length: 'actionBlockLength' });
exports.CommandDataBlock = CommandDataBlock;
//# sourceMappingURL=actions.js.map