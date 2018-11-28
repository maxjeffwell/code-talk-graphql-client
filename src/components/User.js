import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { CURRENT_USER } from '../Queries';

export class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    }
  }

  render() {

    return (
      <section>
      <Query query={CURRENT_USER}>
        {({loading, error, data, refetch}) => {
        if (loading) return <div>Loading...</div>
        if (error) return <div>{error.message}</div>
        refetch();

        return <div>
            <p>{data.username}</p>
        </div>
        }}
      </Query>
      </section>
    );
  }
}

