import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

const propTypes = {
  current: PropTypes.string,
};

const defaultProps = {
  current: 'logistic',
};

class Sider extends Component {
  renderSider = () => (
    <Menu
      mode="inline"
      selectedKeys={[this.props.current]}
    >
      <Menu.Item key="logistic" className="menuItem">
        <Link to="/demos/logistic" href="/demos/logistic">Logistic regression</Link>
      </Menu.Item>
      <Menu.Item key="softmax" className="menuItem">
        <Link to="/demos/softmax" href="/demos/softmax">Softmax classifier</Link>
      </Menu.Item>
    </Menu>
  )

  render() {
    return (
      <div className="sider">
        {this.renderSider()}
      </div>
    );
  }
}

Sider.propTypes = propTypes;
Sider.defaultProps = defaultProps;
export default Sider;
