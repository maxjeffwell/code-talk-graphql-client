import React from 'react';
import { shallow } from 'enzyme';
import SignOutButton from './index';

describe('<SignOutButton />', () => {
  it('Should render without crashing', () => {
    shallow(<SignOutButton />);
  });
});
