import Home from '../ui/pages/Home';
import Upload from '../ui/pages/Upload';
import NotFound from '../ui/pages/NotFound';
import VideoEditor from '../ui/pages/VideoEditor';
import VideoPage from '../ui/pages/VideoPage';


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
    path: '/videos/:id',
    component: VideoPage
  }, {
    path: '*',
    component: NotFound
  }
];

export default routes;
