import { map, omit, pick, values, indexOf, max, isEmpty } from 'lodash';
import {
  Array2D,
  initializeParameters,
  forwardPropagation,
  train,
  Normalization,
  convertArray2DToArray1D,
} from 'deeplearning-js';
import irisTrain from './data/iris.train';
import irisTest from './data/iris.test';

function formatDataSet(dataset, isNormalized) {
  const datasetSize = dataset.length;
  let inputValues = [];
  let outputValues = [];

  map(dataset, (example) => {
    const input = omit(example, 'species');
    const output = pick(example, 'species');
    inputValues = inputValues.concat(values(input));
    let result = [1, 0, 0];
    switch (output.species) {
      case 'setosa':
        result = [1, 0, 0];
        break;
      case 'versicolor':
        result = [0, 1, 0];
        break;
      case 'virginica':
        result = [0, 0, 1];
        break;
      default:
        break;
    }
    outputValues = outputValues.concat(result);
  });

  const input = new Array2D(
    [datasetSize, inputValues.length / datasetSize],
    inputValues,
  ).transpose();

  const matrix = map(input.matrix, subArray => (
    isNormalized ? Normalization.zeroMeanNormalization(subArray) : subArray
  ));

  return {
    input: new Array2D(
      [inputValues.length / datasetSize, datasetSize],
      convertArray2DToArray1D(
        [inputValues.length / datasetSize, datasetSize],
        matrix,
      ),
    ),
    output: new Array2D(
      [datasetSize, outputValues.length / datasetSize],
      outputValues,
    ).transpose(),
  };
}

function predict(
  input,
  output,
  parameters,
) {
  const forward = forwardPropagation(input, parameters).yHat;
  if (isEmpty(forward)) {
    return map(output, () => (''));
  }
  const transform = map(forward.transpose().matrix, (subArray) => {
    const maxIdx = indexOf(subArray, max(subArray));
    switch (maxIdx) {
      case 0:
        return 'setosa';
      case 1:
        return 'versicolor';
      case 2:
        return 'virginica';
      default:
        return '';
    }
  });

  return transform;
}

function softmax(
  learningRate,
  numOfIterations,
  isNormalized,
  hiddenLayerSize,
  errCallback,
) {
  const trainSet = formatDataSet(irisTrain, isNormalized);
  const testSet = formatDataSet(irisTest, isNormalized);

  const initialParameters = initializeParameters([{
    size: trainSet.input.shape[0],
  }, {
    size: hiddenLayerSize,
    activationFunc: 'relu',
  }, {
    size: trainSet.output.shape[0],
    activationFunc: 'softmax',
  }], 0, 1, 0.01);

  try {
    const { parameters, costs } = train(
      trainSet.input,
      trainSet.output,
      initialParameters,
      'cross-entropy',
      learningRate,
      numOfIterations,
      10,
    );

    return {
      testSet,
      parameters,
      costs,
    };
  } catch (err) {
    return errCallback(err);
  }
}

export {
  softmax,
  predict,
};
