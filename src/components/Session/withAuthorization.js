import React from 'react';
import { useQuery } from '@apollo/client';
import { Navigate } from 'react-router-dom';

import * as routes from '../../constants/routes';
import { GET_ME } from './queries';

const withAuthorization = conditionFn => Component => props => {
  const { data, networkStatus } = useQuery(GET_ME);

  if (networkStatus < 7) {
    return null;
  }

  return conditionFn(data) ? (
    <Component {...props} />
  ) : (
    <Navigate to={routes.SIGN_IN} replace />
  );
};

export default withAuthorization;
