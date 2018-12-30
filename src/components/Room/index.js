import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { Sidebar } from '../Sidebar';
import Editor from '../CodeMirror';
import Loading from '../Loading';
import ErrorMessage from '../Error';


const USER_JOINED_SUBSCRIPTION = gql`
    subscription {
        userJoined {
            user{
                id
                username
            }
        }
    }
`;

const GET_ROOM_WITH_USERS_QUERY = gql` 
    query($roomId: ID!) {
        room {
            id
            title
            users{
                user{
                    id
                    username
                }
            }
        }
    }
`;

const Users = ({ children }) => (
  <Query query={GET_ROOM_WITH_USERS_QUERY}>
    {({ loading, error, data, subscribeToMore }) => {
      if (!data) {
        return (
          <div>
            No users here yet
          </div>
        );
      }

      const { users } = data;

      if (loading || !users) {
        return <Loading />;
      }

      if (error) return <ErrorMessage />;

        const subscribeToMoreUsers = () => {
          subscribeToMore({
            document: USER_JOINED_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData || !subscriptionData.data.userJoined) {
                return prev;
              }

              const newUserJoined = subscriptionData.data.userJoined;

              return Object.assign({}, prev, {
                users: [...prev.users, newUserJoined]
              });
            }
          });
        };

        return children(data.rooms, subscribeToMoreUsers);
      }}
      </Query>
    );

    class Room extends Component {
      componentDidMount() {
        this.props.subscribeToMoreUsers();
      }
      render() {
        const { users } = this.props;
        return users.map(user => (
          <>
          <UserItem key={user.id} user={user} />
          <Sidebar />
          <Editor />
          </>
        ));
        }
      }

      const UserItem = ({ user }) =>
        <p>{user.username}</p>;

export default Users;
