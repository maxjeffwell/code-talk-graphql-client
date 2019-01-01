import React, { Component } from 'react';
// import gql from 'graphql-tag';
// import { Query } from 'react-apollo';

import { Sidebar } from '../Sidebar';
import Editor from '../CodeMirror';
// import Loading from '../Loading';
// import ErrorMessage from '../Error';

// export const ROOM_QUERY = gql`
//     query roomQuery($roomId : ID!) {
//         room(id: $roomId) {
//             id
//             title
//             users {
//                 id
//                 username
//             }
//         }
//     }
// `;

  // const USER_JOINED_SUBSCRIPTION = gql`
  //   subscription {
  //       userJoined {
  //           user {
  //               id
  //               username
  //           }
  //       }
  //   }
  // `

  // const Room = () => (
  // <Query query={ROOM_QUERY} variables={{ roomId: props.match.params.roomId }}>
  //   {({ data, loading, error }) => {
  //     if (!data) {
  //       return (
  //         <div>
  //           Nothing here yet
  //         </div>
  //       );
  //     }
  //
  //     const {room} = data;
  //
  //     if (loading || !room) {
  //       return <Loading/>;
  //     }
  //
  //     if (error) return <ErrorMessage/>;
  //
  //
  //     return (
  //       <Fragment>
  //         <Room
  //           room={room}
  //         />
  //         <Sidebar/>
  //         <Editor />
  //       </Fragment>
  //     );
  //       }
  //   }
  // </Query>
  // );

    //     const subscribeToMoreUsers = () => {
    //       this.props.subscribeToMore({
    //         document: USER_JOINED_SUBSCRIPTION,
    //         updateQuery: (prev, { subscriptionData }) => {
    //           if (!subscriptionData || !subscriptionData.data.userJoined) {
    //             return prev;
    //           }
    //
    //           const newUserJoined = subscriptionData.data.userJoined;
    //
    //           return Object.assign({}, prev, {
    //             users: [...prev.users, newUserJoined]
    //           });
    //         }
    //       });
    //     };
    //
    //     return children(room, subscribeToMoreUsers);
    //   }}
    //   </Query>
    // );


    //   render() {
    //     const { users } = this.props;
    //     return users.map(user => (
    //       <UserItem key={user.id} user={user} />
    //     ));
    //   }
    // }

// export const UserItem = ({ user }) =>
//   <li>
//     {user.username}
//   </li>;

export default class room extends Component {
  render() {
    return (
      <div>
        <Sidebar />
        <Editor />
      </div>
    );
  }
}



