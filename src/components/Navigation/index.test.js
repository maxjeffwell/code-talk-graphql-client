import React from 'react';
import { shallow } from 'enzyme';
import Navigation from './index';

describe('<Navigation />', () => {
  it('Should render without crashing', () => {
    shallow(<Navigation />);
  });
});
