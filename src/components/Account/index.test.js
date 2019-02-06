import React from 'react';
import { shallow } from 'enzyme';
import AccountPage from './index';

describe('<AccountPage />', () => {
  it('Should render without crashing', () => {
    shallow(<AccountPage />);
  });
});
