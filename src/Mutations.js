import gql from 'graphql-tag';

export const CREATE_USER = gql`
mutation CreateUserMutation($email: String!, $password: String!){
  signup(email: $email,password: $password)
}`;

export const LOGIN_USER = gql`
mutation LoginMutation($email: String!, $password: String!){
  login(email: $email, password: $password)
}
`;
