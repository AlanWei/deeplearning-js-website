import React, { Component } from 'react';
import classnames from 'classnames';
import './index.scss';

class Content extends Component {
  render() {
    const classes = classnames({
      content: true,
      [this.props.className]: true,
    });

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}

export default Content;
