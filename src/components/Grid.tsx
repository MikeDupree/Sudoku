import React, { useEffect } from 'react';
import p5 from 'p5';
import { generateSudokuBoard, isValidMove } from '../lib/Grid';

interface SudokuGridProps {
  onCellUpdate: (isValid: boolean) => void;
}

const SudokuGrid = ({ onCellUpdate }: SudokuGridProps) => {
  let gridSize = 60;
  let selectedRow = -1;
  let selectedCol = -1;
  const sudokuGrid = generateSudokuBoard('easy');
  const startingGrid = sudokuGrid.slice().map((row) => row.slice());

  useEffect(() => {
    const sketch = (p: any) => {
      p.setup = () => {
        p.createCanvas(540, 540);
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
        if (selectedRow !== -1 && selectedCol !== -1) {
          p.fill('rgba(0,255,0, 0.25)');
          p.noStroke();
          p.rect(
            selectedCol * gridSize,
            selectedRow * gridSize,
            gridSize,
            gridSize,
          );
        }

        // Highlight selected row and column
        if (selectedRow !== -1 && selectedCol !== -1) {
          p.fill('rgba(0,255,0, 0.25)');

          // Highlight row
          p.noStroke();
          p.rect(0, selectedRow * gridSize, p.width, gridSize);

          // Highlight column
          p.rect(selectedCol * gridSize, 0, gridSize, p.height);
        }
      };

      p.draw = () => {
        p.background(255);
        p.drawSudokuGrid();
      };

      p.mousePressed = () => {
        selectedRow = p.floor(p.mouseY / gridSize);
        selectedCol = p.floor(p.mouseX / gridSize);
      };

      p.keyPressed = (e: KeyboardEvent) => {
        if (
          selectedRow !== -1 &&
          selectedCol !== -1 &&
          p.keyCode >= 49 &&
          p.keyCode <= 57
        ) {
          const number = p.keyCode - 48; // Convert keyCode to actual number
          // Only let the user place numbers on what started as an empty cell
          // even if the board has a value the user can change it if it
          // wasn't a prefilled cell when the game started.
          console.log('is a zero cell', startingGrid[selectedRow][selectedCol]);
          if (startingGrid[selectedRow][selectedCol] === 0) {
            onCellUpdate(
              isValidMove(sudokuGrid, selectedRow, selectedCol, number),
            );
            if (!isValidMove(sudokuGrid, selectedRow, selectedCol, number)) {
              console.log('not a valid play dummy');
            }
            sudokuGrid[selectedRow][selectedCol] = number;
          }
        }
      };
    };

    new p5(sketch);
  }, []);

  return <div id="sudoku-canvas"></div>;
};

export default SudokuGrid;
