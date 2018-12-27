import React, { Component, Fragment } from 'react';
import withAuthorization from '../Session/withAuthorization';

import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/mode/javascript/javascript.js';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/display/placeholder';

import Sidebar from '../Sidebar';

class Editor extends Component {
  render() {
    return (
      <Fragment>
        <Sidebar />
        <div>
        <CodeMirror
        {...this.props}
        editorDidMount={editor => {
          editor.refresh();
        }}
        options={Object.assign(
          {
            mode: 'javascript',
            lineNumbers: true,
            theme: 'monokai',
            highlightSelectionMatches: true,
            indentUnit: 4,
            tabSize: 4,
            lineWrapping: true,
            dragDrop: false,
            keyMap: 'sublime',
            matchBrackets: true,
            autoCloseBrackets: true,
          },
          this.props.options || {}
        )}
      />
        </div>
      </Fragment>
    );
  };
}

export default withAuthorization(session => session && session.me)(Editor);
