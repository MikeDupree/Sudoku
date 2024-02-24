import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import SudokuGrid from '../components/Grid';
import { useState } from 'react';
import { isValidMove } from '../lib/Grid';

function Hello() {
  const [errors, setErrors] = useState(0);

  return (
    <div>
      Errors: {errors}
      <SudokuGrid
        onCellUpdate={(isValidMove) => {
          !isValidMove && setErrors((prevState) => prevState + 1);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
