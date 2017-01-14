import Home from '../ui/pages/Home.jsx';
import NotFound from '../ui/pages/NotFound.jsx';

const routes = [
  {
    path: '/',
    component: Home
  }, {
    path: '*',
    component: NotFound
  }
];

export default routes;
