// Module Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const moduleId = btn.dataset.module;
        
        // Update active button
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active module
        document.querySelectorAll('.module-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`module${moduleId}`).classList.add('active');
    });
});

// Toggle Topics
function toggleTopic(header) {
    const card = header.parentElement;
    card.classList.toggle('active');
    
    // Auto-draw visualizations when topic is expanded
    if (card.classList.contains('active')) {
        setTimeout(() => {
            // Check if loss surface canvas exists in this topic
            const lossSurface = card.querySelector('#lossSurface');
            if (lossSurface && !lossSurface.dataset.drawn) {
                animateLossSurface();
                lossSurface.dataset.drawn = 'true';
            }
            
            // Check if comparison networks exist
            const fcCanvas = card.querySelector('#fcNetworkCanvas');
            const convCanvas = card.querySelector('#convNetworkCanvas');
            if (fcCanvas && convCanvas && !fcCanvas.dataset.drawn) {
                drawComparisonNetworks();
                fcCanvas.dataset.drawn = 'true';
                convCanvas.dataset.drawn = 'true';
            }
        }, 300);
    }
}

// Feedforward Network Animation
function animateFeedforward() {
    const neurons = document.querySelectorAll('.neuron');
    neurons.forEach((neuron, index) => {
        setTimeout(() => {
            neuron.classList.add('active');
            setTimeout(() => neuron.classList.remove('active'), 1000);
        }, index * 300);
    });
}

// Loss Curve Animation
function animateLossCurve() {
    const canvas = document.getElementById('lossCurve');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '14px Arial';
    ctx.fillText('Loss', 10, 30);
    ctx.fillText('Iterations', width - 100, height - 10);
    
    // Animate loss curve
    let iteration = 0;
    const points = [];
    const maxIterations = 100;
    
    function draw() {
        if (iteration < maxIterations) {
            const x = 50 + (iteration / maxIterations) * (width - 70);
            const loss = Math.exp(-iteration / 20) * (height - 60) + 20;
            points.push({x, y: loss});
            
            ctx.strokeStyle = '#ec4899';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
            
            iteration++;
            requestAnimationFrame(draw);
        }
    }
    
    draw();
}

// Backpropagation Animation
function animateBackprop() {
    const forwardPass = document.querySelector('.forward-arrow');
    const backwardPass = document.querySelector('.backward-arrow');
    
    if (forwardPass && backwardPass) {
        forwardPass.style.animation = 'none';
        backwardPass.style.animation = 'none';
        
        setTimeout(() => {
            forwardPass.style.animation = 'slide 1s ease-in-out infinite';
            setTimeout(() => {
                backwardPass.style.animation = 'slide 1s ease-in-out infinite';
            }, 2000);
        }, 10);
    }
}

// Dropout Animation
function animateDropout() {
    const neurons = document.querySelectorAll('.dropout-neuron');
    neurons.forEach((neuron, index) => {
        if (Math.random() > 0.5) {
            setTimeout(() => {
                neuron.classList.add('dropped');
                setTimeout(() => {
                    neuron.classList.remove('dropped');
                }, 2000);
            }, index * 200);
        }
    });
}

