import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import map from 'lodash/map';
import './sider.scss';

const propTypes = {
  className: PropTypes.string,
  current: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })),
};

const defaultProps = {
  className: '',
  current: 'logistic',
  items: [],
};

class Sider extends Component {
  renderSider = () => (
    <Menu
      mode="inline"
      selectedKeys={[this.props.current]}
    >
      {map(this.props.items, item => (
        <Menu.Item key={item.key} className="menuItem">
          <Link to={item.link} href={item.link}>{item.text}</Link>
        </Menu.Item>
      ))}
    </Menu>
  )

  render() {
    const classes = classnames('sider', this.props.className);
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
