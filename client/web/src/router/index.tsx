/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-20 22:44:53
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-25 21:50:52
 * @FilePath: \GEM\client\web\src\router\index.tsx
 * @Description: Willing to work myself to death, just to outperform others.
 */
import Layout from '@/layouts';
import loadable from '@loadable/component';


const [Page, Nginx, Certificates, Domains, Login, NotFound, Auth, CertificateMonitoring] = [
  () => import('@/pages/index'), // /
  () => import('@/pages/nginx/index'), // nginx
  () => import('@/pages/nginx/certificates'), // certificates
  () => import('@/pages/nginx/domains'), // Domains
  () => import('@/pages/login/index'), // login
  () => import('@/components/NotFound/index'), //404
  () => import('@/pages/auth'), //系统管理
  () => import('@/pages/nginx/certificateMonitoring')
].map((item) =>
  loadable(item as any, {
    fallback: <div>Loading...</div>
  })
);

const router = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/auth',
        element: <Auth />
      },
      {
        path: '',
        element: <Page />
      },
      {
        path: '/nginx-management',
        element: <Nginx />,
        children: [
          {
            path: '',
            element: <Certificates />,
          },
          {
            path: 'certificates',
            element: <Certificates />,
          },
          {
            path: 'domains',
            element: <Domains />,
          },
          {
            path: 'certificate-monitoring',
            element: <CertificateMonitoring />
          },
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
