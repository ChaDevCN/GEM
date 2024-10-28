import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Result } from 'antd';

const Index: React.FC = () => {
	const nav = useNavigate();
	return (
		<Result
			status="404"
			title="404"
			subTitle="该功能暂未开放"
			extra={
				<Button type="primary" onClick={() => nav('/')}>
					Back Home
				</Button>
			}
		/>
	);
};

export default Index;
