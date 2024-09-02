
import { useState, useRef } from "react"
import { CSVLink } from 'react-csv';
import {
    Button,
    Space,
    Card,
    message,
    Tag
} from 'antd';

import { useRequest } from "ahooks"
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from "@ant-design/pro-components"
import { DownOutlined } from '@ant-design/icons';
import { EllipsisText } from "@/components";
import Drawer from './components/drawer'
import { account, getAccount } from "@/api"
import { AccoutItem, AccoutList, Order } from "@/type"
import dayjs from "dayjs";
const Page = () => {
    const [list, setList] = useState<AccoutList>()
    const [open, setOpen] = useState(false)
    const [drawerType, setDrawerType] = useState<'add' | 'edit'>('add')

    const tableRef = useRef<ActionType>();

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
    })
    const statusMap: { [key: string]: { text: string, color: string } } = {
        pending: { text: '待验证', color: 'orange' },
        valid: { text: '有效', color: 'green' },
        invalid: { text: '无效', color: 'red' },
    };
    const toolBarRender = () => {
        return (
            <Space>
                <Button onClick={() => setOpen(!open)}>申请证书</Button>
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
            title: '到期时间',
            dataIndex: 'orders',
            key: 'expires',
            width: 150,
            render: (orders) => {
                const expires = (orders as Order[]).length > 0 ? (orders as Order[])[0].expires : null;
                return expires ? dayjs(expires).format('YYYY-MM-DD HH:mm:ss') : '无到期时间';
            },
        },
        {
            title: '证书颁发机构',
            dataIndex: 'certificateAuthority',
            key: 'certificateAuthority',
            width: 150,
        },
    ]
    return (
        <Card>
            <Drawer options={{ open, setOpen, type: drawerType, loading, run: runAccout }} />
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
                headerTitle="证书管理"
                search={false}
                columns={columns}
                scroll={{ x: 1300, y: 'calc(100vh - 342px)' }}
                toolBarRender={toolBarRender as any}
                rowKey={'key'}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: false
                }} />
        </Card>
    )
}
export default Page