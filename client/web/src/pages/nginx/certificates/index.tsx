
import { useState, useRef } from "react"
import { CSVLink } from 'react-csv';
import {
    Button,
    Space,
    Card,
    message,
    Tag,
    Dropdown,
    type MenuProps
} from 'antd';

import { useRequest } from "ahooks"
import dayjs from "dayjs";


import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from "@ant-design/pro-components"
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';


import { EllipsisText } from "@/components";
import Drawer from './components/drawer'
import { account, deleteAcmeAccount, getAccount, verifyDnsChallenge } from "@/api"
import type { AccoutItem, AccoutList, Identifier, Order } from "@/type"
import { useKeyZipDownloader } from "@/hooks/useKeyZipDownloader";

export type DrawerType = 'add' | 'edit' | 'pending'
export type DnsInfo = Identifier & { status: string }

export const statusMap: { [key: string]: { text: string, color: string } } = {
    pending: { text: '待验证', color: 'orange' },
    valid: { text: '有效', color: 'green' },
    invalid: { text: '无效', color: 'red' },
}

const Page = () => {
    const [list, setList] = useState<AccoutList>()
    const [open, setOpen] = useState(false)
    const [drawerType, setDrawerType] = useState<DrawerType>('add')
    const [activeData, setActiveData] = useState<DnsInfo | null>(null)
    const downloadZip = useKeyZipDownloader();
    const tableRef = useRef<ActionType>();
    // create
    const { run: runAccout, loading } = useRequest((data) => account(data), {
        manual: true,
        onSuccess: ({ status, message: msg }) => {
            if (status === 200) {
                message.success('订单创建接口成功，请完成http验证')
                setOpen(false)
            } else {
                message.error(`${msg}`)
            }
            tableRef.current?.reload();
        }
    });
    // delete 
    const { run: deleteAccount, loading: deleteLoading } = useRequest((id) => deleteAcmeAccount(id), {
        manual: true,
        onSuccess: ({ status, message: msg }) => {
            if (status === 200) {
                message.success('订单删除成功')
                setOpen(false)
            } else {
                message.error(`${msg}`)
            }
            tableRef.current?.reload();
        }
    })
    const { run: runDns, cancel, loading: chanllengeLoading } = useRequest((id) => verifyDnsChallenge<{ status: string }>(id), {
        manual: true,
        pollingInterval: 2000,
        onSuccess: ({ data, status, message: msg }) => {
            if (status === 200) {
                if (data.status === 'success') {
                    cancel()
                }
            } else {
                message.error(`${msg}`)
            }
        }
    })
    const updateDrawerType = (type: DrawerType) => setDrawerType(type)

    const updateActiveData = (data: DnsInfo) => setActiveData(data)

    const toCheckValidity = (item: AccoutItem) => {
        updateDrawerType('pending')
        setOpen(true)
        const identifiers = item.orders[0].identifiers[0] || null;
        updateActiveData({ ...identifiers, status: item.orders[0].status })
        runDns(item.orders[0].id)
    }


    const onClick = (item: AccoutItem, key: string) => {

        switch (key) {
            case '1':
                deleteAccount(item.id)
                break;
            case '2':
                toCheckValidity(item)
                return
            case '3':
                if (item.orders[0].identifiers[0].privateKey && item.orders[0].identifiers[0].certificate) {
                    downloadZip({
                        filename: item.domain,
                        privateKey: item.orders[0].identifiers[0].privateKey,
                        certificate: item.orders[0].identifiers[0].certificate,
                    })
                } else {
                    message.error('下载证书出错了')
                }
                return
        }
    }
    const closeCallback = () => {
        cancel()
    }

    const toolBarRender = () => {
        return (
            <Space>
                <Button onClick={() => {
                    updateDrawerType('add')
                    setOpen(true)
                }}>申请证书</Button>
                <CSVLink data={list || []}>
                    <Button type="primary">
                        导出数据 <DownOutlined />
                    </Button>
                </CSVLink>
            </Space>
        );
    };

    const columns: ProColumns<AccoutItem>[] = [
        {
            title: '域名',
            dataIndex: 'domain',
            width: 130,
            render: (_) => <EllipsisText text={_ as string}>{_}</EllipsisText>
        },
        {
            title: '状态',
            dataIndex: 'orders',
            width: 100,
            render: (orders) => {
                const status = (orders as Order[]).length > 0 ? (orders as Order[])[0].status : 'invalid';
                const tag = statusMap[status] || { text: '未知', color: 'gray' };
                return <Tag color={tag.color}>{tag.text}</Tag>;
            },
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            width: 130,
            render: (_) => <EllipsisText text={_ as string}>{_}</EllipsisText>
        },
        {
            title: '订单结束时间',
            dataIndex: 'orders',
            key: 'expires',
            width: 150,
            render: (orders) => {
                const expires = (orders as Order[]).length > 0 ? (orders as Order[])[0].expires : null;
                return expires ? dayjs(expires).format('YYYY-MM-DD HH:mm:ss') : '-';
            },
        },
        {
            title: '证书颁发机构',
            dataIndex: 'certificateAuthority',
            key: 'certificateAuthority',
            width: 150,
        },
        {
            title: '操作',
            key: 'action',
            width: 100,
            render: (_, item) => {
                const items: MenuProps['items'] = [
                    {
                        key: '1',
                        label: <div>删除</div>
                    },
                    ...(item.orders.length > 0 && item.orders[0].status === 'pending' ? [
                        {
                            key: '2',
                            label: <div>验证</div>
                        }
                    ] : []),
                    ...(item.orders.length > 0 && item.orders[0].status === 'valid' ? [
                        {
                            key: '3',
                            label: <div>下载证书</div>
                        }
                    ] : [])
                ];
                return (
                    <Dropdown menu={{ items, onClick: ({ key }) => onClick(item, key) }} placement="bottom" arrow>
                        <EllipsisOutlined className="text-3xl cursor-pointer" />
                    </Dropdown>
                );
            },
        }
    ]
    return (
        <Card>
            <Drawer options={{ open, setOpen, type: drawerType, closeCallback, loading, run: runAccout, data: activeData }} />
            <ProTable
                actionRef={tableRef}
                request={async () => {
                    let { data, status } = await getAccount<
                        AccoutItem[]
                    >();
                    if (status !== 200) {
                        data = []
                    }
                    setList(data);
                    return {
                        total: data.length,
                        data,
                        success: true
                    };
                }}
                headerTitle="订单中心"
                search={false}
                columns={columns}
                scroll={{ x: 1300, y: 'calc(100vh - 400px)' }}
                toolBarRender={toolBarRender as any}
                rowKey={'key'}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: false
                }}
                loading={deleteLoading || loading || chanllengeLoading} />
        </Card>
    )
}
export default Page