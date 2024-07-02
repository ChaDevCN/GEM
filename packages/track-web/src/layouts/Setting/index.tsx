import React from "react"
import {
    PieChartOutlined,
    UnorderedListOutlined,
    UserOutlined,
    SettingOutlined,
    LineChartOutlined,
    BellOutlined,
    FileOutlined,
    ToolOutlined,
    AlertOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu as AntMenu } from 'antd';
import { Layout } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];
const { Sider: AntSider } = Layout;
const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: '仪表板' },
    { key: '2', icon: <UnorderedListOutlined />, label: '事件记录' },
    { key: '3', icon: <UserOutlined />, label: '用户行为' },
    {
        key: 'sub1',
        icon: <ToolOutlined />,
        label: '埋点管理',
        children: [
            { key: '4', label: '配置埋点' },
            { key: '5', label: '可视化埋点' },
        ],
    },
    {
        key: 'sub2',
        icon: <AlertOutlined />,
        label: '错误监控',
        children: [
            { key: '6', label: '错误日志' },
            { key: '7', label: '错误告警' },
        ],
    },
    { key: '8', icon: <LineChartOutlined />, label: '性能监控' },
    {
        key: 'sub3',
        icon: <FileOutlined />,
        label: '报告',
        children: [
            { key: '9', label: '生成报告' },
            { key: '10', label: '自定义报告' },
        ],
    },
    { key: '11', icon: <BellOutlined />, label: '告警设置' },
    { key: '12', icon: <UserOutlined />, label: '用户管理' },
    { key: '13', icon: <SettingOutlined />, label: '设置' },
    { key: '14', icon: <QuestionCircleOutlined />, label: '帮助和文档' },
];
const Menu = ({ collapsed }: { collapsed: boolean }) => {
    return (
        <AntSider collapsed={collapsed} className="bg-white h-[100vh] overflow-auto fixed left-0 top-0 bottom-0" theme={'light'}>
            <div className="h-[60px] overflow-hidden text-xl flex justify-center items-center select-none">
                Logify
            </div>
            <AntMenu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="light"
                items={items}
            />
        </AntSider>
    )
}
export default React.memo(Menu)