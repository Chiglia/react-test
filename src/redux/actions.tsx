import * as actions from "./actionTypes";

export function bugAdded(description: string) {
  return {
    type: actions.BUG_ADDED,
    payload: {
      description: description,
    },
  };
}

export function bugRemoved(id: number) {
  return {
    type: actions.BUG_REMOVED,
    payload: {
      id: id,
    },
  };
}

export const bugResolved = (id: number) => ({
  type: actions.BUG_RESOLVED,
  payload: {
    id,
  },
});
