import React, { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import '../styles/output.css';
import SudokuGrid from '../components/Grid';
import { GameState, saveGameStateToFile } from '../main/storage';

function Sudoku() {
  const [gameState, setGameState] = useState();
  window.electron.ipcRenderer.once('load-game-state', (arg) => {
    // eslint-disable-next-line no-console
    console.debug('Game State:', arg);
    if (arg.ok) {
      setGameState(arg.data);
    }
    //setGameState(arg);
  });

  useEffect(() => {
    // Load the game session
    console.debug('Loading Game...');
    window.electron.ipcRenderer.sendMessage('load-game-state', []);
    return () => {
      // Save the game session
      console.debug('Saving game...');
      window.electron.ipcRenderer.sendMessage('save-game-state', gameState);
    };
  }, []);

  useEffect(() => {
    if (gameState)
      window.electron.ipcRenderer.sendMessage('save-game-state', gameState);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row">
        <button onClick={console.log}>New Game</button>
      </div>
      <div>
        <SudokuGrid
          className="mx-auto"
          existingState={gameState.current}
          onGameStateUpdate={(state) => {
            console.debug('onGameStateUpdate', state);
            setGameState(state);
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Sudoku />} />
      </Routes>
    </Router>
  );
}
