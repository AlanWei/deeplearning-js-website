import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import './index.scss';

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
      <Menu.Item key="demos"><Link to="/demos" href="/demos">Demos</Link></Menu.Item>
      <Menu.Item key="api"><Link to="/api" href="/api">API</Link></Menu.Item>
    </Menu>
  );

  render() {
    return (
      <header className="header">
        <h1 className="appName">
          <Link to="/" href="/">deeplearning-js</Link>
        </h1>
        {this.renderMenu()}
      </header>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;
export default Header;
