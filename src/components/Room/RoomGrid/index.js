import React from 'react';

import MessageContainer from '../../MessageContainer';
import DebouncedEditor from '../../Editor';
// import Snippet from '../../Snippet';
// import { StyledButton } from '../../Message/Messages';

import * as Grid from '../../Grid';

const Row = Grid.Row;
const Col = Grid.Column;

const GridSystem = () => (
  <Row>
    <Col colspan="1">
      <MessageContainer />
    </Col>
    <Col colspan="2" last>
      <DebouncedEditor />
    </Col>
  </Row>
);

export default GridSystem;










