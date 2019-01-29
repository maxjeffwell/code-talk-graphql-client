import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import Loading from '../Loading';
import ErrorMessage from '../Error';

const GET_ALL_USERS_QUERY = gql`
    query GET_ALL_USERS_QUERY {
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

const Centered = styled.div`
  text-align: center;
  margin: auto;
`;

const UserList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 2px auto;
  list-style-type: none;
  overflow: hidden;
`;

class Users extends Component {
  render() {
    return (
      <Centered>
        <h1>Code Talkers</h1>
        <Query query={GET_ALL_USERS_QUERY}>
          {({ data, error, loading }) => {
            if(loading) return <Loading />;

            if(error) return <ErrorMessage error={error} />;

            return <UserList>{data.users.map(user =>
              <li key={user.id}>{user.username}</li>)}</UserList>;
          }}
        </Query>
      </Centered>
    );
  }
}

export default Users;
