import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LeftOutlined } from '@ant-design/icons';
import {
	ProColumns,
	ProForm,
	ProFormInstance,
	ProFormText,
	ProTable
} from '@ant-design/pro-components';
import { Card } from 'antd';

import { Copy as CopyToClipboard } from '@/components';
import { CertificateMonitoring } from '@/type';
import { certificateConfig } from '@/utils';

const { Meta } = Card;
const applyCert = () => {
	const nav = useNavigate();
	const formRef = useRef<ProFormInstance>();
	const [config, setConfig] = useState({
		certificateAuthority: 0,
		encryptionType: 0
	});
	const onPressEnter = async () => {
		const values = await formRef.current?.validateFields(['domain']);
		console.log(values);
	};
	const dataSource = [
		{
			domain: 'bb.aixdb.cn',
			type: 'CNAME',
			digHost: '_acme-challenge.bb.aixdb.cn',
			host: '_acme-challenge.bb',
			hostValue: 'dcffa2d3c30bf42b.bb.httpsok.com',
			costTime: 48,
			dnsServer: null,
			valid: false,
			recordList: null,
			ns: {
				name: '阿里云',
				host: 'dns11.hichina.com',
				site: 'https://dns.console.aliyun.com/'
			}
		}
	];
	const columns: ProColumns<CertificateMonitoring>[] = [
		{
			title: '状态',
			dataIndex: 'valid',
			tooltip: '正确配置DNS解析后，域名验证会自动通过',
			width: 160,
			render: (_) => <div className="truncate ...">{_}</div>
		},
		{
			title: '服务商',
			dataIndex: 'ns',
			render: (_) => <span>{_.name}</span>
		},
		{
			title: '主机记录',
			dataIndex: 'host',
			render: (_) => <CopyToClipboard text={_ as string} />
		},
		{
			title: '记录类型',
			dataIndex: 'type',
			render: (_) => <span className="text-red-600 font-bold">{_}</span>
		},
		{
			title: '记录值',
			dataIndex: 'hostValue',
			render: (_) => <CopyToClipboard text={_ as string} />
		}
	];
	const CardHeader = (
		<div
			className="flex items-center gap-2 w-fit cursor-pointer"
			onClick={() => nav(-1)}
		>
			<LeftOutlined className="mt-[1px]" />
			<div>证书申请 </div>
		</div>
	);
	return (
		<Card title={CardHeader}>
			<ProForm
				formRef={formRef}
				layout="horizontal"
				{...{
					labelCol: { span: 3 },
					wrapperCol: { span: 21 }
				}}
				submitter={false}
			>
				<ProFormText
					width="lg"
					name="domain"
					label="域名"
					tooltip="输入域名后回车，推荐通配符域名（示例：*.aixdb.cn）"
					rules={[
						{ required: true, message: '请输入域名' },
						{
							pattern:
								/^(?:\*\.)?(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63})$/,
							message: '请输入正确的域名'
						}
					]}
					fieldProps={{ onPressEnter }}
				/>

				<ProForm.Item
					name="sliderValue"
					label="域名验证"
					tooltip={
						<div>
							请配置以下DNS解析记录
							<span className="text-red-600">(配置成功后，请勿删除记录)</span>
						</div>
					}
					rules={[{ required: true, message: '请配置以下DNS解析记录' }]}
				>
					<ProTable
						columns={columns}
						search={false}
						options={false}
						dataSource={dataSource}
						pagination={false}
						scroll={{ x: '1000px' }}
					/>
				</ProForm.Item>
				<ProForm.Item
					name="sliderValue"
					label="证书厂商"
					rules={[{ required: true, message: '请选择证书厂商' }]}
				>
					<div className="flex items-center gap-4">
						{certificateConfig.supportedVendors.map((item, index) => (
							<Card
								hoverable
								cover={
									<img
										alt={item.name}
										src={item.logo}
										className="h-8 !w-auto m-auto mt-2"
									/>
								}
								key={index}
								className={`${
									config.certificateAuthority === index
										? 'border-1 border-solid border-amber-900!'
										: ''
								} cursor-pointer`}
								onClick={() =>
									setConfig({ ...config, certificateAuthority: index })
								}
							>
								<Meta title={item.name} description={item.description} />
							</Card>
						))}
					</div>
				</ProForm.Item>
				<ProForm.Item
					name="encryption"
					label="加密算法"
					rules={[{ required: true, message: '请选择加密算法' }]}
				>
					<div className="flex gap-2 items-center">
						{certificateConfig.supportedEncryptionTypes.map((item, index) => (
							<Card
								key={item}
								className={`${
									config.encryptionType === index ? 'border-amber-900!' : ''
								} cursor-pointer`}
								styles={{ body: { padding: '7px 24px' } }}
								onClick={() => setConfig({ ...config, encryptionType: index })}
							>
								{item}
							</Card>
						))}
					</div>
				</ProForm.Item>
			</ProForm>
		</Card>
	);
};
export default applyCert;
