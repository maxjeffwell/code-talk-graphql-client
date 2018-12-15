import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import CodeTalk_Title_Logo from '../Images/Logo/CodeTalk_Title_Logo.png';
import styled from 'styled-components';

const StyledHeader = styled.header`
  .bar {
    display: grid;
    height: 140px;
    grid-template-columns: auto 1fr;
    border-bottom: 1px solid ${props => props.theme.black};
    justify-content: space-between;
    align-items: stretch;
    }  
  img {
    display: block;
    margin: auto;
    width: 50%;
    height: 200px;
    }
`;

class Header extends Component {
  render () {
    return (
      <StyledHeader>
        <div className="bar">
          <Link to="/">
            <img src={CodeTalk_Title_Logo} alt="Code Talk"/>
          </Link>
        </div>
      </StyledHeader>
  );
  }
};

export default Header;


