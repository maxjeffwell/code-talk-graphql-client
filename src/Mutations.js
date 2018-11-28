import gql from 'graphql-tag';

export const CREATE_USER = gql`
mutation CreateUserMutation($username: String!, $email: String!, $password: String!){
  signup(username: $username, email: $email, password: $password)
}
`;

export const LOGIN_USER = gql`
mutation LoginMutation($email: String!, $password: String!){
    login(email: $email, password: $password)
}
`;

export const LOGOUT_USER = gql`
  mutation LogoutMutation {
      logout {
          id
      }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessageMutation($text: String!) {
  createMessage(message: {text: $text})
  }
`;
