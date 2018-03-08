import React, { Component } from 'react';
import SiderLayout from '../../layouts/SiderLayout';
import './democontainer.scss';

class DemoContainer extends Component {
  render() {
    return (
      <SiderLayout className="demoContainer">
        {this.props.children}
      </SiderLayout>
    );
  }
}

export default DemoContainer;
