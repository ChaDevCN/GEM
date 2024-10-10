import { useState, useRef } from 'react';
import { CSVLink } from 'react-csv';

import { DownOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Card, Space, message } from 'antd';

import Drawer from './components/drawer';

import type { ActionType, ProColumns } from '@ant-design/pro-components';

import { createCertificateRenewal } from '@/api';

const Page = () => {
	const [list, setList] = useState();
	const [open, setOpen] = useState(false);
	const [drawerType, setDrawerType] = useState<'add' | 'look'>('add');
	const tableRef = useRef<ActionType>();
	const { run, loading } = useRequest(createCertificateRenewal, {
		manual: true,
		onSuccess: ({ status, message: msg }) => {
			if (status === 200) {
				message.success('自动续订任务创建成功');
				setOpen(false);
			} else {
				message.error(`${msg}`);
			}
			tableRef.current?.reload();
		}
	});

	const toolBarRender = () => (
		<Space>
			<Button
				onClick={() => {
					setDrawerType('add');
					setOpen(!open);
				}}
			>
				新建自动续订任务
			</Button>
			<CSVLink data={list || []}>
				<Button type="primary">
					导出数据 <DownOutlined />
				</Button>
			</CSVLink>
		</Space>
	);

	return (
		<Card>
			<ProTable
				headerTitle={`证书续订(仅支持http-01验证)`}
				search={false}
				toolBarRender={toolBarRender as any}
				actionRef={tableRef}
			></ProTable>
			<Drawer options={{ open, setOpen, type: drawerType, run, loading }} />
		</Card>
	);
};
export default Page;
