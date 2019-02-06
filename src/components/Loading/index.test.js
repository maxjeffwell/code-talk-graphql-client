import React from 'react';
import { shallow } from 'enzyme';
import Loading from './index';

describe('<Loading />', () => {
  it('Should render without crashing', () => {
    shallow(<Loading />);
  });
});
