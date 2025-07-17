import React, { Fragment, useEffect, useRef, useState } from 'react';
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
  min-height: 70vh;
  margin-right: 20px;
  margin-left: 10px;
  padding: 20px;
  line-height: 1.5;
`;

const Editor = ({ roomId }) => {
  // TODO: Implement room-based code editing when backend supports it
  const { loading, error, data, subscribeToMore } = useQuery(READ_CODE_QUERY);
  const [typeCodeMutation] = useMutation(TYPE_CODE_MUTATION);
  const [localCode, setLocalCode] = useState('');
  const lastLocalUpdateRef = useRef(0);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef(null);

  const debouncedFnRef = useRef(null);

  // Initialize local state when data loads
  useEffect(() => {
    if (data?.readCode?.body !== undefined && localCode === '') {
      setLocalCode(data.readCode.body);
    }
  }, [data, localCode]);

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
    
    // Mark as typing
    isTypingRef.current = true;
    lastLocalUpdateRef.current = Date.now();
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set local state immediately
    setLocalCode(newCode);
    
    // Send to server with debounce
    if (debouncedFnRef.current) {
      debouncedFnRef.current(newCode);
    }
    
    // Stop marking as typing after 1 second of no activity
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
    }, 1000);
  };

  useEffect(() => {
    if (subscribeToMore) {
      const unsubscribe = subscribeToMore({
        document: TYPING_CODE_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          
          // Only update if we're not actively typing
          if (!isTypingRef.current) {
            const newBody = subscriptionData.data.typingCode.body;
            // Additional check: only update if the content is actually different
            if (newBody !== localCode) {
              setLocalCode(newBody);
            }
          }
          
          return Object.assign({}, prev, {
            readCode: subscriptionData.data.typingCode
          });
        }
      });
      return unsubscribe;
    }
  }, [subscribeToMore, localCode]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  if (!data || !data.readCode) return <Loading />;

  return (
    <Fragment>
      <label htmlFor="code-editor">
        <StyledTextarea 
          id="code-editor"
          theme={{
            textarea: {
              fontSize: '1.4em',
              border: '5px solid #30d403',
              backgroundColor: '#393939',
              color: '#30d403',
            }
          }} 
          aria-label="Code editor"
          value={localCode}
          placeholder="Collaborate on code here ..."
          onChange={updateCode}
          rows={60}
          minRows={30}
        />
      </label>
    </Fragment>
  );
};

export default Editor;
