import React, { Component, Fragment } from 'react';
import withAuthorization from '../Session/withAuthorization';

import AceEditor from 'react-ace';

import 'brace/theme/gob';
import 'brace/mode/javascript';

import Sidebar from '../Sidebar';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      typing: ''
    };
  };

    render() {

      return (
        <Fragment>
        <Sidebar />
        <div className="Ace-Editor">
          <h2>Ace Editor</h2>
          <AceEditor
            value={this.state.typing}
            mode="javascript"
            code="Write code here"
            theme="gob"
            name="Ace-Editor"
            width="100%"
            minLines={25}
            maxLines={50}
            height="70%"
            fontSize="18px"
            border="1px solid lightgray"
            tabSize={2}
            editorProps={{ $blockScrolling: true }}
            wrapEnabled={true}
            onLoad={(editor) => {
              editor.focus();
              editor.getSession().setUseWrapMode(true);
            }}
          />
        </div>
        </Fragment>
      );
    }
    ;
  };

export default withAuthorization(session => session && session.me)(Editor);
