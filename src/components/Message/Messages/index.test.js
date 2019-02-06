import React from 'react';
import { shallow } from 'enzyme';
import Messages from './index';

describe('<Messages />', () => {
  it('Should render without crashing', () => {
    shallow(<Messages />);
  });
});
