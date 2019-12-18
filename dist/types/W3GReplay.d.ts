import Player from './Player';
import ReplayParser from './ReplayParser';
import { GameMetaDataDecoded, GameDataBlock, ActionBlock, TimeSlotBlock, CommandDataBlock, ParserOutput } from './types';
declare class W3GReplay extends ReplayParser {
    players: {
        [key: string]: Player;
    };
    observers: string[];
    chatlog: any;
    playerActionTracker: {
        [key: string]: any[];
    };
    id: string;
    leaveEvents: any[];
    w3mmd: any[];
    slots: any[];
    teams: any[];
    meta: GameMetaDataDecoded;
    playerList: any[];
    totalTimeTracker: number;
    timeSegmentTracker: number;
    playerActionTrackInterval: number;
    gametype: string;
    matchup: string;
    parseStartTime: number;
    constructor();
    parse($buffer: string): ParserOutput;
    handleMetaData(metaData: GameMetaDataDecoded): void;
    processGameDataBlock(block: GameDataBlock): void;
    handleTimeSlot(block: TimeSlotBlock): void;
    processCommandDataBlock(block: CommandDataBlock): void;
    handleActionBlock(action: ActionBlock, currentPlayer: Player): void;
    isObserver(player: Player): boolean;
    determineMatchup(): void;
    generateID(): void;
    cleanup(): void;
    finalize(): ParserOutput;
}
export default W3GReplay;
