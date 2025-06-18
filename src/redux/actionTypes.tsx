export const BUG_ADDED = "bugAdded";
export const BUG_REMOVED = "bugRemoved";
export const BUG_RESOLVED = "bugResolved";

export interface Action {
  type: string;
  payload?: any;
}

export interface Bug {
  id: number;
  description: string;
  resolved: boolean;
}
