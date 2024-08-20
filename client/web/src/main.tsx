import { BrowserRouter, useRoutes } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import { ThemeProvider } from 'antd-style';
import { observer } from 'mobx-react-lite';
// @ts-ignore
import { ClickToComponent } from 'click-to-react-component';

import { StoresProvider, stores, useStores } from '@/store';
import router from './router';

import '@/assets/less/global.less';
import '@/assets/less/reset.less';
import 'uno.css';

const App = observer(() => {
	const {
		globalStore: { appearance }
	} = useStores();
	return (
		<ThemeProvider appearance={appearance}>{useRoutes(router)}</ThemeProvider>
	);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<StoresProvider value={stores}>
			<ClickToComponent />
			<App />
		</StoresProvider>
	</BrowserRouter>
);
