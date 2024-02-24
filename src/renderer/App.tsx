import React, { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import '../styles/output.css';
import SudokuGrid from '../components/Grid';

function Sudoku() {
  const [errors, setErrors] = useState(0);

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="text-orange-300 m-4">Errors: {errors}</div>
        <div className="m-4">
          <SudokuGrid
            className="mx-auto"
            onCellUpdate={(isValidMove) => {
              !isValidMove && setErrors((prevState) => prevState + 1);
            }}
          />
        </div>
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
