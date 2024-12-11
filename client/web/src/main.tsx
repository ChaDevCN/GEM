import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'antd-style';
import { ClickToComponent } from 'click-to-react-component';
import { observer } from 'mobx-react-lite';
// @ts-ignore
import ReactDOM from 'react-dom/client';

import routes from './router';

import { StoresProvider, stores, useStores } from '@/store';

import '@/assets/less/global.less';
import '@/assets/less/reset.less';
import 'uno.css';

const router = createBrowserRouter(routes);

const App = observer(() => {
	const {
		globalStore: { appearance }
	} = useStores();
	return (
		<ThemeProvider appearance={appearance}>
			<RouterProvider router={router} />
		</ThemeProvider>
	);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StoresProvider value={stores}>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#7c3aed',
					colorPrimaryBg: '#f8f0ff',
					colorPrimaryBgHover: '#f0e0ff',
					colorPrimaryBorder: '#d9b8ff',
					colorPrimaryBorderHover: '#bf8fff',
					colorPrimaryHover: '#a064fa',
					colorPrimaryActive: '#5b26c7',
					colorPrimaryTextHover: '#a064fa',
					colorPrimaryText: '#7c3aed',
					colorPrimaryTextActive: '#5b26c7'
				}
			}}
		>
			<ClickToComponent />
			<App />
		</ConfigProvider>
	</StoresProvider>
);
