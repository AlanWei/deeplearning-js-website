import React, { Component } from 'react';
import SiderLayout from '../../layouts/SiderLayout';

const SIDER_ITEMS = [{
  key: 'logistic',
  link: '/demo',
  text: 'Logistic regression',
}, {
  key: 'softmax',
  link: '/demo/softmax',
  text: 'Softmax classifier',
}];

class Softmax extends Component {
  render() {
    return (
      <SiderLayout
        siderItems={SIDER_ITEMS}
        currentSiderItemKey="softmax"
      >
        Softmax
      </SiderLayout>
    );
  }
}

export default Softmax;
