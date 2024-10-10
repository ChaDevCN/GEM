import React from 'react';

import {
	ProForm,
	ProFormGroup,
	ProFormText,
	ProFormDigit
} from '@ant-design/pro-components';
import { Drawer } from 'antd';

interface Props {
	options: {
		open: boolean;
		setOpen: React.Dispatch<React.SetStateAction<boolean>>;
		loading?: boolean;
		type: 'add' | 'look';
		run: (data: any) => void;
	};
}
const title = {
	add: '创建自动续订任务',
	look: '查看'
};
const Index = ({
	options: { open, setOpen, loading = false, type, run }
}: Props) => {
	return (
		<Drawer
			open={open}
			closable
			destroyOnClose
			onClose={() => setOpen(false)}
			title={title[type]}
		>
			{type === 'add' && (
				<ProForm onFinish={run} disabled={loading} loading={loading}>
					<ProFormGroup>
						<ProFormText
							width="md"
							name="domain"
							label="域名"
							tooltip="不支持通配符，域名必须通过http-01验证"
							rules={[
								{ required: true, message: '请输入域名' },
								{
									pattern:
										/^(?!.*[*])(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63})$/,
									message: '请输入正确的域名'
								}
							]}
						/>
						<ProFormText
							width="md"
							name="email"
							label="邮箱"
							rules={[
								{ required: true, message: '请输入邮箱' },
								{ type: 'email', message: '请输入正确的邮箱地址' }
							]}
						/>
						<ProFormDigit
							width="md"
							label="提前多少天续费"
							name="num"
							initialValue={10}
						/>
					</ProFormGroup>
				</ProForm>
			)}
		</Drawer>
	);
};
export default Index;
