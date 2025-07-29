import React, { memo } from 'react';
import { Link } from 'react-router-dom';

import CodeTalk_Title_Logo from '../Images/Logo/CodeTalk_Title_Logo.png';
import styled from 'styled-components';
import LazyImage from '../LazyImage';
import { breakpoint } from '../Variables';

const StyledHeader = styled.header`
  margin-top: 10px;
  
  @media (min-width: ${breakpoint.tablet}) {
    margin-top: 15px;
  }
  
  @media (min-width: ${breakpoint.laptop}) {
    margin-top: 20px;
  }
  
  @media (min-width: ${breakpoint.laptopL}) {
    margin-top: 25px;
  }
  
  @media (min-width: ${breakpoint.desktop}) {
    margin-top: 30px;
  }

  .bar {
    display: flex;
    height: 150px;
    grid-template-columns: auto 1fr;
    justify-content: space-evenly;
    align-items: stretch;
    }  
  
  .logo-container {
    display: flex;
    margin: auto;
    max-width: 50%;
    max-height: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Header = memo(() => {
  return (
    <StyledHeader>
      <div className="bar">
        <Link to="/" className="home" role="button">
          <LazyImage 
            src={CodeTalk_Title_Logo} 
            alt="Code Talk Logo"
            className="logo-container"
            placeholder="Loading logo..."
          />
        </Link>
      </div>
    </StyledHeader>
  );
});

Header.displayName = 'Header';

export default Header;


