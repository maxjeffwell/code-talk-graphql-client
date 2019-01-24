import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

export default class Froala extends Component {
	render() {
		return <FroalaEditor tag="textarea"/>;
	}
}
