const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('fileInput');
const progressElement = document.getElementById('progress');
const lossChartCtx = document.getElementById('lossChart').getContext('2d');
const certaintyChartCtx = document.getElementById('certaintyChart').getContext('2d');
let model;
let trainingData = [];
let isTraining = false;
let generationInterval;

// Configuration parameters - centralized for easy modification
const CONFIG = {
  IMAGE_SIZE: 128,
  NOISE_DIM: 100,
  EPOCHS: 100,
  GENERATION_STEPS: 50,
  GENERATION_STEP_INTERVAL: 50, // ms between steps
  LEARNING_RATE: 0.001,
  GENERATION_STEP_SIZE: 0.1 // How fast the generation evolves
};

// UI state management
const UI = {
  disableButtons() {
    document.querySelectorAll('button').forEach(button => button.disabled = true);
    progressElement.innerText = 'Training in progress...';
    progressElement.classList.add('active');
  },
  
  enableButtons() {
    document.querySelectorAll('button').forEach(button => button.disabled = false);
    progressElement.classList.remove('active');
  },
  
  updateProgress(message) {
    progressElement.innerText = message;
  },
  
  showError(message) {
    progressElement.innerText = `Error: ${message}`;
    progressElement.classList.add('error');
    setTimeout(() => progressElement.classList.remove('error'), 3000);
  }
};

// Initialize charts
const charts = {
  loss: new Chart(lossChartCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Loss',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 0 // Disable animation for better performance during training
      },
      scales: {
        x: {
          title: { display: true, text: 'Epochs' }
        },
        y: {
          title: { display: true, text: 'Loss' }
        }
      }
    }
  }),
  
  certainty: new Chart(certaintyChartCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Certainty (1 - Pixel Change)',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 0
      },
      scales: {
        x: {
          title: { display: true, text: 'Steps' }
        },
        y: {
          title: { display: true, text: 'Certainty Score' },
          min: 0,
          max: 1
        }
      }
    }
  })
};

// Model management
const modelManager = {
  // Create the model with improved architecture
  async create() {
    if (model) {
      model.dispose(); // Clean up memory from old model
    }
    
    model = tf.sequential();
    
    // Deeper architecture with more regularization
    model.add(tf.layers.dense({
      inputShape: [CONFIG.NOISE_DIM],
      units: 256,
      activation: 'ReLU',
      kernelRegularizer: tf.regularizers.l2({ l2: 1e-5 })
    }));
    
    model.add(tf.layers.dropout({ rate: 0.3 }));
    
    model.add(tf.layers.dense({
      units: 512,
      activation: 'ReLU',
      kernelRegularizer: tf.regularizers.l2({ l2: 1e-5 })
    }));
    
    model.add(tf.layers.dropout({ rate: 0.3 }));
    
    model.add(tf.layers.dense({
      units: 1024,
      activation: 'ReLU',
      kernelRegularizer: tf.regularizers.l2({ l2: 1e-5 })
    }));
    
    model.add(tf.layers.dense({
      units: CONFIG.IMAGE_SIZE * CONFIG.IMAGE_SIZE * 3,
      activation: 'sigmoid'
    }));
    
    // Use Adam optimizer with configurable learning rate
    const optimizer = tf.train.adam(CONFIG.LEARNING_RATE);
    
    model.compile({
      optimizer,
      loss: 'meanSquaredError'
    });
    
    return model;
  },
  
  // Save model with error handling
  async save() {
    if (!model) {
      UI.showError("No model to save");
      return false;
    }
    
    try {
      await model.save('indexeddb://my-model');
      UI.updateProgress("Model saved successfully");
      return true;
    } catch (error) {
      console.error("Failed to save model:", error);
      UI.showError("Failed to save model");
      return false;
    }
  },
  
  // Load model with error handling
  async load() {
    try {
      model = await tf.loadLayersModel('indexeddb://my-model');
      UI.updateProgress("Model loaded successfully");
      return true;
    } catch (error) {
      console.error("Failed to load model:", error);
      UI.showError("No saved model found");
      return false;
    }
  }
};

