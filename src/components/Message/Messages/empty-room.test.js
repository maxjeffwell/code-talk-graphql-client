import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockLink, MockSubscriptionLink } from '@apollo/client/testing';
import { getMainDefinition } from '@apollo/client/utilities';
import Messages from './index';
import { GET_PAGINATED_MESSAGES_QUERY } from '../queries';
import { GET_ME } from '../../Session/queries';

// Regression for "a message sent into an empty room only shows up after a
// refresh" (2026-10-22). Two client-side defects hid the real cause (a server
// schema error on empty pages): the component rendered its "No messages"
// placeholder whenever the query had no data -- including on error, which was
// therefore never shown -- and an empty-but-successful page rendered a bare
// list with no placeholder at all. In both shapes the list and its
// subscriptions must still be mounted so a new message can arrive.

const ROOM = '42';
const QUERY_VARS = { limit: 10, roomId: ROOM };
const me = { __typename: 'User', id: 'u1', username: 'jeff', email: 'j@x', role: 'ADMIN' };

function renderMessages(messagesResult) {
  const subscriptionLink = new MockSubscriptionLink();
  const mocks = [
    { request: { query: GET_PAGINATED_MESSAGES_QUERY, variables: QUERY_VARS }, ...messagesResult },
    { request: { query: GET_ME }, result: { data: { me } }, maxUsageCount: Number.POSITIVE_INFINITY },
  ];
  const link = ApolloLink.split(
    ({ query }) => { const d = getMainDefinition(query); return d.kind === 'OperationDefinition' && d.operation === 'subscription'; },
    subscriptionLink,
    new MockLink(mocks, false),
  );
  const client = new ApolloClient({ link, cache: new InMemoryCache({ addTypename: false }) });
  render(<ApolloProvider client={client}><Messages limit={10} roomId={ROOM} /></ApolloProvider>);
  return { subscriptionLink };
}

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

test('a failing messages query shows the error, not the "no messages" placeholder', async () => {
  renderMessages({ error: new Error('Cannot return null for non-nullable field PageInfo.endCursor.') });

  expect(await screen.findByText(/non-nullable field PageInfo.endCursor/)).toBeInTheDocument();
  expect(screen.queryByText(/No messages have been created yet/)).not.toBeInTheDocument();
});

test('an empty room shows the placeholder and still receives new messages live', async () => {
  const { subscriptionLink } = renderMessages({
    result: { data: { messages: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } } } },
  });

  expect(await screen.findByText(/No messages have been created yet/)).toBeInTheDocument();

  // The list's messageCreated subscription must be live for this room.
  expect(subscriptionLink.operation).toBeDefined();
  expect(subscriptionLink.operation.variables).toEqual({ roomId: ROOM });

  await act(async () => {
    subscriptionLink.simulateResult({
      result: {
        data: {
          messageCreated: {
            message: {
              id: 'm1', text: 'hello empty room', createdAt: '2026-10-22T05:45:00.000Z', roomId: ROOM,
              user: { id: 'u1', username: 'jeff' },
            },
          },
        },
      },
    });
  });

  expect(await screen.findByText(/hello empty room/)).toBeInTheDocument();
  expect(screen.queryByText(/No messages have been created yet/)).not.toBeInTheDocument();
});
