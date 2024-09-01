import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';

import { Layout, Button, Space, Dropdown, Avatar, message } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, BulbOutlined, SunOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useStores } from '@/store';
import { useRequest } from 'ahooks';
import { logout } from '@/api';
import { useNavigate } from 'react-router-dom';

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


	const items: MenuProps['items'] = [
		{
			key: 1,
			label: (
				<div>系统管理</div>
			),
			disabled: true
		},
		{
			key: 2,
			label: (
				<div>退出登录</div>
			),
		},
	];
	const {
		globalStore: { setTheme, userInfo, appearance }
	} = useStores();
	const nav = useNavigate()
	const checked = useRef<boolean>(true)
	const { run } = useRequest(logout, {
		manual: true,
		onSuccess({ status, message: msg }) {
			if (status === 200) {
				nav('/login')
				message.success('成功退出...!')
			} else {
				message.error(JSON.stringify(msg))
			}
		}
	})
	const onClick = ({ key }: { key: string }) => {
		switch (key) {
			case '2':
				run()
				break;
		}

	}

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
					<Dropdown menu={{ items, onClick }} placement="bottom" arrow trigger={['click']}>
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
