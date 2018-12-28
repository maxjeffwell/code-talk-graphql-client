import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import styled from 'styled-components';

const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        users {
            id
            username
            email
            messages {
                text
                user{
                    username
                }
            }
        }
    }
`;

const Center = styled.div`
  text-align: center;
`;

const UserList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 auto;
`;

class Users extends Component {
  render() {
    return (
      <Center>
        <p>Users</p>
        <Query query={ALL_USERS_QUERY}>
          {({ data, error, loading }) => {
            if(loading) return <p>Loading...</p>
            if(error) return <p>Error: {error.message}</p>
            return <UserList>{data.users.map(user => <p>
              {user.name}</p>)}</UserList>;
          }}
        </Query>
      </Center>
    );
  }
}

export default Users;
