import React from "react"
import {
    PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu as AntMenu } from 'antd';
import { Layout } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];
const { Sider: AntSider } = Layout;
const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: '首页' },
];
const Menu = () => {
    return (
        <AntSider className="bg-white" style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }} theme={'light'}>
            <AntMenu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="dark"
                items={items}
                className="mt-[60px]"
            />
        </AntSider>
    )
}
export default React.memo(Menu)