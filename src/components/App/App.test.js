import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchBar from "../SearchBar/SearchBar.js";

test('renders without crashing', () => {
  render(<App />);
  expect(screen.getByText('SOUND')).toBeInTheDocument();

});
