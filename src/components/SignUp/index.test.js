import React from 'react';
import { shallow } from 'enzyme';
import SignUpPage from './index';

describe('<SignUpPage />', () => {
  it('Should render without crashing', () => {
    shallow(<SignUpPage />);
  });
});
