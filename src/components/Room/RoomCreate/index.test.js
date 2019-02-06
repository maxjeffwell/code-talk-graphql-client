import React from 'react';
import { shallow } from 'enzyme';
import RoomCreate from './index';

describe('<RoomCreate />', () => {
  it('Should render without crashing', () => {
    shallow(<RoomCreate />);
  });
});
