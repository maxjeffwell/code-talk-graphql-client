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

export const CREATE_MESSAGE = gql`
  mutation CreateMessageMutation($text: String!, 
  $username: String!) {
  createMessage(message: {text: $text, username: $username
  }){
      text
      username
  }
  }
`;
