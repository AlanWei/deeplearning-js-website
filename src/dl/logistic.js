import { map, omit, pick, values } from 'lodash';
import {
  Array2D,
  Normalization,
  convertArray2DToArray1D,
  initializeParameters,
  forwardPropagation,
  train,
} from 'deeplearning-js';
import iris from './data/iris';

function formatDataSet(dataset, target, isNormalized) {
  const datasetSize = dataset.length;
  let inputValues = [];
  let outputValues = [];

  map(dataset, (example) => {
    const input = omit(example, 'species');
    const output = pick(example, 'species');
    inputValues = inputValues.concat(values(input));
    outputValues = outputValues.concat(output.species === target ? 1 : 0);
  });

  const input = new Array2D(
    [datasetSize, inputValues.length / datasetSize],
    inputValues,
  ).transpose();

  const matrix = map(input.matrix, subArray => (
    isNormalized ? Normalization.rescaling(subArray) : subArray
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
      [outputValues.length / datasetSize, datasetSize],
      outputValues,
    ),
  };
}

function formatNumToBool(output) {
  return map(output.values, num => (num > 0.5 ? 1 : 0));
}

function predict(
  input,
  output,
  parameters,
  datasetType,
) {
  const forward = forwardPropagation(input, parameters).yHat;
  const predictSet = formatNumToBool(forward);
  const correctSet = formatNumToBool(output);
  let correctCount = 0;
  map(predictSet, (num, idx) => {
    if (num === correctSet[idx]) {
      correctCount += 1;
    }
  });

  console.log(`${datasetType} set accuracy: ${(correctCount / correctSet.length) * 100}%`);
  console.log(`${datasetType} set correct count: ${correctCount}`);
}

export default function logistic(
  target,
  learningRate,
  numOfIterations,
  isNormalized,
  hiddenLayerSize,
) {
  const trainSet = formatDataSet(iris, target, isNormalized);
  const initialParameters = initializeParameters([{
    size: trainSet.input.shape[0],
  }, {
    size: hiddenLayerSize,
    activationFunc: 'relu',
  }, {
    size: trainSet.output.shape[0],
    activationFunc: 'sigmoid',
  }], 0, 1, 0.01);

  return train(
    trainSet.input,
    trainSet.output,
    initialParameters,
    'cross-entropy',
    learningRate,
    numOfIterations,
    10,
  );
}
