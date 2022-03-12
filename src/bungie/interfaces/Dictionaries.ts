/**
 * A DataCollection object. Some API Responses use this. I made this up
 */
export interface DataCollection<T> {
  data: {
    [id: number]: T;
  }
  privacy: number;
  disabled?: boolean;
}

/**
 * A Data object. Some API responses use this. I made this up
 */
export interface DataSingle<T> {
  data: T;
  privacy: number;
  disabled?: boolean;
}