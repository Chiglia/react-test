import * as actions from "./actionTypes";
import { Bug, Action } from "./actionTypes";
let lastId = 0;

export default function reducer(state: Bug[] = [], action: Action) {
  switch (action.type) {
    case actions.BUG_ADDED: {
      return [
        ...state,
        {
          id: ++lastId,
          description: action.payload.description,
          resolved: false,
        },
      ];
    }
    case actions.BUG_REMOVED: {
      return state.filter((bug) => bug.id !== action.payload.id);
    }
    case actions.BUG_RESOLVED: {
      return state.map((bug) => (bug.id !== action.payload.id ? bug : { ...bug, resolved: true }));
    }
    default: {
      break;
    }
  }
  return state;
}
