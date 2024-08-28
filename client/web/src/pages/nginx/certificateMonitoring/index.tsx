import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
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
import dayjs from 'dayjs';

import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { type MenuProps } from 'antd';

import {
    addCertificateMonitoring,
    getCertificateMonitoringList,
    updataTime
} from '@/api';
import { AddCertificateMonitor, CertificateMonitoring } from '@/type';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';

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
    const { run } = useRequest((data) => addCertificateMonitoring(data), {
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
    });
    const { run: runUpdateTime } = useRequest((id) => updataTime(id), {
        manual: true,
        onSuccess: ({ status }) => {
            if (status !== 200) {
                message.error('服务器忙，稍后再试');
            } else {
                message.success('刷新成功');
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
            label: <div>编辑</div>
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
        }
    };
    const columns: ProColumns<CertificateMonitoring>[] = [
        {
            title: '域名',
            dataIndex: 'hostname',
            width: 160,
            fixed: 'left'
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (status) => (
                <Tag color={statusColors[status as keyof typeof statusColors]}>
                    {status}
                </Tag>
            )
        },
        {
            title: '过期时间',
            dataIndex: 'validTo',
            render: (time) => <div>{dayjs(time as string).format('YYYY-MM-DD')}</div>,
            width: 120
        },
        {
            title: '有效期',
            dataIndex: 'daysUntilExpiry',
            render: (_, { validFrom, validTo }) => {
                const startDate = dayjs(validFrom);
                const endDate = dayjs(validTo);
                const today = dayjs();

                const totalDuration = endDate.diff(startDate, 'day');
                const daysUntilExpiry = endDate.diff(today, 'day');

                const progressPercent = (daysUntilExpiry / totalDuration) * 100;
                return (
                    <Tooltip title={`剩余${daysUntilExpiry} 天`}>
                        <Progress
                            percent={Math.round(progressPercent)}
                            format={() => `${daysUntilExpiry}/${totalDuration}`}
                            status={progressPercent < 100 ? 'active' : 'exception'}
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
            width: 120
        },
        {
            title: '颁发者',
            dataIndex: 'issuer',
            width: 100
        },
        {
            title: '最后检查时间',
            dataIndex: 'lastChecked',
            render: (time) => (
                <div>{dayjs(time as string).format('YYYY-MM-DD HH:mm:ss')}</div>
            ),
            width: 170
        },
        {
            title: '备注',
            dataIndex: 'notes',
            render: (_) => _ || '-',
            width: '130'
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

    const submit = (value: AddCertificateMonitor) => run(value);
    return (
        <div>
            <ProTable
                actionRef={tableRef}
                request={async () => {
                    const { data } = await getCertificateMonitoringList<
                        CertificateMonitoring[]
                    >();
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
                scroll={{ x: 1300 }}
                toolBarRender={toolBarRender as any}
                rowKey={'key'}
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
                    onFinish={submit}
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
