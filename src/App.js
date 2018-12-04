import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
import jwt from 'jsonwebtoken';

import logo from './logo.svg';
import './App.css';

import { HeaderBar } from './components/Header-Bar';
import  CreateUser from './components/CreateUser';
import { Login } from './components/Login';
import { Landing } from './components/Landing';
import { Messages } from './components/Messages';
import AllUsers from './components/AllUsers';
import Logout  from './components/Logout';
import About from './components/About';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  try {
    jwt.decode(token);
  } catch(err) {
    return false;
  }
  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: '/login',
        }}
        />
          ))}
      />
);

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Code Talk</h1>
        </header>
        <Router>
          <Switch>
          <main>
            <nav>
              <ul className="menu">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/messages">Messages</Link></li>
                <li><Link to="/logout">Sign Out</Link></li>
                <li><Link to="/allusers">Users</Link></li>
              </ul>
            </nav>
            <HeaderBar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/about" component={About} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={CreateUser} />
            <PrivateRoute path="/messages" component={Messages} />
            <PrivateRoute path="/allusers" component={AllUsers} />
            <Route exact path="/logout" component={Logout} />
          </main>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
