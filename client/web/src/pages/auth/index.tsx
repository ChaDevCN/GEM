import { Tabs } from "antd"
import { ProTable } from '@ant-design/pro-components';
import type { TabsProps } from 'antd'
import { getUserList } from "@/api";
import { Userlist } from "@/type";
import React from "react";
type Length = 1 | 2
const Auth = () => {
    const getData = (length: Length) => [getUserList,]
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '用户中心',
        },
        {
            key: '2',
            label: '角色设置',
        },
    ];
    const onChange = (key: string) => {
        console.log(key);
    };
    return (
        <React.Fragment>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            <ProTable request={
                async () => {
                    let { status, data } = await getUserList<Userlist>()
                    if (status === 200) {
                        data.items = []
                    }
                    return {
                        total: data.meta.totalCounts,
                        data: data.items,
                        success: true,

                    }
                }
            } />
        </React.Fragment>

    )
}
export default Auth