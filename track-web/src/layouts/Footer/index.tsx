import React from "react"
import { Layout } from 'antd';

const {  Footer:AntFooter  } = Layout;
const Footer = () => {
    return <AntFooter className="text-center">
        aixdb ©2024
    </AntFooter>
}
export default React.memo(Footer) 