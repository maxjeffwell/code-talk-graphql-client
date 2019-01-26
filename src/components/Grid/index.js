import styled from 'styled-components';
import * as style from '../Variables';

export const Row = styled.div`
  display: inline-block;
  width: 100%;
  
  @media (min-width: ${style.breakpoint.mobileS}) {
    display: flex;
  }
`;

export const Column = styled.div`
  display: inline-block;
  margin-bottom: auto;
  margin-right: 0;
  width: 100%;
  
  @media (min-width: ${style.breakpoint.mobileS}) {
    margin-right: ${(props) => props.last ? '0' : 'auto'};
    flex: ${(props) => props.colspan};
  }
`;
