import React, { Fragment, useEffect, useRef } from 'react';
import debounce from "lodash/debounce";
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';

import ErrorMessage from '../Error';
import Loading from '../Loading';

export const TYPE_CODE_MUTATION = gql`
    mutation typeCodeMutation ($body: String!){
        typeCode(code: {body: $body}) {
            body
        }
    }
`;

export const READ_CODE_QUERY = gql`
  query readCodeQuery {
    readCode {
      body
    }
  }
`;

export const TYPING_CODE_SUBSCRIPTION = gql`
    subscription typingCodeSubscription {
        typingCode {
            body
        }
    }
`;

const StyledTextarea = styled(TextareaAutosize)`
  font-size: ${({ theme }) => theme.textarea.fontSize};
  border: ${({ theme }) => theme.textarea.border};
  background-color: ${({ theme }) => theme.textarea.backgroundColor};
  color: ${({ theme}) => theme.textarea.color};
  resize: none;
  box-sizing: border-box;
  width: 100%;
  margin-right: 50px;
  margin-left: 10px;
  padding: 10px 10px 10px 10px;
`;

const Editor = ({ roomId }) => {
  // TODO: Implement room-based code editing when backend supports it
  const { loading, error, data, subscribeToMore } = useQuery(READ_CODE_QUERY);
  const [typeCodeMutation] = useMutation(TYPE_CODE_MUTATION);

  const debouncedFnRef = useRef(null);

  // Create debounced function only once
  useEffect(() => {
    debouncedFnRef.current = debounce((newCode) => {
      typeCodeMutation({ variables: { body: newCode } });
    }, 200);

    return () => {
      if (debouncedFnRef.current) {
        debouncedFnRef.current.cancel();
      }
    };
  }, [typeCodeMutation]);

  const updateCode = (e) => {
    const newCode = e.currentTarget.value;
    if (debouncedFnRef.current) {
      debouncedFnRef.current(newCode);
    }
  };

  useEffect(() => {
    if (subscribeToMore) {
      const unsubscribe = subscribeToMore({
        document: TYPING_CODE_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          return Object.assign({}, prev, {
            readCode: subscriptionData.data.typingCode
          });
        }
      });
      return unsubscribe;
    }
  }, [subscribeToMore]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Fragment>
      <label>
        <StyledTextarea 
          theme={{
            textarea: {
              fontSize: '1.2em',
              border: '5px solid #30d403',
              backgroundColor: '#393939',
              color: '#30d403',
            }
          }} 
          aria-label="textarea"
          value={data.readCode.body}
          placeholder="Collaborate on code here ..."
          onChange={updateCode}
          rows={50}
        />
      </label>
    </Fragment>
  );
};

export default Editor;
