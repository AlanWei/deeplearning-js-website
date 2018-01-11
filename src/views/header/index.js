import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import './index.scss';

const GITHUB_URL = 'https://github.com/AlanWei/deeplearning-js';

const propTypes = {
  current: PropTypes.string,
};

const defaultProps = {
  current: 'home',
};

class Header extends Component {
  renderMenu = () => (
    <Menu
      className="menu"
      mode="horizontal"
      selectedKeys={[this.props.current]}
    >
      <Menu.Item key="home"><Link to="/" href="/">Home</Link></Menu.Item>
      <Menu.Item key="demos"><Link to="/demos/logistic" href="/demos">Demos</Link></Menu.Item>
      <Menu.Item key="api"><Link to="/api" href="/api">API</Link></Menu.Item>
      <Menu.Item key="code"><a href={GITHUB_URL} target="_blank">Code</a></Menu.Item>
    </Menu>
  );

  render() {
    return (
      <header className="header">
        <div className="appName">
          <Link to="/" href="/">deeplearning-js</Link>
        </div>
        {this.renderMenu()}
      </header>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;
export default Header;
