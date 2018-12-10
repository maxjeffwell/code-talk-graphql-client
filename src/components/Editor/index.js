import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AceEditor from 'react-ace';

import 'brace/theme/chrome';
import 'brace/mode/javascript';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      typing: ''
    };
  };

    render()
    {

      return (
        <div classname="Ace-Editor">
          <h2>Ace Editor</h2>
          <AceEditor
            value={this.state.typing}
            mode="javascript"
            code="Write code here"
            theme="chrome"
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
      );
    }
    ;
  };

export default withRouter(Editor);
