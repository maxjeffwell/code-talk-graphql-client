import gql from 'graphql-tag';

export const FEED_MESSAGES = gql`{
    query allMessagesQuery {
        allMessages(last: 50) {
            id
            text
            createdAt
            sentBy {
                id
                username
            }
        }
    }
`;
