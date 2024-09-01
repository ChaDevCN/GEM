import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom"
import { observer } from 'mobx-react-lite';

import { Layout, Button, Switch, Space, Dropdown, Avatar } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, BulbOutlined, SunOutlined } from '@ant-design/icons';
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
			disabled: true
		},
	];
	const {
		globalStore: { setTheme, userInfo, appearance }
	} = useStores();
	const checked = useRef<boolean>(true)
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
	const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
	const getReandomColor = () => ColorList[Math.floor(Math.random() * ColorList.length)]
	return (
		<AntHeader>
			<div className="flex justify-between">
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
				<Space className='mr-5' align='center' size={'middle'}>
					<Dropdown menu={{ items }} placement="bottom" arrow trigger={['click']}>
						<Avatar style={{ background: getReandomColor() }} className='mb-1 cursor-pointer'>{userInfo?.username[0]}</Avatar>
					</Dropdown>
					<Button
						icon={appearance === 'dark' ? <SunOutlined /> : <BulbOutlined />}
						onClick={(e) => {
							checked.current = !checked.current
							onChange(checked.current, e as any);
						}}
						className='mt-2'
					/>
				</Space>
			</div>
		</AntHeader>
	);
};
export default React.memo(observer(Header));
