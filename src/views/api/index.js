import React, { Component } from 'react';
import { Menu } from 'antd';
import Markdown from 'markdown-to-jsx';
import SiderLayout from '../../layouts/SiderLayout';
import './index.scss';

const { SubMenu } = Menu;

const md = `
# deeplearning-js
<a id="intention"></a>
## Intention
**deeplearning-js** is an open source JavaScript library for deep learning. **deeplearning-js** provides all JavaScript developers a new way to play around with deep learning models without learning unfamiliar Python, statistics or calculus knowledge.

<a id="gettingstarted"></a>
## Getting started
~~~~
npm install deeplearning-js
~~~~

~~~~
yarn add deeplearning-js
~~~~
`;

class Api extends Component {
  state = {
    current: 'intention',
    openKeys: ['api'],
  }

  handleClick = ({ key }) => {
    this.setState({
      current: key,
    });
  }

  renderSider = () => (
    <Menu
      className="apiSider"
      mode="inline"
      defaultOpenKeys={this.state.openKeys}
      selectedKeys={[this.state.current]}
      onClick={this.handleClick}
    >
      <Menu.Item key="intention"><a className="menuItem" href="/api#intention">Intention</a></Menu.Item>
      <Menu.Item key="gettingstarted"><a className="menuItem" href="/api#gettingstarted">Getting started</a></Menu.Item>
      <SubMenu key="api" title="API" className="menuItem">
        <Menu.Item key="normalization"><a className="menuItem" href="/api#normalization">Normalization</a></Menu.Item>
        <Menu.Item key="initializeparameters"><a className="menuItem" href="/api#initializeparameters">initializeParameters</a></Menu.Item>
        <Menu.Item key="train"><a className="menuItem" href="/api#train">train</a></Menu.Item>
        <Menu.Item key="forwardpropagation"><a className="menuItem" href="/api#forwardpropagation">forwardPropagation</a></Menu.Item>
      </SubMenu>
    </Menu>
  )

  render() {
    return (
      <SiderLayout
        className="api"
        renderCustomSider={this.renderSider}
      >
        <Markdown>{md}</Markdown>
      </SiderLayout>
    );
  }
}

export default Api;
