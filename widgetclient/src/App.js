import React, { Component } from 'react';
import Table from './Table'
import './App.css';

class App extends Component {
  state = {
    users: []
  }
  // componentDidMount = () => {
  //   axios.get('/testRoute', (req, res) => {
  //     this.sestState({users: res.data.this})
  //   })
    
  //   .then( users => {
  //     console.log(users);
  //     this.setState({users})});
  // }
  render = () => {
    return (
      <div className="App">
        <Table/>
      </div>
    );
  }
}

export default App;
