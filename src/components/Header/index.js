import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import CodeTalk_Title_Logo from '../Images/Logo/CodeTalk_Title_Logo.png';
import styled from 'styled-components';

const StyledHeader = styled.header`
  .bar {
    display: flex;
    height: 150px;
    grid-template-columns: auto 1fr;
    justify-content: space-evenly;
    align-items: stretch;
    }  
  img {
    display: flex;
    margin: auto;
    max-width: 50%;
    max-height: 450px;
    }
`;

class Header extends Component {
  render () {
    return (
      <StyledHeader>
        <div className="bar">
          <Link to="/" className="home" role="button">
            <img src={CodeTalk_Title_Logo} alt="Code Talk"/>
          </Link>
        </div>
      </StyledHeader>
  );
  }
}

export default Header;


