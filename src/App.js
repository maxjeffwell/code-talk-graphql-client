import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { CreateUser } from './components/CreateUser';
import { Login } from './components/Login';
import { Landing } from './components/Landing';
import { Messages } from './components/Messages'
import { TestSub } from './components/Test-Sub';
import About from './components/About';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Code Talk</h1>
        </header>
        <Router>
          <main>
            <nav>
              <ul className="menu">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/createuser">Create User</Link></li>
                <li><Link to="/messages">Messages</Link></li>
              </ul>
            </nav>
            <Route exact path="/" component={Landing} />
            <Route exact path="/about" component={About} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/createuser" component={CreateUser} />
            <Route exact path="/messages" component={Messages} />
            <Route exact path="/test-sub" component={TestSub} />
          </main>
        </Router>
      </div>
    );
  }
}

export default App;
