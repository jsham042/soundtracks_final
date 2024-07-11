// Importing React and other necessary libraries
import React from 'react';
import './App.css'; // Assuming the CSS file is in the same directory

// App component definition
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My React App</h1>
        <p>This is a simple React component.</p>
      </header>
      <main>
        <section>
          <h2>Section Title</h2>
          <p>More content here...</p>
        </section>
      </main>
      <footer>
        <p>Footer content goes here.</p>
      </footer>
    </div>
  );
}

// Exporting the App component
export default App;