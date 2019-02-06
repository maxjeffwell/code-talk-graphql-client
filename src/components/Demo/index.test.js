import React from 'react';
import { shallow } from 'enzyme';
import Demo from './index';

describe('<Demo />', () => {
  it('Should render without crashing', () => {
    shallow(<Demo />);
  });
});
