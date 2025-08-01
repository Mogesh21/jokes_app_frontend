import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

export const renderRoutes = (routes = []) => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Element = route.element;

          return (
            <Route
              key={i}
              path={route.path}
              element={
                <Guard>
                  <Layout>{route.routes ? renderRoutes(route.routes) : <Element />}</Layout>
                </Guard>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export const publicRoutes = [
  {
    exact: 'true',
    path: '/auth/login',
    element: lazy(() => import('./views/auth/signin/Login'))
  },
  {
    exact: 'true',
    path: '*',
    element: () => <Navigate to="/auth/login" />
  }
];

export const protectedRoutes = [
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/admin/users',
        val: '2',
        action: 'read',
        element: lazy(() => import('./views/admin/users'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/admin/add-user',
        val: '2',
        action: 'create',
        element: lazy(() => import('./views/admin/add-user'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/admin/edit-user',
        val: '2',
        action: 'update',
        element: lazy(() => import('./views/admin/edit-user'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/profile'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/apps/apps-list',
        val: '3',
        action: 'read',
        element: lazy(() => import('./views/apps/apps-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/apps/add-app',
        val: '3',
        action: 'create',
        element: lazy(() => import('./views/apps/add-app'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/apps/edit-app',
        val: '3',
        action: 'update',
        element: lazy(() => import('./views/apps/edit-app'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/types/types-list',
        val: '3',
        action: 'read',
        element: lazy(() => import('./views/types/types-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/types/add-type',
        val: '3',
        action: 'create',
        element: lazy(() => import('./views/types/add-type'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/types/edit-type',
        val: '3',
        action: 'update',
        element: lazy(() => import('./views/types/edit-type'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/categories/categories-list',
        val: '3',
        action: 'read',
        element: lazy(() => import('./views/categories/categories-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/categories/add-category',
        val: '3',
        action: 'create',
        element: lazy(() => import('./views/categories/add-category'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/categories/edit-category',
        val: '3',
        action: 'update',
        element: lazy(() => import('./views/categories/edit-category'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/subcategories/subcategories-list',
        val: '4',
        action: 'read',
        element: lazy(() => import('./views/subcategories/subcategories-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/subcategories/add-subcategory',
        val: '4',
        action: 'create',
        element: lazy(() => import('./views/subcategories/add-subcategory'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/subcategories/edit-subcategory',
        val: '4',
        action: 'update',
        element: lazy(() => import('./views/subcategories/edit-subcategory'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/jokes/jokes-list',
        val: '5',
        action: 'read',
        element: lazy(() => import('./views/jokes/jokes-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/jokes/add-joke',
        val: '5',
        action: 'create',
        element: lazy(() => import('./views/jokes/add-joke'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/jokes/edit-joke',
        val: '5',
        action: 'update',
        element: lazy(() => import('./views/jokes/edit-joke'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/profile/*',
        element: lazy(() => import('./views/profile'))
      },
      {
        exact: 'true',
        path: '*',
        element: () => <Navigate to="/app/dashboard/profile/edit-profile" />
      }
    ]
  }
];
