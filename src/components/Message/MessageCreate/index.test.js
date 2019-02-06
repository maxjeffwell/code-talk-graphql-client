import React from 'react';
import { shallow } from 'enzyme';
import MessageCreate from './index';

describe('<MessageCreate />', () => {
  it('Should render without crashing', () => {
    shallow(<MessageCreate />);
  });
});
