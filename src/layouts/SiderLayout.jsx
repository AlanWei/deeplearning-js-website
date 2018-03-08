import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Sider from '../components/Sider';
import './siderlayout.scss';

const propTypes = {
  className: PropTypes.string,
  siderItems: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })),
  currentSiderItemKey: PropTypes.string,
  renderCustomSider: PropTypes.func, // eslint-disable-line react/require-default-props
};

const defaultProps = {
  className: '',
  siderItems: [],
  currentSiderItemKey: '',
};

class SiderLayout extends Component {
  render() {
    const classes = classnames('siderLayout', this.props.className);
    return (
      <div className={classes}>
        {this.props.renderCustomSider ?
          this.props.renderCustomSider() :
          <Sider
            className="siderLayoutSider"
            items={this.props.siderItems}
            current={this.props.currentSiderItemKey}
          />
        }
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
