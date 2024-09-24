import React from "react"
import { Layout } from 'antd';

const { Content: AntContent } = Layout;
const Main = ({ children }: { children: React.ReactNode }) => {
    return <div className="my-[24px] ml-[16px]" style={{ overflow: 'initial' }}>
        {children}
    </div>
}
export default React.memo(Main)