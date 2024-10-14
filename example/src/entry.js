/**
 * This is a very minimal example showcasing various features of the Yoha engine.
 * The example creates a colored box that can be moved using hand movements. Performing
 * a pinch or fist gesture changes the color of the cursor.
 */
import * as yoha from '@handtracking.io/yoha';

export async function DownloadModels(progressCb) {
    const modelFiles = await yoha.DownloadMultipleYohaTfjsModelBlobs(
      './box/model.json', 
      './lan/model.json', 
      (rec, total) => {
        if (typeof progressCb === 'function') {
          progressCb(rec / total);
        }
      }
    );
    return modelFiles;
}

export async function CreateStream() {
  // Setup video feed.
  const streamRes = await yoha.CreateMaxFpsMaxResStream();
  if (streamRes.error) { 
    // Non-production ready error handling...
    console.error(streamRes.error);
    throw streamRes.error;
  }
  const video = yoha.CreateVideoElementFromStream(streamRes.stream);
  return video;
}

export function Run(modelFiles, video, processCb) {
  // Note the 'wasmPath' argument. This has to be in sync with how you serve the respective
  // files. See webpack.config.js for an example.
  const wasmConfig = {
    wasmPaths: './node_modules/@tensorflow/tfjs-backend-wasm/dist/'
  };
 
  const thresholds = yoha.RecommendedHandPoseProbabilityThresholds;
 
  // Run engine.
  // We configure small padding to avoid that users move their hand outside webcam view
  // when trying to move the cursor towards the border of the viewport.
  yoha.StartTfjsWasmEngine({padding: 0.05}, wasmConfig, video, modelFiles, res => {
    if (res.isHandPresentProb < thresholds.IS_HAND_PRESENT) {
      processCb(false, {}, false, false);
      return;
    }

    if (res.poses.fistProb > thresholds.FIST) {
      processCb(true, res.coordinates, true, false);
    } else if (res.poses.pinchProb > thresholds.PINCH) {
      processCb(true, res.coordinates, false, true);
    } else {
      processCb(true, res.coordinates, false, false);
    }
  });
}