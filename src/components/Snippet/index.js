import React from 'react';
import Dropzone from 'react-dropzone';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const Snippet = ({
	                    children, disableClick, channelId, mutate, style = {},
                    }) => (
	<Dropzone
		style={style}
		className="ignore"
		onDrop={async ([file]) => {
			const response = await mutate({
				variables: {
					file,
				},
			});
			console.log(response);
		}}
		disableClick={disableClick}
	>
		{children}
	</Dropzone>
);

const FILE_MESSAGE_MUTATION= gql`
    mutation($file: File) {
        createMessage(file: $file)
    }
`;

export default graphql(FILE_MESSAGE_MUTATION)(Snippet);