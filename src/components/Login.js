import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { LOGIN_USER } from '../Mutations';
import { CURRENT_USER } from "../Queries";

export class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }
  render(){
    const {email, password} = this.state;
    return (
      <section>
        <p>Logged In: {localStorage.getItem('AUTH_TOKEN') ? 'true' : 'false'}</p>
        <input type="text" placeholder="Email" value={email} onChange={e => this.setState({email: e.target.value})} />
        <input type="text" placeholder="Password" value={password} onChange={e => this.setState({password: e.target.value})} />
        <Mutation mutation={LOGIN_USER}
                  variables={{email, password}}
                  refetchQueries={[{ query: CURRENT_USER }]}
                  onCompleted={data => {localStorage.setItem('AUTH_TOKEN', data.login);
                  this.props.history.push('/');
        }}>
          {parsedLink => <button onClick={parsedLink}>Login</button>}
        </Mutation>
      </section>
    )
  }
}
