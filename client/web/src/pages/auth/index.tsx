import { Tabs, Spin } from "antd"
import { useRequest } from "ahooks"
import User from "./components/User";
import Role from "./components/Role";
import type { TabsProps } from 'antd'
import { getUserList } from "@/api";
import { Userlist } from "@/type";

const Auth = () => {
    const { loading } = useRequest(getUserList<Userlist>, {
        onSuccess: ({ }) => {

        }
    })
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '用户中心',
            children: <User />,
        },
        {
            key: '2',
            label: '角色设置',
            children: <Role />,
        },
    ];
    const onChange = (key: string) => {
        console.log(key);
    };
    return <Spin spinning={loading}><Tabs defaultActiveKey="1" items={items} onChange={onChange} /></Spin>
}
export default Auth