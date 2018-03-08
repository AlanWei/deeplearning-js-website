import React, { Component } from 'react';
import SiderLayout from '../../layouts/SiderLayout';

const SIDER_ITEMS = [{
  key: 'logistics',
  link: '/demo',
  text: 'Logistic regression',
}, {
  key: 'softmax',
  link: '/demo/softmax',
  text: 'Softmax classifier',
}];

class Logistics extends Component {
  render() {
    return (
      <SiderLayout
        siderItems={SIDER_ITEMS}
        currentSiderItemKey="logistics"
      >
        Logistics
      </SiderLayout>
    );
  }
}

export default Logistics;
