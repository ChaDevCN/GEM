import React from "react"
import { useNavigate  } from "react-router-dom"
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
    LockOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu as AntMenu } from 'antd';
import { Layout } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];
const { Sider: AntSider } = Layout;
const items: MenuItem[] = [
    { key: '/dashboard', icon: <PieChartOutlined />, label: '仪表板' },
    { key: '/event-logs', icon: <UnorderedListOutlined />, label: '事件记录' },
    { key: '/user-behavior', icon: <UserOutlined />, label: '用户行为' },
    {
        key: '/tracking-management',
        icon: <ToolOutlined />,
        label: '埋点管理',
        children: [
            { key: '/configure-tracking', label: '配置埋点' },
            { key: '/visual-tracking', label: '可视化埋点' },
        ],
    },
    {
        key: '/error-monitoring',
        icon: <AlertOutlined />,
        label: '错误监控',
        children: [
            { key: '/error-logs', label: '错误日志' },
            { key: '/error-alerts', label: '错误告警' },
        ],
    },
    { key: '/performance-monitoring', icon: <LineChartOutlined />, label: '性能监控' },
    {
        key: '/reporting',
        icon: <FileOutlined />,
        label: '报告',
        children: [
            { key: '/generate-reports', label: '生成报告' },
            { key: '/custom-reports', label: '自定义报告' },
        ],
    },
    { key: '/alert-settings', icon: <BellOutlined />, label: '告警设置' },
    { key: '/user-management', icon: <UserOutlined />, label: '用户管理' },
    { key: '/settings', icon: <SettingOutlined />, label: '设置' },
    { key: '/help-docs', icon: <QuestionCircleOutlined />, label: '帮助和文档' },
    { key: '/ssl-certificate-management', icon: <LockOutlined />, label: 'SSL 证书管理' },
    {
        key: '/template-center',
        icon: <AppstoreOutlined />,
        label: '模板中心',
        children: [
            { key: '/task-progress', label: '任务进度' },
            { key: '/data-insights', label: '数据洞察' }
        ],
    },
];
const Menu = ({ collapsed }: { collapsed: boolean }) => {
    const nav = useNavigate()
    const click = ({key}:{key:string}) => {
        console.log(key);
        
        nav(key)
    }
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
                onClick={click}
            />
        </AntSider>
    )
}
export default React.memo(Menu)