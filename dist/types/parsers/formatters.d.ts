import { Parser } from 'binary-parser';
import { ItemID } from '../types';
declare const objectIdFormatter: (arr: any[]) => ItemID;
declare const raceFlagFormatter: (flag: Parser.Data) => Parser.Data;
declare const chatModeFormatter: (flag: Parser.Data) => Parser.Data;
export { objectIdFormatter, raceFlagFormatter, chatModeFormatter };
