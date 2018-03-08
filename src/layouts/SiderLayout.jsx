import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Sider from '../components/Sider';
import './siderlayout.scss';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

class SiderLayout extends Component {
  render() {
    const classes = classnames('siderLayout', this.props.className);
    return (
      <div className={classes}>
        <Sider className="siderLayoutSider" />
        <div className="siderLayoutContent">
          {this.props.children}
        </div>
      </div>
    );
  }
}

SiderLayout.propTypes = propTypes;
SiderLayout.defaultProps = defaultProps;
export default SiderLayout;
