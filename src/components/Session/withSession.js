import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from './queries';
import { hasToken } from '../../utils/auth';

const withSession = Component => props => {
  const { data, refetch, loading } = useQuery(GET_ME, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  });

  return (
    <Component {...props} session={data} refetch={refetch} sessionLoading={loading} />
  );
};

export default withSession;
