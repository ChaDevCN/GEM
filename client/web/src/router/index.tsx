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


const [Page, Nginx, Certificates, Domains, Login, NotFound,] = [
  () => import('@/pages/index'), // /
  () => import('@/pages/nginx/index'), // nginx
  () => import('@/pages/nginx/certificates'), // certificates
  () => import('@/pages/nginx/domains'), // Domains
  () => import('@/pages/login/index'), // login
  () => import('@/components/NotFound/index'), //404
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
        path: '',
        element: <Page />
      },
      {
        path: '/nginx-management',
        element: <Nginx />,
        children: [
          {
            path: 'certificates',
            element: <Certificates />,
          },
          {
            path: 'domains',
            element: <Domains />,
          },
          {
            path: '',
            element: <Certificates />,
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
