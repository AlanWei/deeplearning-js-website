import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import Home from '../views/home';
import Logistic from '../views/demo/logistic';
import Softmax from '../views/demo/softmax';
import Api from '../views/api';
import NotFound from '../views/notFound';

const propTypes = {
  history: PropTypes.object.isRequired,
};

const Router = props => (
  <ConnectedRouter history={props.history}>
    <BasicLayout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/demo" component={Logistic} />
        <Route path="/demo/softmax" component={Softmax} />
        <Route path="/api" component={Api} />
        <Route component={NotFound} />
      </Switch>
    </BasicLayout>
  </ConnectedRouter>
);

Router.propTypes = propTypes;
export default Router;
