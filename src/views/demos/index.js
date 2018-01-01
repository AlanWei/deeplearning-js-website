import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../header';
import './index.scss';

const propTypes = {
};

class Demos extends Component {
  render() {
    return (
      <div className="demos">
        <Header current="demos" />
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

Demos.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(Demos);
