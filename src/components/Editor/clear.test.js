import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockLink, MockSubscriptionLink } from '@apollo/client/testing';
import { getMainDefinition } from '@apollo/client/utilities';
import Editor, { READ_CODE_QUERY, TYPE_CODE_MUTATION } from './index';

// Regression: typing a word, letting the server echo it back through the
// typingCode subscription, then backspacing the box empty must leave it empty.
// The old "seed local state when it is empty" effect re-ran on the user's own
// empty string and restored the echoed word.
function renderEditor() {
  const subscriptionLink = new MockSubscriptionLink();
  const mocks = [
    { request: { query: READ_CODE_QUERY }, result: { data: { readCode: { __typename: 'Code', body: '' } } } },
    { request: { query: TYPE_CODE_MUTATION, variables: { body: 'hi' } }, result: { data: { typeCode: { __typename: 'Code', body: 'hi' } } } },
    { request: { query: TYPE_CODE_MUTATION, variables: { body: 'h' } }, result: { data: { typeCode: { __typename: 'Code', body: 'h' } } } },
    { request: { query: TYPE_CODE_MUTATION, variables: { body: '' } }, result: { data: { typeCode: { __typename: 'Code', body: '' } } } },
  ];
  const link = ApolloLink.split(
    ({ query }) => { const d = getMainDefinition(query); return d.kind === 'OperationDefinition' && d.operation === 'subscription'; },
    subscriptionLink,
    new MockLink(mocks, false),
  );
  const client = new ApolloClient({ link, cache: new InMemoryCache({ addTypename: false }) });
  render(<ApolloProvider client={client}><Editor /></ApolloProvider>);
  return { subscriptionLink };
}

test('clearing the editor after the server echoed our text keeps it empty', async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  const user = userEvent.setup();
  const { subscriptionLink } = renderEditor();
  const box = await screen.findByLabelText('Code editor');

  await user.type(box, 'hi');
  expect(box).toHaveValue('hi');

  // Server echoes the last sent body back to every subscriber (including us).
  await act(async () => {
    subscriptionLink.simulateResult({ result: { data: { typingCode: { body: 'hi' } } } });
  });
  // Wait out the client's 800 ms "typing" window so the echo path is quiet.
  await new Promise((r) => setTimeout(r, 900));
  expect(box).toHaveValue('hi');

  await user.clear(box);
  expect(box).toHaveValue('');
  // The bug reappears asynchronously (effect on localCode === '').
  await new Promise((r) => setTimeout(r, 50));
  await waitFor(() => expect(box).toHaveValue(''));
  await new Promise((r) => setTimeout(r, 900));
  expect(box).toHaveValue('');
});
