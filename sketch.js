let particles = [];
let hueBase = 0;
let mouseForce = { x: 0, y: 0 };
let mousePos = { x: 0, y: 0 };
let isDragging = false;

let mic, ampLevel = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  noStroke();

  // Create particles to fill the screen
  let particleDensity = 0.8; // particles per 100 pixels
  let numParticles = (width * height / 10000) * particleDensity;
  
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(15, 35),
      hueOffset: random(0, 360),
      angle: random(TWO_PI),
      swirlSpeed: random(0.01, 0.03),
      baseRadius: random(50, 150)
    });
  }

  // Setup mic input
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  // Fade background slightly for trailing effect
  fill(0, 0, 0, 8);
  rect(0, 0, width, height);

  // Get live mic level
  let level = mic.getLevel();
  ampLevel = lerp(ampLevel, level * 2000, 0.1);

  // Update and draw particles
  for (let p of particles) {
    // Base swirling motion
    p.angle += p.swirlSpeed;
    
    // Mouse interaction - create swirl effect when dragging
    if (isDragging) {
      let dx = p.x - mousePos.x;
      let dy = p.y - mousePos.y;
      let dist = sqrt(dx * dx + dy * dy);
      let maxDist = 200; // interaction radius
      
      if (dist < maxDist && dist > 0) {
        // Create swirling force around mouse
        let angle = atan2(dy, dx);
        let force = (1 - dist / maxDist) * 0.5; // stronger closer to mouse
        
        // Perpendicular force for swirl effect
        let perpAngle = angle + PI / 2;
        p.vx += cos(perpAngle) * force;
        p.vy += sin(perpAngle) * force;
        
        // Also push away slightly
        p.vx += cos(angle) * force * 0.3;
        p.vy += sin(angle) * force * 0.3;
      }
    }
    
    // Apply velocity with damping
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    
    // Wrap around screen edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Calculate color based on position and time
    let hue = (hueBase + p.hueOffset + p.x * 0.1 + p.y * 0.1) % 360;
    let brightness = 70 + ampLevel * 0.3 + sin(frameCount * 0.01 + p.hueOffset) * 10;
    let size = p.size + ampLevel * 0.2 + sin(frameCount * 0.02 + p.hueOffset * 0.1) * 3;
    
    fill(hue, 100, brightness, 90);
    ellipse(p.x, p.y, size);
  }

  // Rotate color base
  hueBase = (hueBase + 0.5) % 360;
}

function mousePressed() {
  isDragging = true;
  mousePos.x = mouseX;
  mousePos.y = mouseY;
  getAudioContext().resume();
}

function mouseDragged() {
  isDragging = true;
  mousePos.x = mouseX;
  mousePos.y = mouseY;
}

function mouseReleased() {
  isDragging = false;
}

function touchStarted() {
  isDragging = true;
  mousePos.x = touchX || mouseX;
  mousePos.y = touchY || mouseY;
  getAudioContext().resume();
  return false;
}

function touchMoved() {
  isDragging = true;
  mousePos.x = touchX || mouseX;
  mousePos.y = touchY || mouseY;
  return false;
}

function touchEnded() {
  isDragging = false;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Adjust particles for new screen size
  let particleDensity = 0.8;
  let numParticles = (width * height / 10000) * particleDensity;
  
  // Add or remove particles as needed
  while (particles.length < numParticles) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(15, 35),
      hueOffset: random(0, 360),
      angle: random(TWO_PI),
      swirlSpeed: random(0.01, 0.03),
      baseRadius: random(50, 150)
    });
  }
  
  while (particles.length > numParticles) {
    particles.pop();
  }
}
