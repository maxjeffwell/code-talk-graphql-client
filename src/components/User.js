import React from 'react';
import { Query } from 'react-apollo';
import { CURRENT_USER } from '../Queries';
import PropTypes from 'prop-types';

const User = props => <Query {...props} query={CURRENT_USER}>{

  /*{ any props passed down from query need to be spread into the query component }*/

  payload => props.children(payload)

  /*{ child of query component takes payload and passes it to child function }*/

}</Query>;

User.propTypes = {
  children: PropTypes.func.isRequired, // only thing you must pass as a child is a function
};

export default User;

