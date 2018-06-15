import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    users: []
  }
  componentDidMount() {
    axios.get('/testRoute', (req, res) => {
      this.sestState({users: res.data.this})
    })
    
    .then( users => {
      console.log(users);
      this.setState({users})});
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.state.users[0]}</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
