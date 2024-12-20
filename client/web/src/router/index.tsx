import React, { useEffect, createRef } from 'react';
import { useNavigate } from 'react-router-dom';

import loadable from '@loadable/component';

import { getUserInfo } from '@/api';
import Layout from '@/layouts';

const [
	//Page,
	Nginx,
	Certificates,
	Renewal,
	Login,
	NotFound,
	Auth,
	CertificateMonitoring
] = [
	//() => import('@/pages/index'), // /
	() => import('@/pages/nginx/index'), // nginx
	() => import('@/pages/nginx/certificates'), // certificates
	() => import('@/pages/nginx/certificateRenewal'), // 续订
	() => import('@/pages/login/index'), // login
	() => import('@/components/NotFound/index'), //404
	() => import('@/pages/auth'), //系统管理
	() => import('@/pages/nginx/certificateMonitoring')
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
		element: <Login />,
		nodeRef: createRef()
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
				element: <CertificateMonitoring />,
				nodeRef: createRef()
			},
			{
				path: '/nginx-management',
				element: <Nginx />,
				children: [
					{
						path: '',
						element: <CertificateMonitoring />,
						nodeRef: createRef()
					},
					{
						path: 'certificates',
						element: <Certificates />,
						nodeRef: createRef()
					},
					{
						path: 'certificate-renewal',
						element: <Renewal />,
						nodeRef: createRef()
					},
					{
						path: 'certificate-monitoring',
						element: <CertificateMonitoring />,
						nodeRef: createRef()
					}
				]
			},
			{
				path: '*',
				element: <NotFound />,
				nodeRef: createRef()
			}
		]
	}
];

export default router;
