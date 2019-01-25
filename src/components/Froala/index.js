import React, { Component } from 'react';
import FroalaEditor from 'react-froala-wysiwyg';

export default class Froala extends Component {
	render() {
		return <FroalaEditor tag="textarea" />;
	}
}