// Early Stopping Chart
function drawEarlyStopChart() {
    const canvas = document.getElementById('earlyStopChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(30, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.stroke();
    
    // Training curve
    ctx.strokeStyle = '#4facfe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < width - 50; i++) {
        const x = 30 + i;
        const y = 20 + Math.exp(-i / 100) * (height - 50);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Validation curve
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < width - 50; i++) {
        const x = 30 + i;
        let y = 20 + Math.exp(-i / 120) * (height - 50);
        if (i > 150) y += (i - 150) * 0.5; // Overfitting after point
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Early stopping line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(180, 20);
    ctx.lineTo(180, height - 30);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#f59e0b';
    ctx.font = '12px Arial';
    ctx.fillText('Early Stop', 185, 40);
}

// Loss Surface Animation
function animateLossSurface() {
    const canvas = document.getElementById('lossSurface');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(30, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '12px Arial';
    ctx.fillText('Loss', 10, 25);
    ctx.fillText('Parameter Space', width / 2 - 60, height - 10);
    
    // Draw 3D-like loss surface (contour map style)
    const imageData = ctx.createImageData(width - 50, height - 50);
    const data = imageData.data;
    const imgWidth = width - 50;
    const imgHeight = height - 50;
    
    for (let y = 0; y < imgHeight; y++) {
        for (let x = 0; x < imgWidth; x++) {
            const idx = (y * imgWidth + x) * 4;
            const nx = (x / imgWidth) * 6 - 3;
            const ny = (y / imgHeight) * 6 - 3;
            
            // Create a complex loss surface with multiple features
            const d1 = Math.sin(nx * 2) * Math.cos(ny * 2) * 30;
            const d2 = Math.sin(nx * 0.5) * Math.cos(ny * 0.5) * 40;
            const d3 = (nx * nx + ny * ny) * 5; // Saddle point effect
            const d = d1 + d2 - d3;
            const val = Math.max(0, Math.min(255, 100 + d));
            
            // Color gradient: blue (low) to red (high)
            const intensity = val / 255;
            data[idx] = Math.min(255, intensity * 255);     // R
            data[idx + 1] = Math.min(255, intensity * 150); // G
            data[idx + 2] = Math.min(255, (1 - intensity) * 255 + 100); // B
            data[idx + 3] = 255; // A
        }
    }
    
    ctx.putImageData(imageData, 30, 20);
    
    // Draw contour lines
    ctx.strokeStyle = 'rgba(241, 245, 249, 0.3)';
    ctx.lineWidth = 1;
    for (let level = 0; level < 10; level++) {
        const threshold = 80 + level * 15;
        ctx.beginPath();
        for (let y = 0; y < imgHeight; y += 2) {
            for (let x = 0; x < imgWidth; x += 2) {
                const nx = (x / imgWidth) * 6 - 3;
                const ny = (y / imgHeight) * 6 - 3;
                const d1 = Math.sin(nx * 2) * Math.cos(ny * 2) * 30;
                const d2 = Math.sin(nx * 0.5) * Math.cos(ny * 0.5) * 40;
                const d3 = (nx * nx + ny * ny) * 5;
                const d = d1 + d2 - d3;
                const val = 100 + d;
                if (Math.abs(val - threshold) < 5) {
                    if (x === 0 || y === 0) ctx.moveTo(30 + x, 20 + y);
                    else ctx.lineTo(30 + x, 20 + y);
                }
            }
        }
        ctx.stroke();
    }
    
    // Mark Saddle Point (center)
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Mark Local Minima
    const localMin1X = width / 3;
    const localMin1Y = height / 3;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(localMin1X, localMin1Y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    const localMin2X = width * 2 / 3;
    const localMin2Y = height * 2 / 3;
    ctx.beginPath();
    ctx.arc(localMin2X, localMin2Y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw vanishing/exploding gradient arrows
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#f59e0b';
    
    // Vanishing gradients (small arrows near center)
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const startX = centerX + Math.cos(angle) * 30;
        const startY = centerY + Math.sin(angle) * 30;
        const endX = startX + Math.cos(angle) * 5;
        const endY = startY + Math.sin(angle) * 5;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - Math.cos(angle - 0.5) * 5, endY - Math.sin(angle - 0.5) * 5);
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - Math.cos(angle + 0.5) * 5, endY - Math.sin(angle + 0.5) * 5);
        ctx.stroke();
    }
    
    // Exploding gradients (large arrows near edges)
    ctx.strokeStyle = '#ec4899';
    ctx.fillStyle = '#ec4899';
    const edgePoints = [
        {x: 100, y: 80, angle: Math.PI / 4},
        {x: width - 100, y: 80, angle: 3 * Math.PI / 4},
        {x: 100, y: height - 80, angle: -Math.PI / 4},
        {x: width - 100, y: height - 80, angle: -3 * Math.PI / 4}
    ];
    
    edgePoints.forEach(point => {
        const endX = point.x + Math.cos(point.angle) * 20;
        const endY = point.y + Math.sin(point.angle) * 20;
        
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - Math.cos(point.angle - 0.5) * 8, endY - Math.sin(point.angle - 0.5) * 8);
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - Math.cos(point.angle + 0.5) * 8, endY - Math.sin(point.angle + 0.5) * 8);
        ctx.stroke();
    });
    
    // Labels
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Saddle Point', centerX - 35, centerY - 15);
    ctx.fillStyle = '#10b981';
    ctx.fillText('Local Minima', localMin1X - 35, localMin1Y - 15);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('Vanishing Gradients', centerX - 60, centerY + 60);
    ctx.fillStyle = '#ec4899';
    ctx.fillText('Exploding Gradients', width - 180, height - 100);
    
    // Cliff region annotation
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(width - 150, 150, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Cliff Region', width - 180, 110);
}

