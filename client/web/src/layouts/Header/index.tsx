/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-20 22:44:53
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-25 22:01:29
 * @FilePath: \GEM\client\web\src\layouts\Header\index.tsx
 * @Description: Willing to work myself to death, just to outperform others.
 */
import React from 'react';
import { useNavigate } from "react-router-dom"
import { observer } from 'mobx-react-lite';

import { Layout, Button, Switch, Space, Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useStores } from '@/store';


interface ViewTransition {
	finished: Promise<void>;
	ready: Promise<void>;
	updateCallbackDone: Promise<void>;
	skipTransition: () => void;
}

type DocumentNew = Document & {
	startViewTransition: (callback: () => void) => ViewTransition | undefined;
};



const { Header: AntHeader } = Layout;
const Header = ({
	collapsed,
	setCollapsed
}: {
	collapsed: boolean;
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const nav = useNavigate()
	const items: MenuProps['items'] = [
		{
			key: '1',
			label: (
				<div onClick={() => nav('/auth')}>系统管理</div>
			),
		},
	];
	const {
		globalStore: { setTheme, userInfo }
	} = useStores();
	const onChange = (
		checked: boolean,
		e: React.MouseEvent<HTMLButtonElement>
	) => {
		const value = checked ? 'light' : 'dark';

		const transition = (document as DocumentNew).startViewTransition(() => {
			if (!checked) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
			setTheme(value);
		});
		transition &&
			transition.ready.then(() => {
				const { clientX, clientY } = e;
				const redius = Math.hypot(
					Math.max(clientX, innerWidth - clientX),
					Math.max(clientY, innerHeight - clientY)
				);

				const isDark = document.documentElement.classList.contains('dark');

				const clipPath = [
					`circle(${0}px at ${clientX}px ${clientY}px)`,
					`circle(${redius}px at ${clientX}px ${clientY}px)`
				];

				document.documentElement.animate(
					{ clipPath: isDark ? clipPath.reverse() : clipPath },
					{
						duration: 300,
						pseudoElement: isDark
							? '::view-transition-old(root)'
							: '::view-transition-new(root)'
					}
				);
			});
	};
	return (
		<AntHeader className="bg-header">
			<div className="flex justify-between bg-header">
				<Button
					type="text"
					icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
					onClick={() => setCollapsed(!collapsed)}
					style={{
						fontSize: '16px',
						width: 64,
						height: 64
					}}
				/>
				<Space className="mr-5 flex items-center">
					<div>{userInfo?.username}</div>
					<Dropdown menu={{ items }}>
						<div>{userInfo?.username || '韭菜'}</div>
					</Dropdown>
					<Switch defaultChecked onChange={onChange} />
				</Space>
			</div>
		</AntHeader>
	);
};
export default React.memo(observer(Header));
