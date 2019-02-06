import React from 'react';
import { shallow } from 'enzyme';
import SignInPage from './index';

describe('<SignInPage />', () => {
  it('Should render without crashing', () => {
    shallow(<SignInPage />);
  });
});
