import React from 'react';
import { Layout, ConfigProvider } from 'antd';
import Footer from './Footer';
import Setting from './Setting';
import Main from './Main';
import Header from './Header';


import "./index.less"

const { Content } = Layout;
const LayoutConf = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <ConfigProvider theme={{
            token: {
                colorPrimary: '#7c3aed',
                colorPrimaryBg: '#f8f0ff',
                colorPrimaryBgHover: '#f0e0ff',
                colorPrimaryBorder: '#d9b8ff',
                colorPrimaryBorderHover: '#bf8fff',
                colorPrimaryHover: '#a064fa',
                colorPrimaryActive: '#5b26c7',
                colorPrimaryTextHover: '#a064fa',
                colorPrimaryText: '#7c3aed',
                colorPrimaryTextActive: '#5b26c7',
            },
        }}>
            <Layout hasSider>
                <Setting collapsed={collapsed} />
                <Layout>
                    <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                    <Content >
                        <Main>{children}</Main >
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </ConfigProvider>
    )
}
export default LayoutConf