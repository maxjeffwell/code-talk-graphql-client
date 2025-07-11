import React from 'react';

import MessageContainer from '../../MessageContainer';
import DebouncedEditor from '../../Editor';

import * as Grid from '../../Grid';

const Row = Grid.Row;
const Col = Grid.Column;

const GridSystem = ({ roomId }) => (
  <Row>
    <Col colspan="1">
      <MessageContainer roomId={roomId} />
    </Col>
    <Col colspan="2" last>
      <DebouncedEditor roomId={roomId} />
    </Col>
  </Row>
);

export default GridSystem;










