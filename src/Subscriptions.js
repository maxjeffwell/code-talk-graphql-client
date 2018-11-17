import gql from 'graphql-tag';

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription {
      Message(filter: {
          mutation_in: [CREATED]
      }) {
          node {
              id
              text
              createdAt
              sentBy {
                  id
                  name
              }
          }
      }
  }
`;

