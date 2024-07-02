import { Layout, ConfigProvider } from 'antd';
import Footer from './Footer';
import Setting from './Setting';
import Main from './Main';
import Header from './Header';
const { Content } = Layout;
const LayoutConf = ({ children }: { children: React.ReactNode }) => {
    return (
        <ConfigProvider theme={{
            token:{
                colorPrimary:'#7c3aed'
            }
        }}>
            <Layout hasSider>
                <Setting />
                <Layout>
                    <Header />
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