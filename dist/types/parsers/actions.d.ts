/// <reference types="node" />
import { Parser } from 'binary-parser';
declare const ActionBlockList: any;
declare const CommandDataBlock: Parser.Next<{
    playerId: number;
} & {
    actionBlockLength: number;
}, "actions", Buffer>;
export { CommandDataBlock, ActionBlockList };
