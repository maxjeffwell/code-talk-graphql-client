import React, { Component } from 'react';

import withSession from '../Session/withSession';
import { MessageCreate, Messages } from '../Message';

import styled from 'styled-components';

const StyledSidebar = styled.div`
    width: 25%;
    height: 100%;
    position: sticky;
    display: flex;
    background: ${props => props.theme.white};
    color: ${props => props.theme.black};
`;

class Sidebar extends Component {

  render() {
    return (
      <StyledSidebar>
        {this.props.session && this.props.session.me && <MessageCreate />}
        <Messages me={this.props.session.me} limit={5}/>
      </StyledSidebar>
    );
  }
}

export default withSession(Sidebar);

