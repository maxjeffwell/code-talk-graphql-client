import React from 'react';

import { ScaleLoader } from 'react-spinners';

const Spinner = () => (
	<div className="spinner">
		<ScaleLoader color={'#30d403'} height={100} margin={'20 px'} width={25} radius={100} />
	</div>
);

export default Spinner;
