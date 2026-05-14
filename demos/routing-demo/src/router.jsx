import { createBrowserRouter } from 'react-router';
import RootLayout from './routes/RootLayout.jsx';
import RootError from './routes/RootError.jsx';
import HomePage from './routes/HomePage.jsx';
import AboutPage from './routes/AboutPage.jsx';
import ProductsPage, { loader as productsLoader } from './routes/ProductsPage.jsx';
import ProductDetail, {
  loader as productLoader,
  action as productAction,
} from './routes/ProductDetail.jsx';

// One config object describes the whole route tree. Each route can have:
//   - element        : what renders for this URL
//   - loader         : async data fetch — runs before element mounts
//   - action         : runs on form POSTs to this URL
//   - errorElement   : renders if loader/action/element throws
//   - children       : nested routes that render in <Outlet />
//
// This is the data-router API; element + loader + action are the three
// pieces students should learn first.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      {
        path: 'products',
        element: <ProductsPage />,
        loader: productsLoader,
      },
      {
        path: 'products/:id',
        element: <ProductDetail />,
        loader: productLoader,
        action: productAction,
      },
    ],
  },
]);
