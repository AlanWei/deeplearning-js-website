import createAsyncThunk from 'utils/createAsyncThunk';
import Home from '../../views/home';
import Demos from '../../views/demos';
import API from '../../views/api';

const routes = [{
  path: '/',
  exact: true,
  component: Home,
  thunk: createAsyncThunk(() => import('../../views/home/thunk')),
}, {
  path: '/demos',
  component: Demos,
  thunk: createAsyncThunk(() => import('../../views/demos/thunk')),
}, {
  path: '/api',
  component: API,
}];

export default routes;
