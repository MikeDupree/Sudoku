class SudokuGrid {
  private grid: number[][];
  private selectedRow: number;
  private selectedCol: number;
  private gridSize: number;
  private p5: P5 | null;

  constructor(gridSize) {
    this.selectedRow = -1;
    this.selectedCol = -1;
    this.gridSize = 60;
    this.p5 = null;
  }

  private function() { }
}
