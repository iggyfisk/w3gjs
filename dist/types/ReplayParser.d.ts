/// <reference types="node" />
import { TimeSlotBlock, CommandDataBlock, GameDataBlock } from './types';
declare const EventEmitter: any;
declare class ReplayParser extends EventEmitter {
    filename: string;
    buffer: Buffer;
    msElapsed: number;
    header: any;
    decompressed: Buffer;
    gameMetaDataDecoded: any;
    constructor();
    parse($buffer: string): void;
    _parseHeader(): void;
    _parseGameDataBlocks(): void;
    _processGameDataBlock(block: GameDataBlock): void;
    _processTimeSlot(timeSlotBlock: TimeSlotBlock): void;
    _processCommandDataBlock(actionBlock: CommandDataBlock): void;
    decodeGameMetaString(str: string): Buffer;
}
export default ReplayParser;
