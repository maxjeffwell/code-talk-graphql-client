import React from 'react';
import { shallow } from 'enzyme';
import Editor from './index';

describe('<Editor />', () => {
  it('Should render without crashing', () => {
    shallow(<Editor />);
  });
});
