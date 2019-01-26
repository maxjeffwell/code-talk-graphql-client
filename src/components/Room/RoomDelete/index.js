// import React from 'react';
// import { Mutation } from 'react-apollo';
// import gql from 'graphql-tag';
//
// const GET_ALL_ROOMS = gql`
//     query {
//         rooms(order: "DESC") @connection(key: "RoomsConnection") {
//             edges {
//                 id
//                 text
//                 createdAt
//             }
//             pageInfo {
//                 hasNextPage
//             }
//         }
//     }
// `;
//
// const DELETE_ROOM = gql`
//     mutation($id: ID!) {
//         deleteRoom(id: $id)
//     }
// `;
//
// const RoomDelete = ({ room }) => (
//   <Mutation
//     mutation={DELETE_ROOM}
//     variables={{ id: room.id }}
//     update={cache => {
//       const data = cache.readQuery({
//         query: GET_ALL_ROOMS,
//       });
//
//       cache.writeQuery({
//         query: GET_ALL_ROOMS,
//         data: {
//           ...data,
//           rooms: {
//             ...data.rooms,
//             edges: data.rooms.edges.filter(
//               node => node.id !== room.id,
//             ),
//             pageInfo: data.rooms.pageInfo,
//           },
//         },
//       });
//     }}
//   >
//     {(deleteMessage, { data, loading, error }) => (
//       <button type="button" onClick={deleteMessage}>
//         Delete Room
//       </button>
//     )}
//   </Mutation>
// );
//
// export default RoomDelete;
