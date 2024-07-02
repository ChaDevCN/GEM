import React from 'react';
const Page = React.lazy(() => import('@/pages/index.tsx'));
import Layout from '@/layouts';
const router = [
  {
    path: "/",
    element: <Layout><Page /></Layout>
  },
]

export default router