import React from 'react';
import { shallow } from 'enzyme';
import MessageContainer  from './index';

describe('<MessageContainer />', () => {
  it('Should render without crashing', () => {
    shallow(<MessageContainer />);
  });
});
