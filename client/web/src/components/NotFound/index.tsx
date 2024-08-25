/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-20 22:44:53
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-25 21:08:07
 * @FilePath: \GEM\client\web\src\components\NotFound\index.tsx
 * @Description: Willing to work myself to death, just to outperform others.
 */
import React from 'react';
import { useNavigate } from "react-router-dom"
import { Button, Result } from 'antd';

const Index: React.FC = () => {
	const nav = useNavigate()
	return <Result
		status="404"
		title="404"
		subTitle="该功能暂未开放"
		extra={<Button type="primary" onClick={() => nav('/')}>Back Home</Button>}
	/>
};

export default Index;
