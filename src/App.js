import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="flip-container">
        <div className="card">
           <div className="front">4</div>
           <div className="back">o</div>
        </div>
      </div>
    );
  }
}

export default App;
