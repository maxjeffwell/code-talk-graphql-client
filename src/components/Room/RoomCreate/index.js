import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import ErrorMessage from '../../Error';
import Loading from '../../Loading';

const CREATE_ROOM = gql`
  mutation ($title: String!) {
      createRoom(title: $title) {
          title
          createdAt
      }
  }
`;

const RoomCreate = () => {
  const [title, setTitle] = useState('');
  
  const [createRoom, { data, loading, error }] = useMutation(CREATE_ROOM, {
    variables: { title },
    optimisticResponse: {
      createRoom: {
        title,
        __typename: 'Room',
      }
    }
  });

  const onChange = event => {
    const { name, value } = event.target;
    if (name === 'title') {
      setTitle(value);
    }
  };

  const onSubmit = async (event) => {
    try {
      // event.preventDefault();
      await createRoom();
      setTitle('');
    } catch (error) {}
  };

  return (
    <form onSubmit={onSubmit}>
      <input 
        type="text"
        name="title"
        value={title}
        onChange={onChange}
        autoComplete="off"
        placeholder="Create a room..."
        required
      />
      <button type="submit">Submit</button>

      {loading && <Loading />}
      {error && <ErrorMessage error={error} />}
    </form>
  );
};

export default RoomCreate;
