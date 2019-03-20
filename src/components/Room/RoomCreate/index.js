import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
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

class RoomCreate extends Component {
  state = {
    title: '',
  };

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = async (event, createRoom) => {
    try {
      // event.preventDefault();
      await createRoom();
      this.setState({ title: '' });
    } catch (error) {}
  };

  render() {
    const { title } = this.state;

    return (
      <Mutation
        mutation={CREATE_ROOM}
        variables={{ title }}
        optimisticResponse={{
          createRoom: {
            title,
            __typename: 'Room',
          }
        }}
      >
        {(createRoom, { data, loading, error }) => (
          <form
            onSubmit={event => this.onSubmit(event, createRoom)}
          >
            <input type="text"
                   name="title"
                   value={title}
                   onChange={this.onChange}
                   autoComplete="off"
                   placeholder="Create a room..."
                   required
            />
            <button type="submit">Submit</button>

            {loading && <Loading />}
            {error && <ErrorMessage error={error} />}

          </form>
        )}
      </Mutation>
    );
  }
}

export default RoomCreate;
