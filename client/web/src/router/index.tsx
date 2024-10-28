import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import loadable from '@loadable/component';

import { getUserInfo } from '@/api';
import Layout from '@/layouts';

const [
	Page,
	Nginx,
	Certificates,
	Renewal,
	Login,
	NotFound,
	Auth,
	CertificateMonitoring,
	Cert,
	ApplyCert
] = [
	() => import('@/pages/index'), // /
	() => import('@/pages/nginx/index'), // nginx
	() => import('@/pages/nginx/certificates'), // certificates
	() => import('@/pages/nginx/certificateRenewal'), // 续订
	() => import('@/pages/login/index'), // login
	() => import('@/components/base/notFound/index'), //404
	() => import('@/pages/auth'), //系统管理
	() => import('@/pages/nginx/certificateMonitoring'),
	() => import('@/pages/nginx/cert'),
	() => import('@/pages/nginx/applyCert')
].map((item) =>
	loadable(item as any, {
		fallback: <div>Loading...</div>
	})
);
const AuthCom = ({ children }: { children: React.ReactNode }) => {
	const nav = useNavigate();
	useEffect(() => {
		const init = async () => {
			const { status } = await getUserInfo();
			if (status === 10002) {
				nav('/login');
			}
		};
		init();
	}, []);
	return <>{children}</>;
};
const router = [
	{
		path: '/login',
		element: <Login />
	},
	{
		path: '/',
		element: (
			<AuthCom>
				<Layout />
			</AuthCom>
		),
		children: [
			// {
			//   path: '/auth',
			//   element: <Auth />
			// },
			{
				path: '',
				element: <CertificateMonitoring />
			},
			{
				path: '/nginx-management',
				element: <Nginx />,
				children: [
					{
						path: '',
						element: <CertificateMonitoring />
					},
					{
						path: 'certificates',
						element: <Certificates />
					},
					{
						path: 'certificate-renewal',
						element: <Renewal />
					},
					{
						path: 'certificate-monitoring',
						element: <CertificateMonitoring />
					},
					{
						path: 'cert',
						element: <Cert />
					},
					{
						path: 'applycert',
						element: <ApplyCert />
					}
				]
			},
			{
				path: '*',
				element: <NotFound />
			}
		]
	}
];

export default router;
