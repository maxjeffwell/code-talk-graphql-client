import React, { Component } from 'react';
import AceEditor from 'react-ace';

import 'brace/theme/solarized_light';
import 'brace/mode/javascript';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      typing: ''
    };

    render()
    {

      return (
        <div classname="Ace-Editor">
          <h2>Ace Editor</h2>
          <AceEditor
            value={this.state.typing}
            mode="javascript"
            theme="solarized_light"
            name="Ace-Editor"
            width="100%"
            height="70%"
            fontSize="18px"
            tabSize={2}
            editorProps={{ $blockScrolling: true }}
            wrapEnabled={true}
          />
        </div>
      );
    }
    ;
  };
}

export default Editor;