// Optimizer Comparison
function animateOptimizers() {
    const canvas = document.getElementById('optimizerComparison');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 30);
    ctx.lineTo(50, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.stroke();
    
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '12px Arial';
    ctx.fillText('Loss', 10, 35);
    ctx.fillText('Iterations', width - 100, height - 10);
    
    const optimizers = [
        {name: 'SGD', color: '#ef4444', path: []},
        {name: 'AdaGrad', color: '#f59e0b', path: []},
        {name: 'RMSProp', color: '#10b981', path: []},
        {name: 'Adam', color: '#6366f1', path: []}
    ];
    
    // Generate paths
    for (let i = 0; i < 100; i++) {
        const x = 50 + (i / 100) * (width - 70);
        optimizers[0].path.push({x, y: height - 30 - Math.exp(-i / 25) * (height - 60) + Math.sin(i / 5) * 10});
        optimizers[1].path.push({x, y: height - 30 - Math.exp(-i / 30) * (height - 60) + 5});
        optimizers[2].path.push({x, y: height - 30 - Math.exp(-i / 20) * (height - 60) + 3});
        optimizers[3].path.push({x, y: height - 30 - Math.exp(-i / 15) * (height - 60)});
    }
    
    // Draw paths
    optimizers.forEach((opt, idx) => {
        ctx.strokeStyle = opt.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        opt.path.forEach((point, i) => {
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        
        // Label
        ctx.fillStyle = opt.color;
        ctx.font = 'bold 14px Arial';
        ctx.fillText(opt.name, width - 150, 50 + idx * 25);
    });
}

// Optimizer Tabs
document.querySelectorAll('.opt-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const optimizerId = tab.dataset.optimizer;
        
        document.querySelectorAll('.opt-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.optimizer-content').forEach(c => c.classList.remove('active'));
        document.getElementById(optimizerId).classList.add('active');
    });
});

// Data Types Tabs
document.querySelectorAll('.data-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const dataType = tab.dataset.type;
        
        document.querySelectorAll('.data-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.data-content').forEach(c => c.classList.remove('active'));
        document.getElementById(dataType).classList.add('active');
        
        // Draw appropriate visualization
        drawDataTypeVisualization(dataType);
    });
});

function drawDataTypeVisualization(type) {
    if (type === '1d') {
        draw1DData();
    } else if (type === '2d') {
        draw2DData();
    } else if (type === '3d') {
        draw3DData();
    }
}

function draw1DData() {
    const canvas = document.getElementById('data1d');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#4facfe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const centerY = height / 2;
    for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x / 20) * 50 + Math.cos(x / 10) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '14px Arial';
    ctx.fillText('Audio Waveform / Time Series', 10, 30);
}

function draw2DData() {
    const canvas = document.getElementById('data2d');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw a simple image representation
    const gridSize = 20;
    for (let y = 0; y < height; y += gridSize) {
        for (let x = 0; x < width; x += gridSize) {
            const intensity = Math.sin(x / 50) * Math.cos(y / 50);
            ctx.fillStyle = `rgb(${128 + intensity * 127}, ${128 + intensity * 127}, 255)`;
            ctx.fillRect(x, y, gridSize, gridSize);
        }
    }
    
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '14px Arial';
    ctx.fillText('2D Image', 10, 30);
}

function draw3DData() {
    const canvas = document.getElementById('data3d');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw 3D representation (stack of 2D slices)
    const sliceHeight = height / 5;
    for (let slice = 0; slice < 5; slice++) {
        const y = slice * sliceHeight;
        ctx.fillStyle = `rgba(79, 172, 254, ${0.3 + slice * 0.15})`;
        ctx.fillRect(50, y, width - 100, sliceHeight - 10);
        ctx.strokeStyle = '#4facfe';
        ctx.strokeRect(50, y, width - 100, sliceHeight - 10);
    }
    
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '14px Arial';
    ctx.fillText('3D Volumetric Data (Video / Medical Scans)', 10, 30);
}

