import { createStore } from "redux";
import reducer from "../redux/reducer";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => any;
  }
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
