import { useNavigate } from 'react-router-dom';

import { Button, Card } from 'antd';
const Cert = () => {
	const nav = useNavigate();
	return (
		<Card title="证书管理">
			<Button type="primary" onClick={() => nav('/nginx-management/applycert')}>
				申请证书
			</Button>
		</Card>
	);
};
export default Cert;
