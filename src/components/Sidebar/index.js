import React from 'react';
import styled from 'styled-components';

import { MessageCreate, Messages } from '../Message';

const StyledSidebar = styled.div`
    border: 3px solid ${props => props.theme.black}; 
    position: absolute;
    width: auto;
    height: auto;
    display: grid;
    background: ${props => props.theme.white};
    color: ${props => props.theme.black};
    input {
      padding: 5px;
      margin: auto;
      width: 100%;
    }
    button {
      cursor: pointer;
      font-size: 1em;
      margin: 5px 5px 5px;
      padding: .25em 1em;
      color: ${props => props.theme.green};
      background: ${props => props.theme.black}; 
      border: 5px solid ${props => props.theme.green};
      border-radius: 5px;
    }
`;

export const Sidebar = () =>
   <StyledSidebar>
     <MessageCreate />
     <Messages limit={10}/>
   </StyledSidebar>;


