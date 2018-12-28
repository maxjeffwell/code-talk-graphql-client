import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../Loading';
import Editor from '../CodeMirror';
import { RoomListItem } from '../RoomList';
import { Sidebar } from '../Sidebar';

const EDITOR_CONTENT = gql`
    subscription {
        editorContent {
            editor {
                code
            }
        }
    }
`;

class Room extends Component {
  render() {
    return (
      <div>
        <RoomListItem />
        <Sidebar />
        <Editor />
      </div>
    );
  }
}

export default Room;
