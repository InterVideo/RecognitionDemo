import Home from '../ui/pages/Home';
import Upload from '../ui/pages/Upload';
import NotFound from '../ui/pages/NotFound';


const routes = [
  {
    path: '/',
    component: Home
  }, {
    path: '/upload',
    component: Upload
  }, {
    path: '*',
    component: NotFound
  }
];

export default routes;
