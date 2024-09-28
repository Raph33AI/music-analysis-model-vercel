import * as tf from '@tensorflow/tfjs';
import * as Meyda from 'meyda';

let model;
let scaler;

async function loadModel() {
  if (!model) {
    model = await tf.loadLayersModel('https://raw.githubusercontent.com/your-github-username/your-repo-name/main/model.json');
  }
  return model;
}

async function loadScaler() {
  if (!scaler) {
    const response = await fetch('https://raw.githubusercontent.com/your-github-username/your-repo-name/main/scaler.json');
    scaler = await response.json();
  }
  return scaler;
}

function scaleMFCC(mfcc, scaler) {
  return mfcc.map((value, index) => (value - scaler.mean[index]) / scaler.scale[index]);
}

export async function analyzeMusic(audioBuffer) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createBufferSource();
  source.buffer = await audioContext.decodeAudioData(audioBuffer);

  const analyser = Meyda.createMeydaAnalyzer({
    audioContext: audioContext,
    source: source,
    bufferSize: 512,
    featureExtractors: ['mfcc', 'rms', 'spectralCentroid', 'spectralFlatness', 'perceptualSpread', 'spectralRolloff'],
  });

  const features = [];
  const duration = 5; // Analyze 5 seconds
  const startTime = audioContext.currentTime;
  source.start();

  await new Promise((resolve) => {
    const collectFeatures = () => {
      if (audioContext.currentTime - startTime < duration) {
        const currentFeatures = analyser.get();
        if (currentFeatures) features.push(currentFeatures);
        requestAnimationFrame(collectFeatures);
      } else {
        source.stop();
        audioContext.close();
        resolve();
      }
    };
    collectFeatures();
  });

  const avgFeatures = Object.keys(features[0]).reduce((acc, key) => {
    acc[key] = features.reduce((sum, f) => sum + f[key], 0) / features.length;
    return acc;
  }, {});

  const model = await loadModel();
  const scaler = await loadScaler();
  const scaledMFCC = scaleMFCC(avgFeatures.mfcc, scaler);
  const input = tf.tensor2d([scaledMFCC]);
  const prediction = await model.predict(input).data();

  return {
    mfcc: avgFeatures.mfcc,
    rms: avgFeatures.rms,
    spectralCentroid: avgFeatures.spectralCentroid,
    spectralFlatness: avgFeatures.spectralFlatness,
    perceptualSpread: avgFeatures.perceptualSpread,
    spectralRolloff: avgFeatures.spectralRolloff,
    danceability: prediction[0],
    energy: prediction[1],
    valence: prediction[2]
  };
}
