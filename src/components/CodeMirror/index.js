import React, { Component } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/ruby/ruby.js'
import 'codemirror/mode/swift/swift.js'
import 'codemirror/mode/clojure/clojure.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/erlang/erlang.js'
import 'codemirror/mode/coffeescript/coffeescript.js'
import 'codemirror/mode/crystal/crystal.js'

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/bespin.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/isotope.css';
import 'codemirror/theme/duotone-light.css';
import 'codemirror/theme/icecoder.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/midnight.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/display/placeholder';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'CodeMirror',
      code: '',
    }
  }

  updateCode(newCode) {
    this.setState({
      code: newCode,
    });
  }

  render() {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      theme: 'monokai',
    };

    return (
        <div>
          <CodeMirror
            value={this.state.code}
            onChange={this.updateCode.bind(this)}
            options={options}
          />
        </div>
    );
  }
}

export default Editor;
