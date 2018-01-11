import createAsyncThunk from 'utils/createAsyncThunk';
import Home from '../../views/home';
import Logistic from '../../views/demos/logistic';
import Softmax from '../../views/demos/softmax';
import API from '../../views/api';

const routes = [{
  path: '/',
  exact: true,
  component: Home,
  thunk: createAsyncThunk(() => import('../../views/home/thunk')),
}, {
  path: '/demos/logistic',
  component: Logistic,
}, {
  path: '/demos/softmax',
  component: Softmax,
}, {
  path: '/api',
  component: API,
}];

export default routes;
