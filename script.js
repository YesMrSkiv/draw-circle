let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let isDrawing = false;
let points = [];

// Start Game Function
function startGame() {
    document.querySelector('.start-screen').style.display = 'none';
    document.querySelector('.game-screen').style.display = 'flex';
}

// Start drawing when mouse is down
canvas.addEventListener('mousedown', () => {
    isDrawing = true;
    points = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas when starting new circle
});

// Stop drawing when mouse is up
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    evaluateCircle(); // Call the evaluation function
});

// Collect drawing points as mouse moves
canvas.addEventListener('mousemove', (event) => {
    if (!isDrawing) return;
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    points.push({ x: x, y: y });

    // Draw the line connecting the points
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.stroke();
    }
});

// Evaluate how close the shape is to a perfect circle
function evaluateCircle() {
    if (points.length < 10) {
        document.getElementById('percentage').innerText = 'Please draw a full circle!';
        return;
    }

    // Find the center of the circle (average of the points)
    let sumX = 0, sumY = 0;
    points.forEach(point => {
        sumX += point.x;
        sumY += point.y;
    });

    let centerX = sumX / points.length;
    let centerY = sumY / points.length;

    // Calculate the average radius from center
    let totalDistance = 0;
    points.forEach(point => {
        totalDistance += Math.sqrt(Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2));
    });

    let averageRadius = totalDistance / points.length;

    // Calculate the variance from the average radius
    let variance = 0;
    points.forEach(point => {
        let distance = Math.sqrt(Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2));
        variance += Math.pow(distance - averageRadius, 2);
    });

    let score = 100 - (variance / points.length);
    score = Math.max(0, Math.min(100, score));  // Keep score between 0 and 100

    // Display the accuracy percentage
    document.getElementById('percentage').innerText = `Circle accuracy: ${score.toFixed(2)}%`;
}
