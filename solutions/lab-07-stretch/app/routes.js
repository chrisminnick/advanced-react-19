import { index, route } from '@react-router/dev/routes';

export default [
  index('routes/_index.jsx'),
  route('login', 'routes/login.jsx'),
  route('signup', 'routes/signup.jsx'),
  route('logout', 'routes/logout.jsx'),
  route('home', 'routes/home.jsx'),
];
