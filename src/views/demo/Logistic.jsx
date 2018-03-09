import React, { Component } from 'react';
import { Select } from 'antd';
import map from 'lodash/map';
import SiderLayout from '../../layouts/SiderLayout';
import { LEARNING_RATES, EPOCHES, SPECIES, IRIS_DIMS, NORMALIZATION_FUNCS } from './const';
import './logistic.scss';

const { Option } = Select;

const SIDER_ITEMS = [{
  key: 'logistic',
  link: '/demo',
  text: 'Logistic regression',
}, {
  key: 'softmax',
  link: '/demo/softmax',
  text: 'Softmax classifier',
}];

class Logistic extends Component {
  state = {
    targetSpecies: 'setosa',
    learningRate: 0.003,
    epoch: 500,
    costFunc: 'cross-entropy',
    normalizationFunc: 'zscore',
    hiddenLayerSize: 10,
    hiddenLayerAct: 'relu',
    outputLayerSize: 1,
    outputLayerAct: 'sigmoid',
  }

  renderDataPanel = () => (
    <div className="panel">
      <div className="panelHeader">DATA</div>
      <div className="panelBody">
        <div className="panelItem">
          <div className="selectLabel">Dataset: </div>
          <Select defaultValue="iris" style={{ width: 200 }} disabled>
            <Option value="iris">Iris</Option>
          </Select>
        </div>
        <div className="sectionTitle">Hyperparameters</div>
        <div className="panelItem">
          <div className="selectLabel">Target Species</div>
          <Select defaultValue={this.state.targetSpecies} style={{ width: 200 }}>
            {map(SPECIES, item => (
              <Option value={item} key={item}>{item}</Option>
            ))}
          </Select>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Learning Rate</div>
          <Select defaultValue={this.state.learningRate} style={{ width: 200 }}>
            {map(LEARNING_RATES, item => (
              <Option value={item} key={item}>{item}</Option>
            ))}
          </Select>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Epoch</div>
          <Select defaultValue={this.state.epoch} style={{ width: 200 }}>
            {map(EPOCHES, item => (
              <Option value={item} key={item}>{item}</Option>
            ))}
          </Select>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Cost Function</div>
          <Select defaultValue={this.state.costFunc} style={{ width: 200 }} disabled />
        </div>
        <div className="sectionTitle">Normalization</div>
        <div className="panelItem">
          <div className="selectLabel">Normalization Function</div>
          <Select defaultValue={this.state.normalizationFunc} style={{ width: 200 }}>
            {map(NORMALIZATION_FUNCS, item => (
              <Option value={item} key={item}>{item}</Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )

  render() {
    return (
      <SiderLayout
        className="logistic"
        siderItems={SIDER_ITEMS}
        currentSiderItemKey="logistic"
      >
        {this.renderDataPanel()}
        <div className="panel">
          <div className="panelHeader">MODEL</div>
        </div>
        <div className="panel">
          <div className="panelHeader">RESULT</div>
        </div>
      </SiderLayout>
    );
  }
}

export default Logistic;
