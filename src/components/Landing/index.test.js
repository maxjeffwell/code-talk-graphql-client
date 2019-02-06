import React from 'react';
import { shallow } from 'enzyme';
import Landing from './index';

describe('<Landing />', () => {
  it('Should render without crashing', () => {
    shallow(<Landing />);
  });
});
