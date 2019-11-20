/// <reference types="node" />
import { Parser } from 'binary-parser';
declare const DataBlock: Parser.Next<{
    blockSize: number;
} & {
    blockDecompressedSize: number;
} & {
    unknown: string;
}, "compressed", Buffer>;
declare const ReplayHeader: any;
declare const GameMetaData: Parser.Next<{
    player: {
        playerId: number;
    } & {
        playerName: string;
    } & {
        addDataFlagHost: number;
    } & {
        additional: {} | ({
            runtimeMS: string;
        } & {
            raceFlags: number;
        });
    };
} & {
    gameName: string;
} & {
    encodedString: string;
} & {
    playerCount: number;
} & {
    gameType: string;
} & {
    languageId: string;
} & {
    playerList: {}[] | number[] | object[];
} & {
    gameStartRecord: number;
} & {
    dataByteCount: number;
} & {
    slotRecordCount: number;
} & {
    playerSlotRecords: ({
        playerId: number;
    } & {
        slotStatus: number;
    } & {
        computerFlag: number;
    } & {
        teamId: number;
    } & {
        color: number;
    } & {
        raceFlag: number;
    } & {
        aiStrength: number;
    } & {
        handicapFlag: number;
    })[];
} & {
    randomSeed: number;
} & {
    selectMode: string;
}, "startSpotCount", number>;
declare const EncodedMapMetaString: Parser.Next<{
    speed: number;
} & {
    hideTerrain: number;
} & {
    mapExplored: number;
} & {
    alwaysVisible: number;
} & {
    default: number;
} & {
    observerMode: number;
} & {
    teamsTogether: number;
} & {
    empty: number;
} & {
    fixedTeams: number;
} & {
    fullSharedUnitControl: number;
} & {
    randomHero: number;
} & {
    randomRaces: number;
} & {
    referees: number;
} & {
    mapChecksum: string;
} & {
    mapName: string;
}, "creator", string>;
export { ReplayHeader, EncodedMapMetaString, GameMetaData, DataBlock };