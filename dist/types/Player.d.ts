import { Races, ItemID } from './types';
export declare const reduceHeroes: (heroCollector: {
    [key: string]: HeroInfo;
}) => HeroInfo[];
interface Ability {
    type: 'ability';
    time: number;
    value: string;
}
interface Retraining {
    type: 'retraining';
    time: number;
}
export interface HeroInfo {
    level: number;
    abilities: {
        [key: string]: number;
    };
    order: number;
    id: string;
    retrainingHistory: {
        time: number;
        abilities: {
            [key: string]: number;
        };
    }[];
    abilityOrder: (Ability | Retraining)[];
}
declare class Player {
    id: number;
    name: string;
    teamid: number;
    color: string;
    race: Races;
    raceDetected: string;
    units: {
        summary: {
            [key: string]: number;
        };
        order: {
            id: string;
            ms: number;
        }[];
    };
    upgrades: {
        summary: {
            [key: string]: number;
        };
        order: {
            id: string;
            ms: number;
        }[];
    };
    items: {
        summary: {
            [key: string]: number;
        };
        order: {
            id: string;
            ms: number;
        }[];
    };
    buildings: {
        summary: {
            [key: string]: number;
        };
        order: {
            id: string;
            ms: number;
        }[];
    };
    pings: {
        ms: number;
        coords: number[];
    }[];
    heroes: HeroInfo[];
    heroCollector: {
        [key: string]: HeroInfo;
    };
    heroCount: number;
    actions: {
        timed: any[];
        assigngroup: number;
        rightclick: number;
        basic: number;
        buildtrain: number;
        ability: number;
        item: number;
        select: number;
        removeunit: number;
        subgroup: number;
        selecthotkey: number;
        esc: number;
        ping: number;
    };
    _currentlyTrackedAPM: number;
    _retrainingMetadata: {
        [key: string]: {
            start: number;
            end: number;
        };
    };
    _lastRetrainingTime: number;
    _lastActionWasDeselect: boolean;
    currentTimePlayed: number;
    apm: number;
    constructor(id: number, name: string, teamid: number, color: number, race: Races);
    newActionTrackingSegment(timeTrackingInterval?: number): void;
    detectRaceByActionId(actionId: string): void;
    handleStringencodedItemID(actionId: string, gametime: number): void;
    handleHeroSkill(actionId: string, gametime: number): void;
    handleRetraining(gametime: number): void;
    handle0x10(itemid: ItemID, gametime: number): void;
    handle0x11(itemid: ItemID, gametime: number): void;
    handle0x12(itemid: ItemID): void;
    handle0x13(itemid: string): void;
    handle0x14(itemid: ItemID): void;
    handle0x16(selectMode: number, isAPM: boolean): void;
    handleOther(actionId: number): void;
    handlePing(gametime: number, pingCoords: number[]): void;
    cleanup(): void;
}
export default Player;