// Image processing utilities
const imageUtils = {
  // Process an image and return tensor data
  async processImage(imgElement) {
    return tf.tidy(() => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = CONFIG.IMAGE_SIZE;
      tempCanvas.height = CONFIG.IMAGE_SIZE;
      const tempCtx = tempCanvas.getContext('2d');
      
      // Draw and resize image to our target size
      tempCtx.drawImage(imgElement, 0, 0, CONFIG.IMAGE_SIZE, CONFIG.IMAGE_SIZE);
      
      // Get image data
      const imageData = tempCtx.getImageData(0, 0, CONFIG.IMAGE_SIZE, CONFIG.IMAGE_SIZE);
      
      // Convert to tensor and normalize
      return tf.browser.fromPixels(imageData)
        .div(255)
        .reshape([CONFIG.IMAGE_SIZE * CONFIG.IMAGE_SIZE * 3]);
    });
  },
  
  // Render a tensor as an image on canvas
  renderImage(tensor) {
    const pixelData = tensor.reshape([CONFIG.IMAGE_SIZE, CONFIG.IMAGE_SIZE, 3]).dataSync();
    const imageData = ctx.createImageData(CONFIG.IMAGE_SIZE, CONFIG.IMAGE_SIZE);
    
    for (let i = 0; i < CONFIG.IMAGE_SIZE * CONFIG.IMAGE_SIZE; i++) {
      imageData.data[i * 4] = pixelData[i * 3] * 255;
      imageData.data[i * 4 + 1] = pixelData[i * 3 + 1] * 255;
      imageData.data[i * 4 + 2] = pixelData[i * 3 + 2] * 255;
      imageData.data[i * 4 + 3] = 255;
    }
    
    // Create an offscreen canvas for the initial rendering
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = CONFIG.IMAGE_SIZE;
    offscreenCanvas.height = CONFIG.IMAGE_SIZE;
    const offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.putImageData(imageData, 0, 0);
    
    // Draw the image to the main canvas with scaling
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
  },
  
  // Download the current canvas image
  downloadCanvasImage() {
    const link = document.createElement('a');
    link.download = `ai-generated-${new Date().toISOString()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
};

// Training functionality
async function loadImages() {
  const files = fileInput.files;
  if (!files.length) {
    UI.showError("No files selected");
    return [];
  }
  
  UI.updateProgress(`Loading ${files.length} images...`);
  
  // Clear previous training data and release memory
  if (trainingData.length > 0) {
    trainingData.forEach(tensor => tensor.dispose());
    trainingData = [];
  }
  
  const promises = Array.from(files).map(file => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error(`File ${file.name} is not an image`));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = async function() {
          try {
            const tensor = await imageUtils.processImage(img);
            resolve(tensor);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error(`Failed to load ${file.name}`));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });
  });
  
  try {
    const results = await Promise.all(promises);
    trainingData = results;
    UI.updateProgress(`Successfully loaded ${trainingData.length} images`);
    return trainingData;
  } catch (error) {
    console.error('Error loading images:', error);
    UI.showError(error.message);
    return [];
  }
}

async function trainModel() {
  if (isTraining) {
    UI.showError("Training already in progress");
    return;
  }
  
  if (trainingData.length === 0) {
    UI.showError("No training data loaded");
    return;
  }
  
  isTraining = true;
  UI.disableButtons();
  
  try {
    if (!model) {
      await modelManager.create();
    }
    
    // Reset chart data
    charts.loss.data.labels = [];
    charts.loss.data.datasets[0].data = [];
    charts.loss.update();
    
    // Create a single tensor from all training images
    const targetsTensor = tf.stack(trainingData);
    
    // Generate noise for training
    const noiseTensor = tf.randomNormal([trainingData.length, CONFIG.NOISE_DIM]);
    
    UI.updateProgress("Starting training...");
    
    // Train the model
    await model.fit(noiseTensor, targetsTensor, {
      epochs: CONFIG.EPOCHS,
      batchSize: Math.min(32, trainingData.length),
      shuffle: true,
      callbacks: {
        onEpochBegin: (epoch) => {
          if (epoch % 10 === 0) {
            UI.updateProgress(`Training epoch ${epoch + 1}/${CONFIG.EPOCHS}`);
          }
        },
        onEpochEnd: (epoch, logs) => {
          const loss = logs.loss.toFixed(4);
          
          if (epoch % 5 === 0 || epoch === CONFIG.EPOCHS - 1) {
            UI.updateProgress(`Epoch ${epoch + 1}/${CONFIG.EPOCHS}: Loss = ${loss}`);
            
            // Update chart
            charts.loss.data.labels.push(epoch + 1);
            charts.loss.data.datasets[0].data.push(logs.loss);
            charts.loss.update();
            
            // Generate a sample image every 10 epochs
            if (epoch % 10 === 0 || epoch === CONFIG.EPOCHS - 1) {
              generateSampleImage();
            }
          }
        }
      }
    });
    
    // Clean up tensors
    targetsTensor.dispose();
    noiseTensor.dispose();
    
    UI.updateProgress("Training complete");
    await modelManager.save(); // Auto-save after training
  } catch (error) {
    console.error("Training error:", error);
    UI.showError("Training failed: " + error.message);
  } finally {
    isTraining = false;
    UI.enableButtons();
  }
}

// Generate a quick sample image without animation
async function generateSampleImage() {
  if (!model) {
    try {
      const loaded = await modelManager.load();
      if (!loaded) {
        await modelManager.create();
      }
    } catch (error) {
      UI.showError("Failed to initialize model");
      return;
    }
  }
  
  tf.tidy(() => {
    const noise = tf.randomNormal([1, CONFIG.NOISE_DIM]);
    const output = model.predict(noise);
    imageUtils.renderImage(output);
  });
}

// Generate an image with animated steps and certainty tracking
async function generateImage() {
  if (generationInterval) {
    clearInterval(generationInterval);
    generationInterval = null;
    UI.updateProgress("Generation stopped");
    UI.enableButtons();
    return;
  }
  
  if (!model) {
    try {
      const loaded = await modelManager.load();
      if (!loaded) {
        await modelManager.create();
      }
    } catch (error) {
      UI.showError("Failed to initialize model");
      return;
    }
  }
  
  UI.disableButtons();
  document.getElementById('generateBtn').disabled = false;
  document.getElementById('generateBtn').innerText = 'Stop Generation';
  
  // Reset certainty chart
  charts.certainty.data.labels = [];
  charts.certainty.data.datasets[0].data = [];
  charts.certainty.update();
  
  let step = 0;
  let noise = tf.randomNormal([1, CONFIG.NOISE_DIM]);
  let currentImage = tf.randomNormal([1, CONFIG.IMAGE_SIZE * CONFIG.IMAGE_SIZE * 3]);
  let previousImage = null;
  
  UI.updateProgress("Generating image...");
  
  generationInterval = setInterval(() => {
    tf.tidy(() => {
      if (step >= CONFIG.GENERATION_STEPS) {
        clearInterval(generationInterval);
        generationInterval = null;
        UI.updateProgress("Generation complete");
        UI.enableButtons();
        document.getElementById('generateBtn').innerText = 'Generate Image';
        return;
      }
      
      // Generate and update the image
      const output = model.predict(noise);
      currentImage = tf.add(
        currentImage,
        tf.sub(output, currentImage).mul(CONFIG.GENERATION_STEP_SIZE)
      );
      
      // Calculate certainty measure if we have a previous image
      if (previousImage) {
        const change = tf.mean(tf.abs(tf.sub(currentImage, previousImage))).dataSync()[0];
        const certainty = 1 - Math.min(change * 10, 1); // Scale for better visualization
        
        charts.certainty.data.labels.push(step + 1);
        charts.certainty.data.datasets[0].data.push(certainty);
        charts.certainty.update();
        
        UI.updateProgress(`Generating image: Step ${step + 1}/${CONFIG.GENERATION_STEPS} (Certainty: ${(certainty * 100).toFixed(1)}%)`);
        
        previousImage.dispose();
      } else {
        UI.updateProgress(`Generating image: Step ${step + 1}/${CONFIG.GENERATION_STEPS}`);
      }
      
      // Clone current image for next comparison
      previousImage = currentImage.clone();
      
      // Render current state
      imageUtils.renderImage(currentImage);
      
      step++;
    });
  }, CONFIG.GENERATION_STEP_INTERVAL);
}

// Initialize the application
async function init() {
  try {
    // Make sure the canvas is properly sized
    canvas.width = 256;
    canvas.height = 256;
    
    // Try to load the model
    await modelManager.load().catch(() => {
      UI.updateProgress("No saved model found. Train or load a model to get started.");
    });
    
    // Add UI event listeners
    document.getElementById('fileInput').addEventListener('change', loadImages);
    document.getElementById('trainBtn').addEventListener('click', trainModel);
    document.getElementById('generateBtn').addEventListener('click', generateImage);
    document.getElementById('saveBtn').addEventListener('click', modelManager.save);
    document.getElementById('loadBtn').addEventListener('click', modelManager.load);
    document.getElementById('downloadBtn').addEventListener('click', imageUtils.downloadCanvasImage);
    
    // Enable WebGL acceleration if available
    await tf.setBackend('webgl');
    UI.updateProgress(`TensorFlow.js initialized with ${tf.getBackend()} backend`);
  } catch (error) {
    console.error("Initialization error:", error);
    UI.showError("Failed to initialize: " + error.message);
  }
}

// Start application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}