// Weight Initialization
function showXavierInit() {
    const canvas = document.getElementById('weightInit');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Xavier Initialization (tanh/sigmoid)', width / 2 - 150, 30);
    
    // Draw normal distribution
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const val = (x / width - 0.5) * 4;
        const y = height / 2 + Math.exp(-val * val / 2) * -150;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Mean line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function showHeInit() {
    const canvas = document.getElementById('weightInit');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('He Initialization (ReLU)', width / 2 - 100, 30);
    
    // Draw shifted distribution (for ReLU)
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const val = (x / width - 0.3) * 4;
        if (val < 0) {
            const y = height / 2;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        } else {
            const y = height / 2 + Math.exp(-val * val / 2) * -150;
            if (x === 0 || val === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

// Convolution Animation
function animateConvolution() {
    const canvas = document.getElementById('convCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw input image (grid)
    const gridSize = 20;
    const inputX = 50;
    const inputY = 50;
    const inputWidth = 200;
    const inputHeight = 200;
    
    // Input grid
    for (let y = 0; y < inputHeight; y += gridSize) {
        for (let x = 0; x < inputWidth; x += gridSize) {
            const intensity = Math.random() > 0.5 ? 200 : 50;
            ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
            ctx.fillRect(inputX + x, inputY + y, gridSize, gridSize);
        }
    }
    
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '14px Arial';
    ctx.fillText('Input', inputX, inputY - 10);
    
    // Kernel
    const kernelSize = 60;
    const kernelX = inputX + inputWidth + 50;
    const kernelY = inputY;
    
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(kernelX, kernelY, kernelSize, kernelSize);
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 2;
    ctx.strokeRect(kernelX, kernelY, kernelSize, kernelSize);
    
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '14px Arial';
    ctx.fillText('Kernel', kernelX, kernelY - 10);
    
    // Output feature map
    const outputX = inputX;
    const outputY = inputY + inputHeight + 50;
    const outputWidth = inputWidth - 40;
    const outputHeight = inputHeight - 40;
    
    // Animate convolution
    let frame = 0;
    function animate() {
        ctx.clearRect(outputX, outputY, outputWidth, outputHeight);
        
        const offsetX = (frame % 9) * gridSize;
        const offsetY = Math.floor(frame / 9) * gridSize;
        
        // Draw current position
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 3;
        ctx.strokeRect(inputX + offsetX, inputY + offsetY, kernelSize, kernelSize);
        
        // Draw output so far
        for (let y = 0; y < outputHeight; y += gridSize - 5) {
            for (let x = 0; x < outputWidth; x += gridSize - 5) {
                if (y < offsetY || (y === offsetY && x < offsetX)) {
                    const val = Math.random() > 0.5 ? 150 : 100;
                    ctx.fillStyle = `rgb(${val}, ${val}, 255)`;
                    ctx.fillRect(outputX + x, outputY + y, gridSize - 5, gridSize - 5);
                }
            }
        }
        
        if (frame < 80) {
            frame++;
            setTimeout(animate, 50);
        }
    }
    
    animate();
    
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '14px Arial';
    ctx.fillText('Feature Map (Output)', outputX, outputY - 10);
}

function resetConvolution() {
    const canvas = document.getElementById('convCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Pooling Animation
function animatePooling() {
    const canvas = document.getElementById('poolingCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw input feature map
    const gridSize = 40;
    const inputX = 50;
    const inputY = 50;
    const inputWidth = 200;
    const inputHeight = 200;
    
    const values = [];
    for (let y = 0; y < inputHeight / gridSize; y++) {
        values[y] = [];
        for (let x = 0; x < inputWidth / gridSize; x++) {
            values[y][x] = Math.floor(Math.random() * 255);
            ctx.fillStyle = `rgb(${values[y][x]}, ${values[y][x]}, 255)`;
            ctx.fillRect(inputX + x * gridSize, inputY + y * gridSize, gridSize, gridSize);
            ctx.strokeStyle = '#f1f5f9';
            ctx.lineWidth = 1;
            ctx.strokeRect(inputX + x * gridSize, inputY + y * gridSize, gridSize, gridSize);
            ctx.fillStyle = '#f1f5f9';
            ctx.font = '14px Arial';
            ctx.fillText(values[y][x], inputX + x * gridSize + 10, inputY + y * gridSize + 25);
        }
    }
    
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Input Feature Map', inputX, inputY - 20);
    
    // Draw max pooling result
    const poolX = inputX + inputWidth + 50;
    const poolY = inputY;
    const poolSize = gridSize * 2;
    
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Max Pooling (2x2)', poolX, poolY - 20);
    
    for (let y = 0; y < inputHeight / gridSize / 2; y++) {
        for (let x = 0; x < inputWidth / gridSize / 2; x++) {
            const maxVal = Math.max(
                values[y * 2][x * 2],
                values[y * 2][x * 2 + 1],
                values[y * 2 + 1][x * 2],
                values[y * 2 + 1][x * 2 + 1]
            );
            
            ctx.fillStyle = `rgb(${maxVal}, ${maxVal}, 255)`;
            ctx.fillRect(poolX + x * poolSize, poolY + y * poolSize, poolSize, poolSize);
            ctx.strokeStyle = '#ec4899';
            ctx.lineWidth = 3;
            ctx.strokeRect(poolX + x * poolSize, poolY + y * poolSize, poolSize, poolSize);
            ctx.fillStyle = '#f1f5f9';
            ctx.font = 'bold 18px Arial';
            ctx.fillText(maxVal, poolX + x * poolSize + 20, poolY + y * poolSize + 40);
        }
    }
}

// Structured Output
function animateStructuredOutput() {
    const canvas = document.getElementById('structuredOutput');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw original image
    const imgSize = 150;
    const imgX = 50;
    const imgY = 50;
    
    // Simple image representation
    for (let y = 0; y < imgSize; y += 10) {
        for (let x = 0; x < imgSize; x += 10) {
            const val = Math.sin(x / 20) * Math.cos(y / 20);
            ctx.fillStyle = `rgb(${128 + val * 127}, ${128 + val * 127}, 255)`;
            ctx.fillRect(imgX + x, imgY + y, 10, 10);
        }
    }
    
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '14px Arial';
    ctx.fillText('Input Image', imgX, imgY - 10);
    
    // Draw segmentation mask
    const maskX = imgX + imgSize + 50;
    const maskY = imgY;
    
    const colors = ['#ef4444', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];
    for (let y = 0; y < imgSize; y += 10) {
        for (let x = 0; x < imgSize; x += 10) {
            const classIdx = Math.floor((x + y) / 30) % colors.length;
            ctx.fillStyle = colors[classIdx];
            ctx.fillRect(maskX + x, maskY + y, 10, 10);
        }
    }
    
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '14px Arial';
    ctx.fillText('Segmentation Mask', maskX, maskY - 10);
    
    // Legend
    const legendX = imgX;
    const legendY = imgY + imgSize + 30;
    colors.forEach((color, idx) => {
        ctx.fillStyle = color;
        ctx.fillRect(legendX + idx * 80, legendY, 30, 20);
        ctx.fillStyle = '#f1f5f9';
        ctx.font = '12px Arial';
        ctx.fillText(`Class ${idx + 1}`, legendX + idx * 80 + 35, legendY + 15);
    });
}

// Draw Comparison Networks (FC vs Conv)
function drawComparisonNetworks() {
    // Draw Fully Connected Network
    const fcCanvas = document.getElementById('fcNetworkCanvas');
    if (fcCanvas) {
        const ctx = fcCanvas.getContext('2d');
        const width = fcCanvas.width;
        const height = fcCanvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Input layer
        const inputY = height / 4;
        const inputX = width / 6;
        const inputNodes = 4;
        const nodeSize = 20;
        const spacing = 35;
        
        const inputPositions = [];
        for (let i = 0; i < inputNodes; i++) {
            const y = inputY - (inputNodes - 1) * spacing / 2 + i * spacing;
            inputPositions.push({x: inputX, y: y});
            
            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            ctx.arc(inputX, y, nodeSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Output layer
        const outputY = height * 3 / 4;
        const outputX = width * 5 / 6;
        const outputNodes = 3;
        
        const outputPositions = [];
        for (let i = 0; i < outputNodes; i++) {
            const y = outputY - (outputNodes - 1) * spacing / 2 + i * spacing;
            outputPositions.push({x: outputX, y: y});
            
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(outputX, y, nodeSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw all connections (fully connected)
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 1;
        inputPositions.forEach(input => {
            outputPositions.forEach(output => {
                ctx.beginPath();
                ctx.moveTo(input.x + nodeSize / 2, input.y);
                ctx.lineTo(output.x - nodeSize / 2, output.y);
                ctx.stroke();
            });
        });
        
        // Labels
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Input', inputX - 30, inputY - 70);
        ctx.fillText('Output', outputX - 35, outputY + 70);
        
        // Show constraint
        ctx.fillStyle = '#ef4444';
        ctx.font = '12px Arial';
        ctx.fillText('No constraints', width / 2 - 50, height - 10);
    }
    
    // Draw Convolutional Network
    const convCanvas = document.getElementById('convNetworkCanvas');
    if (convCanvas) {
        const ctx = convCanvas.getContext('2d');
        const width = convCanvas.width;
        const height = convCanvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Input layer (spatial grid)
        const inputY = height / 4;
        const inputX = width / 6;
        const gridSize = 4;
        const cellSize = 8;
        const cellSpacing = 12;
        
        // Draw input grid
        ctx.fillStyle = '#6366f1';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = inputX + j * cellSpacing;
                const y = inputY - gridSize * cellSpacing / 2 + i * cellSpacing;
                ctx.fillRect(x, y, cellSize, cellSize);
            }
        }
        
        // Feature map layer (smaller grid due to convolution)
        const featureY = height / 2;
        const featureX = width / 2;
        const featureGridSize = 3;
        
        // Draw feature map grid
        ctx.fillStyle = '#10b981';
        for (let i = 0; i < featureGridSize; i++) {
            for (let j = 0; j < featureGridSize; j++) {
                const x = featureX - featureGridSize * cellSpacing / 2 + j * cellSpacing;
                const y = featureY - featureGridSize * cellSpacing / 2 + i * cellSpacing;
                ctx.fillRect(x, y, cellSize, cellSize);
            }
        }
        
        // Output layer
        const outputY = height * 3 / 4;
        const outputX = width * 5 / 6;
        const outputNodes = 2;
        const nodeSize = 15;
        
        for (let i = 0; i < outputNodes; i++) {
            const y = outputY - (outputNodes - 1) * 30 / 2 + i * 30;
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(outputX, y, nodeSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw local connections (receptive field)
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 2;
        
        // Show receptive field for one feature
        const receptiveField = [
            {x: inputX + cellSpacing, y: inputY - cellSpacing},
            {x: inputX + cellSpacing * 2, y: inputY - cellSpacing},
            {x: inputX + cellSpacing, y: inputY},
            {x: inputX + cellSpacing * 2, y: inputY}
        ];
        
        const targetFeature = {
            x: featureX - cellSpacing,
            y: featureY - cellSpacing
        };
        
        receptiveField.forEach(point => {
            ctx.beginPath();
            ctx.moveTo(point.x + cellSize, point.y + cellSize);
            ctx.lineTo(targetFeature.x, targetFeature.y);
            ctx.stroke();
        });
        
        // Show shared weights indicator
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(featureX, featureY, 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Labels
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Input Grid', inputX - 40, inputY - 60);
        ctx.fillText('Feature Map', featureX - 45, featureY - 45);
        ctx.fillText('Output', outputX - 30, outputY + 40);
        
        // Show constraints
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('Local + Shared', featureX - 50, featureY + 50);
        ctx.font = '10px Arial';
        ctx.fillText('Translation Equivariant', featureX - 60, featureY + 65);
    }
}

// Filter Comparison
function compareFilters() {
    const canvas = document.getElementById('filterComparison');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Random filters
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Random Filters', 50, 30);
    
    const filterSize = 40;
    for (let i = 0; i < 5; i++) {
        for (let y = 0; y < filterSize; y += 5) {
            for (let x = 0; x < filterSize; x += 5) {
                const val = Math.random() > 0.5 ? 255 : 0;
                ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
                ctx.fillRect(50 + i * 60 + x, 50 + y, 5, 5);
            }
        }
    }
    
    // Learned filters
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Learned Filters', 50, 180);
    
    // Draw edge detection-like filters (learned)
    const patterns = [
        [[-1, -1, -1], [0, 0, 0], [1, 1, 1]], // horizontal edge
        [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], // vertical edge
        [[-1, -1, 0], [-1, 0, 1], [0, 1, 1]], // diagonal
        [[0, -1, 0], [-1, 5, -1], [0, -1, 0]], // sharpening
        [[1, 1, 1], [1, 1, 1], [1, 1, 1]] // blur
    ];
    
    patterns.forEach((pattern, i) => {
        const startX = 50 + i * 60;
        const startY = 200;
        const cellSize = filterSize / 3;
        
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const val = 128 + pattern[y][x] * 50;
                ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
                ctx.fillRect(startX + x * cellSize, startY + y * cellSize, cellSize, cellSize);
            }
        }
    });
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    drawEarlyStopChart();
    draw1DData();
    draw2DData();
    draw3DData();
    drawComparisonNetworks(); // Draw the comparison networks on load
    
    // Auto-expand first topic of each module
    document.querySelectorAll('.module-section').forEach(section => {
        const firstCard = section.querySelector('.topic-card');
        if (firstCard) {
            firstCard.classList.add('active');
        }
    });
});

