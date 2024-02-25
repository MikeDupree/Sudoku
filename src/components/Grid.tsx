import React, { useEffect, useRef, useState } from 'react';
import P5 from 'p5';
import { generateSudokuBoard, isValidMove } from '../lib/Grid';
import { error } from 'console';

interface SudokuGridProps {
  className?: string;
  onCellUpdate?: (isValid: boolean) => void;
  onGameStateUpdate?: (isValid: boolean) => void;
}

function SudokuGrid(props: SudokuGridProps) {
  const [loading, setLoading] = useState(true);
  const [sudokuGrid, setSudokuGrid] = useState();
  const [startingGrid, setStartingGrid] = useState();
  const [errors, setErrors] = useState(0);
  const { onGameStateUpdate, onCellUpdate, className } = props;
  const gridSize = 60;
  const selectedRowRef = useRef<number>(-1);
  const selectedColRef = useRef<number>(-1);
  const sudokuBoard = useRef(null);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('load-game-state');
  }, []);

  window.electron.ipcRenderer.once('load-game-state', (arg) => {
    if (arg.ok) {
      setSudokuGrid(arg.data.current);
      setStartingGrid(arg.data.initial);
      setErrors(arg.data.mistakes);
    } else {
      const startGrid = generateSudokuBoard();
      setSudokuGrid(startGrid);
      setStartingGrid(startGrid.slice().map((row) => row.slice()));
    }
  });

  useEffect(() => {
    if (sudokuGrid && startingGrid) {
      const sketch = (p: any) => {
        p.setup = () => {
          if (!sudokuBoard.current) {
            console.debug('Creating Canvas...');
            const canvas = p.createCanvas(540, 540);
            canvas.parent('sudoku-canvas');
          }
        };

        p.drawSudokuGrid = () => {
          p.strokeWeight(2);
          for (let i = 0; i < 9; i++) {
            if (i % 3 === 0) {
              p.stroke(0);
              p.strokeWeight(4);
            } else {
              p.stroke(150);
              p.strokeWeight(2);
            }

            // Draw horizontal lines
            p.line(0, i * gridSize, p.width, i * gridSize);

            // Draw vertical lines
            p.line(i * gridSize, 0, i * gridSize, p.height);

            // Display numbers
            for (let j = 0; j < 9; j++) {
              const value = sudokuGrid[i][j];
              if (value !== 0) {
                p.fill(0);
                p.noStroke();
                p.textSize(24);
                p.textAlign(p.CENTER, p.CENTER);
                p.text(
                  value,
                  j * gridSize + gridSize / 2,
                  i * gridSize + gridSize / 2,
                );
              }
            }
          }

          // Highlight selected grid
          if (selectedRowRef.current !== -1 && selectedColRef.current !== -1) {
            p.fill('rgba(0,255,0, 0.25)');
            p.noStroke();
            p.rect(
              selectedColRef.current * gridSize,
              selectedRowRef.current * gridSize,
              gridSize,
              gridSize,
            );
          }

          // Highlight selected row and column
          if (selectedRowRef.current !== -1 && selectedColRef.current !== -1) {
            p.fill('rgba(0,255,0, 0.25)');

            // Highlight row
            p.noStroke();
            p.rect(0, selectedRowRef.current * gridSize, p.width, gridSize);

            // Highlight column
            p.rect(selectedColRef.current * gridSize, 0, gridSize, p.height);
          }
        };

        p.draw = () => {
          p.background(255);
          p.drawSudokuGrid();
        };

        p.mousePressed = () => {
          selectedRowRef.current = p.floor(p.mouseY / gridSize);
          selectedColRef.current = p.floor(p.mouseX / gridSize);
        };

        p.keyPressed = () => {
          if (
            selectedRowRef.current !== -1 &&
            selectedColRef.current !== -1 &&
            p.keyCode >= 49 &&
            p.keyCode <= 57
          ) {
            const number = p.keyCode - 48; // Convert keyCode to actual number
            // Only let the user place numbers on what started as an empty cell
            // even if the board has a value the user can change it if it
            // wasn't a prefilled cell when the game started.
            if (
              startingGrid[selectedRowRef.current][selectedColRef.current] === 0
            ) {
              const valid = isValidMove(
                sudokuGrid,
                selectedRowRef.current,
                selectedColRef.current,
                number,
              );
              if (!valid) {
                setErrors((prevState) => prevState + 1);
              }
              sudokuGrid[selectedRowRef.current][selectedColRef.current] =
                number;

              onGameStateUpdate?.({
                mistakes: 0,
                current: sudokuGrid,
                initial: startingGrid,
              });
            }
          }
        };
      };

      if (!sudokuBoard.current) {
        onGameStateUpdate?.({
          mistakes: 0,
          current: sudokuGrid,
          initial: startingGrid,
        });
        sudokuBoard.current = new P5(sketch);
      }
    }
  }, [onGameStateUpdate, sudokuGrid, startingGrid]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-orange-300 m-4">Errors: {errors}</div>
      <div className="m-4">
        <div id="sudoku-canvas" className={className} />
      </div>
    </div>
  );
}

export default SudokuGrid;
