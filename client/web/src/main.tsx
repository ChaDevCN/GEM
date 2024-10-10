import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
		<ClickToComponent />
		<App />
	</StoresProvider>
);
