import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import app from 'app/index';

import 'antd/dist/antd.css';
import './styles/index.scss';

const client = app.createStore(createBrowserHistory(), {});

const application = app.createApp(client.store, client.history);
ReactDOM.render(application, window.document.getElementById('app'));
