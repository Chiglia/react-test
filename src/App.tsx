import React from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { bugAdded } from "./redux/actions";
import { Bug } from "./redux/actionTypes";

function App() {
  const dispatch = useDispatch();
  const state = useSelector((state: Bug[]) => state[state.length - 1] || { description: "" });
  const handleAddMessage = () => {
    dispatch(bugAdded(`Nuovo messaggio aggiunto alle ${new Date().toLocaleTimeString()}`));
  };
  return (
    <>
      <button onClick={handleAddMessage}>Aggiungi Messaggio</button>
      <h1>{state.description}</h1>
    </>
  );
}

export default App;
