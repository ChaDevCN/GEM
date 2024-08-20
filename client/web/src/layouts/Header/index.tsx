import React from 'react';
import { observer } from 'mobx-react-lite';

import { Layout, Button, Switch } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

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
	const {
		globalStore: { setTheme }
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
						duration: 400,
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
				<div className="mr-5">
					<Switch defaultChecked onChange={onChange} />
				</div>
			</div>
		</AntHeader>
	);
};
export default React.memo(observer(Header));
