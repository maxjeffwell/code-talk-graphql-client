import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from './queries';
import { hasToken } from '../../utils/auth';

const withSession = Component => props => {
  const { data, refetch } = useQuery(GET_ME, {
    skip: !hasToken(),
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  });
  
  return (
    <Component {...props} session={data} refetch={refetch} />
  );
};

export default withSession;
