import React from 'react';
import './App.css';

// A Simple Counter and Timer
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
    <p>Click the Clicker!</p>
    <p> Clicker : {count}</p>
    <button class="clicker" onClick={() => setCount(count + 1)}> 🔥 </button>
    </div>

  );
}

function App() {
  
  return (
    <div className="App">
      <header className="App-header">

        <Counter />

        <p>
          Click the Clicker!
        </p>
        
      </header>
    </div>
  );
}

export default App;
