import fs from 'fs';
import path from 'path';

export interface GameState {
  mistakes: number;
  current: number[][];
  initial: number[][];
}

export function saveGameStateToFile(gameState: GameState) {
  // Create the directory if it doesn't exist
  const directoryPath = path.join(process.env.HOME, '.sudoku');
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  // Create the file path
  const filePath = path.join(directoryPath, 'sudoku_data.json');

  // Convert the data to JSON
  const jsonData = JSON.stringify(gameState, null, 2); // 2 spaces for indentation

  // Save the JSON data to the file
  fs.writeFileSync(filePath, jsonData);

  console.log(`Data saved to ${filePath}`);
}

export function loadGameStateFromFile() {
  // Create the file path

  const directoryPath = path.join(process.env.HOME, '.sudoku');
  if (!fs.existsSync(directoryPath)) {
    return { ok: false, data: undefined };
  }
  const filePath = path.join(directoryPath, 'sudoku_data.json');
  try {
    const gameStateJson = fs.readFileSync(filePath, 'utf-8');
    const gameState = JSON.parse(gameStateJson);
    return {
      ok: true,
      data: gameState,
    };
  } catch (err) {
    console.log('error loading game', err);
  }

  return {
    ok: false,
    data: undefined,
  };
}
