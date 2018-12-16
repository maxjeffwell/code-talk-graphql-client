import React, { Component } from 'react';

import withSession from '../Session/withSession';
import { MessageCreate, Messages } from '../Message';

import styled from 'styled-components';

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
      color: #30d403;
      background: #393939; 
      border: 1em;
    }
`;

class Sidebar extends Component {

  render() {
    return (
      <StyledSidebar>
        {this.props.session && this.props.session.me && <MessageCreate />}
        <Messages me={this.props.session.me} limit={7}/>
      </StyledSidebar>
    );
  }
}

export default withSession(Sidebar);

