/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-20 22:44:53
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-25 21:50:52
 * @FilePath: \GEM\client\web\src\router\index.tsx
 * @Description: Willing to work myself to death, just to outperform others.
 */
import { getUserInfo } from '@/api';
import Layout from '@/layouts';
import loadable from '@loadable/component';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const [
  Page,
  Nginx,
  Certificates,
  Renewal,
  Login,
  NotFound,
  Auth,
  CertificateMonitoring,
] = [
  () => import('@/pages/index'), // /
  () => import('@/pages/nginx/index'), // nginx
  () => import('@/pages/nginx/certificates'), // certificates
  () => import('@/pages/nginx/certificateRenewal'), // 续订
  () => import('@/pages/login/index'), // login
  () => import('@/components/NotFound/index'), //404
  () => import('@/pages/auth'), //系统管理
  () => import('@/pages/nginx/certificateMonitoring'),
].map((item) =>
  loadable(item as any, {
    fallback: <div>Loading...</div>
  })
);
const AuthCom = ({ children }: { children: React.ReactNode }) => {
  const nav = useNavigate()
  useEffect(() => {
    const init = async () => {

      const { status } = await getUserInfo()
      if (status === 10002) {
        nav('/login')
      }
    }
    init()
  }, [])
  return <>{children}</>
}
const router = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <AuthCom><Layout /></AuthCom>,
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
            element: <CertificateMonitoring />,
          },
          {
            path: 'certificates',
            element: <Certificates />,
          },
          {
            path: 'certificate-renewal',
            element: <Renewal />,
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
