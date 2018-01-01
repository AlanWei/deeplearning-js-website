import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd';
import map from 'lodash/map';
import keys from 'lodash/keys';
import action from './action';
import './style.scss';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const propTypes = {
};

class Home extends Component {
  state = {
  }

  renderMenu = () => {
    return (
      <Menu
        className="menu"
        mode="horizontal"
      >
        <Menu.Item>Home</Menu.Item>
        <Menu.Item>Demo</Menu.Item>
        <Menu.Item>API</Menu.Item>
        <Menu.Item>Code</Menu.Item>
      </Menu>
    );
  }

  render() {
    return (
      <div className="home">
        <header className="header">
          <h1 className="appName">deeplearning-js</h1>
          {this.renderMenu()}
        </header>
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

Home.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(Home);
