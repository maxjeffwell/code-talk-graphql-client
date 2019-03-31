import React from 'react';

import MessageCreate from '../../Message/MessageCreate'
import Messages from '../../Message/Messages';
import DebouncedEditor from '../../Editor';
import Snippet from '../../Snippet';

import * as Grid from '../../Grid';

const Row = Grid.Row;
const Col = Grid.Column;

const GridSystem = () => (
  <Row>
    <Col colspan="1">
      <Snippet />
      <MessageCreate />
      <Messages limit={10} />
    </Col>
      <Col colspan="2" last>
      <DebouncedEditor />
    </Col>
  </Row>
);

export default GridSystem;










