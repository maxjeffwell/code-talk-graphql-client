import React, { Component } from 'react';
import gql from 'graphql-tag';

import { Sidebar } from '../Sidebar';
import Editor from '../CodeMirror';


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
      <>
      <Sidebar />
      <Editor />
      </>
    );
  }
}

export default Room;
