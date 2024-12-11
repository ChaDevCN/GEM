import React from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { Layout } from 'antd';

import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import Setting from './Setting';

import routes from '@/router';

import './index.less';

const { Content } = Layout;

const LayoutConf = () => {
	const [collapsed, setCollapsed] = React.useState(false);
	const location = useLocation();
	const currentOutlet = useOutlet();
	const { nodeRef } = (routes.find(
		(route) => route.path === location.pathname
	) ?? {}) as {
		nodeRef?: React.RefObject<HTMLDivElement>;
	};
	const handleResize = () => {
		if (window.innerWidth < 960) {
			setCollapsed(true);
		} else {
			setCollapsed(false);
		}
	};
	React.useEffect(() => {
		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
	return (
		<Layout hasSider>
			<Setting collapsed={collapsed} />
			<Layout>
				<Header collapsed={collapsed} setCollapsed={setCollapsed} />
				<Content>
					<Main>
						<div id="container">
							<SwitchTransition>
								<CSSTransition
									key={location.pathname}
									nodeRef={nodeRef}
									timeout={300}
									classNames="page"
									unmountOnExit
								>
									{() => (
										<div ref={nodeRef} className="page">
											{currentOutlet}
										</div>
									)}
								</CSSTransition>
							</SwitchTransition>
						</div>
					</Main>
				</Content>
				<Footer />
			</Layout>
		</Layout>
	);
};

export default LayoutConf;
