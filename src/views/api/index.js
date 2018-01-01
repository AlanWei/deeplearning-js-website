import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../header';
import './index.scss';

const propTypes = {
};

class API extends Component {
  render() {
    return (
      <div className="api">
        <Header current="api" />
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

API.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(API);
