import React from 'react';

import { Sidebar } from '../../Sidebar';
import Editor from '../../Editor';

import * as Grid from '../../Grid';

const Row = Grid.Row;
const Col = Grid.Column;

export default function GridSystem() {
  return (
    <Row>
      <Col colspan="1">
        <Sidebar />
      </Col>
      <Col colspan="2" last>
        <Editor />
      </Col>
    </Row>
  );
}









