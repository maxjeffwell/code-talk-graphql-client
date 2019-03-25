import React from 'react';
import { Query } from 'react-apollo';
import { GET_ME_QUERY } from './queries';

const withSession = Component => props => (
  <Query query={GET_ME_QUERY}>
      {({ data, refetch }) => (
        <Component {...props} session={data} refetch={refetch} />
      )}
  </Query>
);

export default withSession;
