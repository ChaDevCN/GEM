import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';

import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import {
	Button,
	Dropdown,
	Space,
	Tag,
	Progress,
	Tooltip,
	Modal,
	Form,
	Input,
	message
} from 'antd';
import { type MenuProps } from 'antd';
import dayjs from 'dayjs';

import type { ActionType, ProColumns } from '@ant-design/pro-components';

import {
	addCertificateMonitoring,
	getCertificateMonitoringList,
	updataTime,
	deleteCertificateMonitoring
} from '@/api';
import { EllipsisText } from '@/components';
import { CertificateMonitoring } from '@/type';

const { TextArea } = Input;

const statusColors = {
	valid: 'success',
	expired: 'error',
	expiring_soon: 'warning',
	invalid: 'error',
	unknown: 'default'
};
const Page = () => {
	const [list, setList] = useState<CertificateMonitoring[] | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const tableRef = useRef<ActionType>();
	const { run, loading } = useRequest(
		(data) => addCertificateMonitoring(data),
		{
			manual: true,
			onSuccess: ({ status }) => {
				if (status !== 200) {
					message.error('服务器忙，稍后再试');
				} else {
					message.success('添加成功..');
					setIsModalOpen(false);
				}
				setIsModalOpen(false);
				tableRef.current?.reload();
			}
		}
	);
	const { run: runUpdateTime, loading: updataTimeLoading } = useRequest(
		(id) => updataTime(id),
		{
			manual: true,
			onSuccess: ({ status, ...res }) => {
				console.log(res);

				if (status !== 200) {
					message.error('服务器忙，稍后再试');
				} else {
					message.success('刷新成功');
				}
				tableRef.current?.reload();
			}
		}
	);
	const { run: deleteMonitoring, loading: deleteMonitoringLoading } =
		useRequest((id) => deleteCertificateMonitoring(id), {
			manual: true,
			onSuccess: ({ status }) => {
				if (status !== 200) {
					message.error('服务器忙，稍后再试');
				} else {
					message.success('删除成功');
				}
				tableRef.current?.reload();
			}
		});
	const items: MenuProps['items'] = [
		{
			key: '1',
			label: <div>检测</div>
		},
		{
			key: '2',
			label: <div>编辑</div>,
			disabled: true
		},
		{
			key: '3',
			label: <div>删除</div>
		}
	];
	const onClick = (key: string, id: number) => {
		switch (key) {
			case '1':
				runUpdateTime(id);
				break;
			case '3':
				console.log('deleteCertificateMonitoring');
				deleteMonitoring(id);
				break;
		}
	};
	const columns: ProColumns<CertificateMonitoring>[] = [
		{
			title: '域名',
			dataIndex: 'hostname',
			width: 160,
			fixed: 'left',
			render: (_) => (
				<EllipsisText text={_ as string}>
					<div className="truncate ...">{_}</div>
				</EllipsisText>
			)
		},
		{
			title: '状态',
			dataIndex: 'status',
			width: 100,
			render: (status) => (
				<Tag color={statusColors[status as keyof typeof statusColors]}>
					{status}
				</Tag>
			),
			filters: [
				{ text: '全部', value: 'all' },
				{ text: '有效', value: 'valid' },
				{ text: '过期', value: 'expired' },
				{ text: '即将过期', value: 'expiring_soon' },
				{ text: '无效', value: 'invalid' },
				{ text: '未知', value: 'unknown' }
			],
			onFilter: (value, record) =>
				value === 'all' ? true : record.status === value,
			valueType: 'select',
			valueEnum: {
				valid: { text: '有效', status: 'Success' },
				expired: { text: '过期', status: 'Error' },
				expiring_soon: { text: '即将过期', status: 'Warning' },
				invalid: { text: '无效', status: 'Error' },
				unknown: { text: '未知', status: 'Default' }
			}
		},
		{
			title: '过期时间',
			dataIndex: 'validTo',
			render: (time) => (
				<EllipsisText
					text={dayjs(time as string).format('YYYY-MM-DD HH:mm:ss')}
				>
					<div className="truncate ...">
						{dayjs(time as string).format(' YYYY-MM-DD')}
					</div>
				</EllipsisText>
			),
			width: 120,
			sorter: (a, b) => dayjs(a.validTo).diff(dayjs(b.validTo))
		},
		{
			title: '有效期',
			dataIndex: 'daysUntilExpiry',
			sorter: (a, b) => a.daysUntilExpiry - b.daysUntilExpiry,
			render: (_, { validFrom, validTo }) => {
				const startDate = dayjs(validFrom);
				const endDate = dayjs(validTo);
				const today = dayjs();

				const totalDuration = endDate.diff(startDate, 'day');
				const daysUntilExpiry = endDate.diff(today, 'day');

				const progressPercent =
					totalDuration === 0 ? 100 : (daysUntilExpiry / totalDuration) * 100;
				const progressStatus =
					daysUntilExpiry <= 0
						? 'exception'
						: progressPercent < 100
							? 'active'
							: 'success';

				return (
					<Tooltip title={`剩余${daysUntilExpiry} 天`}>
						<Progress
							percent={Math.round(progressPercent)}
							format={() => `${daysUntilExpiry}/${totalDuration}`}
							status={progressStatus}
						/>
					</Tooltip>
				);
			},
			width: 200
		},
		{
			title: 'IP类型',
			dataIndex: 'ipType',
			render: (type) => <Tag color="green">{type}</Tag>,
			width: 100
		},
		{
			title: 'IP地址',
			dataIndex: 'ipAddress',
			width: 120,
			render: (_) => (
				<EllipsisText text={_ as string}>
					<div className="truncate ...">{_}</div>
				</EllipsisText>
			)
		},
		{
			title: '颁发者',
			dataIndex: 'issuer',
			width: 100,
			render: (_) => (
				<EllipsisText text={_ as string}>
					<div className="truncate ...">{_}</div>
				</EllipsisText>
			)
		},
		{
			title: '最后检查时间',
			dataIndex: 'lastChecked',
			render: (time) => (
				<EllipsisText
					text={dayjs(time as string).format('YYYY-MM-DD HH:mm:ss')}
				>
					<div className="truncate ...">
						{dayjs(time as string).format('YYYY-MM-DD HH:mm:ss')}
					</div>
				</EllipsisText>
			),
			width: 170,
			sorter: (a, b) => dayjs(a.lastChecked).diff(dayjs(b.lastChecked))
		},
		{
			title: '备注',
			dataIndex: 'notes',
			width: '130',
			render: (_) => (
				<EllipsisText text={_ as string}>
					<div className="truncate ...">{_}</div>
				</EllipsisText>
			)
		},
		{
			title: '操作',
			dataIndex: 'id',
			render: (id) => (
				<Dropdown
					menu={{ items, onClick: (info) => onClick(info.key, id as number) }}
					destroyPopupOnHide
				>
					<EllipsisOutlined className="text-3xl cursor-pointer" />
				</Dropdown>
			),
			width: 70
		}
	];
	const toolBarRender = () => {
		return (
			<Space>
				<Button onClick={() => setIsModalOpen(true)}>新增</Button>
				<CSVLink data={list || []}>
					<Button type="primary">
						导出数据 <DownOutlined />
					</Button>
				</CSVLink>
			</Space>
		);
	};

	return (
		<div>
			<ProTable
				actionRef={tableRef}
				request={async () => {
					const res =
						await getCertificateMonitoringList<CertificateMonitoring[]>();
					let { data } = res;
					const { status } = res;
					if (status !== 200) {
						data = [];
					}
					setList(data);
					return {
						total: data.length,
						data,
						success: true
					};
				}}
				headerTitle="证书监控"
				columns={columns}
				search={false}
				scroll={{ x: 1300, y: 'calc(100vh - 342px)' }}
				toolBarRender={toolBarRender as any}
				rowKey={'key'}
				pagination={{
					pageSize: 10,
					showSizeChanger: false
				}}
				loading={updataTimeLoading || deleteMonitoringLoading}
			/>
			<Modal
				open={isModalOpen}
				footer={null}
				onCancel={() => setIsModalOpen(false)}
				title="新增证书监控"
				destroyOnClose
			>
				<Form
					className="max-w-9/10 mx-auto mt-5"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					onFinish={run}
					disabled={loading}
				>
					<Form.Item
						label="主机域名"
						name="domain"
						rules={[
							{
								required: true,
								message: '域名不能为空'
							},
							{
								pattern:
									/^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63})$/,
								message: '域名不合法'
							}
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item label="备注" name="notes">
						<TextArea />
					</Form.Item>
					<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit">
							提交
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};
export default Page;
