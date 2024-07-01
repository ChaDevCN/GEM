import React from "react"
import { Layout } from 'antd';

const { Content: AntContent } = Layout;
const Main = ({ children }: { children: React.ReactNode }) => {
    return <AntContent style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        {children}
    </AntContent>
}
export default React.memo(Main)