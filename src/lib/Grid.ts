function generateSudokuBoard(difficulty = 'easy') {
  // Initialize an empty 9x9 grid
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

  // Generate a valid Sudoku board
  fillSudoku(grid);

  // Remove numbers based on difficulty
  removeNumbers(grid, difficulty);

  return grid;
}
// Helper function to check if a number can be placed in a specific cell
const isSafe = (grid: number[], row: number, col: number, num: number) => {
  // Check if the number is not present in the current row and column
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) {
      return false;
    }
  }

  // Check if the number is not present in the 3x3 subgrid
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (grid[x + startRow][y + startCol] === num) {
        return false;
      }
    }
  }

  return true;
};

function fillSudoku(grid) {
  // Helper function to solve the Sudoku using backtracking
  const solveSudoku = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(grid, row, col, num)) {
              grid[row][col] = num;

              if (solveSudoku()) {
                return true;
              }

              grid[row][col] = 0; // Backtrack if the current configuration is not valid
            }
          }
          return false; // If no number can be placed, backtrack
        }
      }
    }
    return true; // If the grid is filled, the Sudoku is solved
  };

  solveSudoku();
}

function removeNumbers(grid, difficulty) {
  // Determine the number of cells to remove based on difficulty
  let cellsToRemove = 30;
  if (difficulty === 'easy') {
    cellsToRemove = 30; // Adjust based on difficulty levels
  } else if (difficulty === 'medium') {
    cellsToRemove = 40;
  } else if (difficulty === 'hard') {
    cellsToRemove = 50;
  }

  // Randomly remove cells while maintaining uniqueness of solution
  let cellsRemoved = 0;
  while (cellsRemoved < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (grid[row][col] !== 0) {
      const backup = grid[row][col];
      grid[row][col] = 0;

      // Check if the solution is unique for the current configuration
      const tempGrid = JSON.parse(JSON.stringify(grid)); // Create a deep copy
      if (hasUniqueSolution(tempGrid)) {
        cellsRemoved++;
      } else {
        grid[row][col] = backup; // Restore the value if the solution is not unique
      }
    }
  }
}

function hasUniqueSolution(grid) {
  const solutions = [];
  const solveSudoku = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(grid, row, col, num)) {
              grid[row][col] = num;
              if (solveSudoku()) {
                solutions.push(JSON.stringify(grid)); // Store the solution
              }
              grid[row][col] = 0; // Backtrack
            }
          }
          return false; // If no number can be placed, backtrack
        }
      }
    }
    return true; // If the grid is filled, the Sudoku is solved
  };

  solveSudoku();

  // If there is only one solution, the Sudoku has a unique solution
  return solutions.length === 1;
}

function isValidMove(grid, row, col, num) {
  // Check if the number is already present in the same row or column
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) {
      return false;
    }
  }

  // Check if the number is present in the 3x3 grid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }

  // If the number passes all checks, it's a valid move
  return true;
}

export { generateSudokuBoard, isValidMove };
