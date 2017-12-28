import map from 'lodash/map';
import slice from 'lodash/slice';
import max from 'lodash/max';
import findIndex from 'lodash/findIndex';
import mnist from 'mnist';
import {
  Array2D,
  initializeParameters,
  forwardPropagation,
  train,
} from 'deeplearning-js';

function formatDataSet(dataset) {
  const datasetSize = dataset.length;
  let inputValues = [];
  let outputValues = [];
  map(dataset, (example) => {
    inputValues = inputValues.concat(example.input);
    outputValues = outputValues.concat(example.output);
  });
  return {
    input: new Array2D(
      [inputValues.length / datasetSize, datasetSize],
      inputValues,
    ),
    output: new Array2D(
      [outputValues.length / datasetSize, datasetSize],
      outputValues,
    ),
  };
}

function formatBoolToNum(output) {
  const rows = output.shape[0];
  const outputT = output.transpose();
  const outputTValues = outputT.values;
  const result = [];
  for (let i = 0; i < outputTValues.length / rows; i += 1) {
    const subArray = slice(outputTValues, i * rows, (i + 1) * rows);
    const maxValue = max(subArray);
    for (let j = 0; j < subArray.length; j += 1) {
      if (maxValue === subArray[j]) {
        result.push(j);
      }
    }
  }
  return result;
}

function predict(input, output, parameters, datasetType) {
  const forward = forwardPropagation(input, parameters).yHat;
  const predictSet = formatBoolToNum(forward);
  const correctSet = formatBoolToNum(output);
  let correctCount = 0;
  map(predictSet, (num, idx) => {
    if (num === correctSet[idx]) {
      correctCount += 1;
    }
  });

  console.log(`${datasetType} set accuracy: ${(correctCount / correctSet.length) * 100}%`);
  console.log(`${datasetType} set correct count: ${correctCount}`);
}

export default function main(
  trainingSetSize,
  testSetSize,
  learningRate,
  numOfIterations,
  baseIterationToShowCost,
  learningRateDecayRate,
) {
  const set = mnist.set(trainingSetSize, testSetSize);
  const trainingSet = formatDataSet(set.training);
  // const testSet = formatDataSet(set.test);

  const initialParameters = initializeParameters([{
    size: trainingSet.input.shape[0],
  }, {
    size: 56,
    activationFunc: 'relu',
  }, {
    size: trainingSet.output.shape[0],
    activationFunc: 'softmax',
  }], 0, 1, 0.01);

  const parameters = train(
    trainingSet.input,
    trainingSet.output,
    initialParameters,
    'cross-entropy',
    learningRate,
    numOfIterations,
    baseIterationToShowCost,
    learningRateDecayRate,
  );

  // predict(
  //   trainingSet.input,
  //   trainingSet.output,
  //   parameters,
  //   'training',
  // );
  // predict(
  //   testSet.input,
  //   testSet.output,
  //   parameters,
  //   'test',
  // );
}
