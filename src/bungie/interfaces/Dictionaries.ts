// I made these up but they fit the theme
export interface DataCollection<T> {
  data: {
    [id: number]: T;
  }
  privacy: number;
  disabled?: boolean;
}

export interface DataSingle<T> {
  data: T;
  privacy: number;
  disabled?: boolean;
}