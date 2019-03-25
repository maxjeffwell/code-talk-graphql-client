import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const UPLOAD_FILE_MUTATION = gql`
    mutation uploadFileMutation($file: Upload!) {
        uploadFile(file: $file)
    }
`;

export default () =>
  <Mutation mutation={UPLOAD_FILE_MUTATION}>
		{uploadFile => <input
			type="file"
			required
			onChange={({target: {validity, files: [ file ]}}) =>
				validity.valid && uploadFile({variables: { file }})
			}
		/>}
	</Mutation>;