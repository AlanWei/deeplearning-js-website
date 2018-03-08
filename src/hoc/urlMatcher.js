import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'lodash/find';
import keys from 'lodash/keys';

const URL_MAP = {
  '/demo': 'demo',
  '/api': 'api',
};

const findMatch = current => (
  find(keys(URL_MAP), url => (
    current.indexOf(url) !== -1
  ))
);

const urlMatcher = (WrappedCompoennt) => {
  const propTypes = {
    pathname: PropTypes.string.isRequired,
  };

  class UrlMatcher extends React.Component {
    state = {
      current: 'home',
    }

    componentWillMount() {
      this.setCurrent(this.props.pathname);
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.pathname !== nextProps.pathname) {
        this.setCurrent(nextProps.pathname);
      }
    }

    setCurrent = (pathname) => {
      const current = pathname === '/' ?
        'home' : URL_MAP[findMatch(pathname)];
      this.setState({
        current,
      });
    }

    render() {
      return (
        <WrappedCompoennt
          {...this.props}
          current={this.state.current}
        />
      );
    }
  }

  const mapStateToProps = state => ({
    pathname: state.router.location.pathname,
  });

  UrlMatcher.propTypes = propTypes;
  return connect(mapStateToProps)(UrlMatcher);
};

export default urlMatcher;
