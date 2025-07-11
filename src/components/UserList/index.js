import React from 'react';
import { useQuery } from '@apollo/client';
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

const Users = () => {
  const { data, error, loading } = useQuery(GET_ALL_USERS_QUERY);

  if (loading) return <Loading />;

  if (error) return <ErrorMessage error={error} />;

  return (
    <Centered>
      <h1>Code Talkers</h1>
      <UserList>
        {data.users.map(user =>
          <li key={user.id}>{user.username}</li>
        )}
      </UserList>
    </Centered>
  );
};

export default Users;
