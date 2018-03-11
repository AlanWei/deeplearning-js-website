import React, { Component } from 'react';
import { Select, Card, Button, Icon, InputNumber } from 'antd';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import pullAt from 'lodash/pullAt';
import SiderLayout from '../../layouts/SiderLayout';
import { LEARNING_RATES, EPOCHES, SPECIES, IRIS_DIMS, NORMALIZATION_FUNCS } from './const';
import irisDataset from '../../dl/data/iris';
import logistic from '../../dl/logistic';
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
    //
    hiddenLayers: [],
    currentHoverHiddenLayerIndex: -1,
  }

  handleAddLayer = () => {
    const layers = cloneDeep(this.state.hiddenLayers);
    layers.push({
      size: 10,
      activationFunc: 'relu',
    });
    this.setState({
      hiddenLayers: layers,
    });
  }

  handleMouseEnterHiddenLayer = (idx) => {
    this.setState({
      currentHoverHiddenLayerIndex: idx,
    });
  }

  handleDeleteHiddenLayer = (idx) => {
    const layers = cloneDeep(this.state.hiddenLayers);
    pullAt(layers, idx);
    this.setState({
      hiddenLayers: layers,
    });
  }

  handleChangeHiddenLayerSize = (size, idx) => {
    const layers = cloneDeep(this.state.hiddenLayers);
    layers[idx].size = size;
    this.setState({
      hiddenLayers: layers,
    });
  }

  handleTrainingStart = () => {
    const { costs } = logistic(
      this.state.targetSpecies,
      this.state.hiddenLayers,
      this.state.learningRate,
      this.state.epoch,
      this.state.costFunc,
    );
    console.log(costs);
  }

  handleSelectChange = (value, type) => {
    this.setState({
      [type]: value,
    });
  }

  renderControlPanel = () => (
    <div className="controlPanel">
      <div
        className="startBtn"
        role="presentation"
        onClick={this.handleTrainingStart}
      >
        <Icon type="caret-right" />
      </div>
      <div>
        <div className="selectLabel"><strong>Dataset</strong></div>
        <Select defaultValue="iris" style={{ width: 200 }} disabled>
          <Option value="iris">Iris</Option>
        </Select>
      </div>
    </div>
  )

  renderDataPanel = () => (
    <div className="panel">
      <div className="panelHeader">DATA</div>
      <div className="panelBody">
        <div className="sectionTitle">Hyperparameters</div>
        <div className="panelItem">
          <div className="selectLabel">Target Species</div>
          <Select
            defaultValue={this.state.targetSpecies}
            style={{ width: 200 }}
            onChange={value => this.handleSelectChange(value, 'targetSpecies')}
          >
            {map(SPECIES, item => (
              <Option value={item} key={item}>{item}</Option>
            ))}
          </Select>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Learning Rate</div>
          <Select
            defaultValue={this.state.learningRate}
            style={{ width: 200 }}
            onChange={value => this.handleSelectChange(value, 'learningRate')}
          >
            {map(LEARNING_RATES, item => (
              <Option value={item} key={item}>{item}</Option>
            ))}
          </Select>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Epoch</div>
          <Select
            defaultValue={this.state.epoch}
            style={{ width: 200 }}
            onChange={value => this.handleSelectChange(value, 'epoch')}
          >
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

  renderHiddenLayers = () => (
    map(this.state.hiddenLayers, (layer, idx) => (
      <Card
        onMouseEnter={() => this.handleMouseEnterHiddenLayer(idx)}
        onMouseLeave={() => this.handleMouseEnterHiddenLayer(-1)}
        key={idx}
        className="panelItem layerCard"
      >
        {idx === this.state.currentHoverHiddenLayerIndex ?
          <Icon
            className="deleteBtn"
            type="delete"
            onClick={() => this.handleDeleteHiddenLayer(idx)}
          />
          :
          null
        }
        <div className="panelItem"><strong>Hidden Layer {idx + 1}</strong></div>
        <div className="panelItem">
          <div className="selectLabel">Neurons</div>
          <InputNumber
            min={1}
            max={100}
            step={10}
            defaultValue={10}
            style={{ width: 100 }}
            onChange={size => this.handleChangeHiddenLayerSize(size, idx)}
          />
        </div>
        <div className="panelItem">
          <div className="selectLabel">Activation Function</div>
          <Select defaultValue={layer.activationFunc} style={{ width: 100 }} disabled />
        </div>
        <div className="layerShape">
          [{layer.size}, {this.state.hiddenLayers[idx - 1] ?
            this.state.hiddenLayers[idx - 1].size :
            IRIS_DIMS
          }]
        </div>
      </Card>
    ))
  )

  renderOutputLayer = () => {
    const outputLayerSize = this.state.hiddenLayers.length > 0 ?
      this.state.hiddenLayers[this.state.hiddenLayers.length - 1].size :
      IRIS_DIMS;
    return (
      <Card className="panelItem layerCard">
        <div className="panelItem"><strong>Output Layer</strong></div>
        <div className="panelItem">
          <div className="selectLabel">Neurons</div>
          <InputNumber
            defaultValue={1}
            style={{ width: 100 }}
            disabled
          />
        </div>
        <div className="panelItem">
          <div className="selectLabel">Activation Function</div>
          <Select defaultValue="sigmoid" style={{ width: 100 }} disabled />
        </div>
        <div className="layerShape">
          [1, {outputLayerSize}]
        </div>
      </Card>
    );
  }

  renderModelPanel = () => (
    <div className="panel">
      <div className="panelHeader">MODEL</div>
      <div className="panelBody">
        <Card className="panelItem layerCard">
          <div className="panelItem"><strong>Input Data</strong></div>
          <div className="layerShape">[{IRIS_DIMS}, {irisDataset.length}]</div>
        </Card>
        {this.renderHiddenLayers()}
        <Button
          className="panelItem"
          style={{ width: 100 }}
          type="primary"
          onClick={this.handleAddLayer}
        >
          ADD
        </Button>
        {this.renderOutputLayer()}
      </div>
    </div>
  )

  renderResultPanel = () => (
    <div className="panel">
      <div className="panelHeader">RESULT</div>
      <div className="panelBody" />
    </div>
  )

  render() {
    return (
      <SiderLayout
        className="logistic"
        siderItems={SIDER_ITEMS}
        currentSiderItemKey="logistic"
      >
        {this.renderControlPanel()}
        <div className="modelPanel">
          {this.renderDataPanel()}
          {this.renderModelPanel()}
          {this.renderResultPanel()}
        </div>
      </SiderLayout>
    );
  }
}

export default Logistic;
