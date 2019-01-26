import React from 'react';
import styled from 'styled-components';

import { MessageCreate, Messages } from '../Message';

const StyledSidebar = styled.div`
    width: 50%;
    height: 50%;
    position: sticky;
    display: grid;
    background: ${props => props.theme.white};
    color: ${props => props.theme.black};
    input {
      padding: 10px;
      margin: auto;
      width: 75%;
    }
    button {
      cursor: pointer;
      font-size: 1em;
      margin: 5px 5px 5px;
      padding: .25em 1em;
      color: ${props => props.theme.green};
      background: ${props => props.theme.black}; 
      border: 5px solid ${props => props.theme.green};
    }
`;

export const Sidebar = () =>
   <StyledSidebar>
     <MessageCreate />
     <Messages limit={10}/>
   </StyledSidebar>;


