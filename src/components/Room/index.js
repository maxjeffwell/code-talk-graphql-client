import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';

import gql from 'graphql-tag';

import Loading from '../Loading';
import Editor from '../CodeMirror';

const CONTENT_EDITED = gql`
    subscription {
        editorContents {
            content{
                text
            }
        }
    }
`;


class Room extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.room.name}</h1>
        <p>{this.props.room.description}</p>
        <Editor />
      </div>
    );
  }
}

export default Room;
