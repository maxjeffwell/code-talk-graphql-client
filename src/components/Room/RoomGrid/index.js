import React from 'react';

import MessageContainer from '../../MessageContainer';
import Editor from '../../Editor';

import * as Grid from '../../Grid';

const Row = Grid.Row;
const Col = Grid.Column;

const GridSystem = () => (
  <Row>
    <Col colspan="1">
      <MessageContainer />
    </Col>
    <Col colspan="2" last>
      <Editor />
    </Col>
  </Row>
);

export default GridSystem;










