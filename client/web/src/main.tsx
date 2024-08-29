/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-20 22:44:53
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-25 20:16:02
 * @FilePath: \GEM\client\web\src\main.tsx
 * @Description: Willing to work myself to death, just to outperform others.
 */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import { ThemeProvider } from 'antd-style';
import { observer } from 'mobx-react-lite';
// @ts-ignore
import { ClickToComponent } from 'click-to-react-component';

import { StoresProvider, stores, useStores } from '@/store';
import routes from './router';

import '@/assets/less/global.less';
import '@/assets/less/reset.less';
import 'uno.css';


const router = createBrowserRouter(routes);


const App = observer(() => {
	const {
		globalStore: { appearance }
	} = useStores();
	return (
		<ThemeProvider appearance={appearance}><RouterProvider router={router} /></ThemeProvider>
	);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StoresProvider value={stores}>
		<ClickToComponent />
		<App />
	</StoresProvider>
);
