import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import './sider.scss';

const propTypes = {
  className: PropTypes.string,
  current: PropTypes.string,
};

const defaultProps = {
  className: '',
  current: 'logistic',
};

class Sider extends Component {
  renderSider = () => (
    <Menu
      mode="inline"
      selectedKeys={[this.props.current]}
    >
      <Menu.Item key="logistic" className="menuItem">
        <Link to="/demo" href="/demos/logistic">Logistic regression</Link>
      </Menu.Item>
      <Menu.Item key="softmax" className="menuItem">
        <Link to="/demo/softmax" href="/demos/softmax">Softmax classifier</Link>
      </Menu.Item>
    </Menu>
  )

  render() {
    const classes = classnames('siderLayout', this.props.className);
    return (
      <div className={classes}>
        {this.renderSider()}
      </div>
    );
  }
}

Sider.propTypes = propTypes;
Sider.defaultProps = defaultProps;
export default Sider;
