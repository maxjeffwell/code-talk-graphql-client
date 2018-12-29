import React from 'react';
import styled from 'styled-components';

import { MessageCreate, Messages } from '../Message';

const StyledSidebar = styled.div`
    width: 30%;
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
      color: #30d403;
      background: #393939; 
      border: 1em;
    }
`;

export const Sidebar = () =>
   <StyledSidebar>
     <MessageCreate/>
     <Messages limit={100}/>
   </StyledSidebar>;


