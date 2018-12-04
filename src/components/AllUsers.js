import React from 'react';
import gql from "graphql-tag";
import { graphql } from 'react-apollo';

const AllUsers = ({ data: { allUsers = []}}) => allUsers.map(u => <h1 key={u.id}>{u.email}</h1>);


const allUsersQuery = gql`    
    {
        allUsers {
            id
            username
        }
    }
`;

export default graphql(allUsersQuery)(AllUsers);



