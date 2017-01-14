import Home from '../ui/pages/Home';
import Upload from '../ui/pages/Upload';
import NotFound from '../ui/pages/NotFound';
import VideoEditor from '../ui/pages/VideoEditor';


const routes = [
  {
    path: '/',
    component: Home
  }, {
    path: '/upload',
    component: Upload
  }, {
    path: '/edit-video/:id',
    component: VideoEditor
  }, {
    path: '*',
    component: NotFound
  }
];

export default routes;
