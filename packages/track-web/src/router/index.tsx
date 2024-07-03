import React, { Suspense } from 'react';
import Layout from '@/layouts';
const Page = React.lazy(() => import('@/pages/index'));
const SSLCertificateManagement = React.lazy(() => import('@/pages/SslPage/index'));
const NotFound = React.lazy(() => import('@/components/NotFound/index'));

const router = [
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Page />
          </Suspense>
        )
      },
      {
        path: "ssl-certificate-management",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SSLCertificateManagement />
          </Suspense>
        )
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <NotFound />
          </Suspense>
        )
      }
    ]
  },
];

export default router;
