// This file mirrors the API data structure(for the most part)
// I may refactor later so it's not so awful looking in the other files
// https://bungie-net.github.io/multi/index.html

export * as Destiny from "./Destiny";
export * as Dictionaries from "./Dictionaries";
export * as GroupsV2 from "./GroupsV2";
export * as User from "./User";

/**
 * A Response object. I made this up
 */
export interface Response<T> {
  Response: T;
  ErrorCode: number;
  ThrottleSeconds: number;
  ErrorStatus: string;
  Message: string;
  MessageData: { [key: string]: string; }
  DetailedErrorTrace: string;
}

/**
 * Table used by the manifest response. I made this up.
 */
export interface Table {
  [hash: number]: any
}

/**
 * Data object to handle manifest response. I made this up.
 */
export interface Data {
  [table: number]: Table;
}