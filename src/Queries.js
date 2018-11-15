import gql from 'graphql-tag';

export const FEED_MESSAGES = gql`{
    messages{
        body
        user
    }
}
`;
