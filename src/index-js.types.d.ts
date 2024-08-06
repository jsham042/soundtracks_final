// Derived from src/index.js

// Importing React and ReactDOM types from their respective type definitions
import { ReactElement } from 'react';
import { render } from 'react-dom';

// Define the type for the App component
export type AppComponent = () => ReactElement;

// Define the type for the registerServiceWorker function
export type RegisterServiceWorker = () => void;
