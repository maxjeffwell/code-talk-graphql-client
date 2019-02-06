import React from 'react';
import { shallow } from 'enzyme';
import Users from './index';

describe('<Users />', () => {
  it('Should render without crashing', () => {
    shallow(<Users />);
  });
});
