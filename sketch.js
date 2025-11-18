let particles = [];
let hueBase = 0;
let mousePos = { x: 0, y: 0 };
let isDragging = false;
let touchPos = { x: 0, y: 0 };

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  noStroke();

  // Prevent default touch behaviors on mobile
  document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
  document.addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, { passive: false });

  // Create particles to fill the screen
  let particleDensity = 0.8; // particles per 100 pixels
  let numParticles = Math.max(100, (width * height / 10000) * particleDensity);
  
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

}

function draw() {
  // Fade background slightly for trailing effect
  fill(0, 0, 0, 8);
  rect(0, 0, width, height);

  // Time-based animation variation
  let ampLevel = sin(frameCount * 0.02) * 50 + 50;

  // Update and draw particles
  for (let p of particles) {
    // Base swirling motion
    p.angle += p.swirlSpeed;
    
    // Mouse/touch interaction - create swirl effect when dragging
    if (isDragging) {
      // Use touch position if available, otherwise mouse position
      let interactionX = touchPos.x || mousePos.x;
      let interactionY = touchPos.y || mousePos.y;
      
      let dx = p.x - interactionX;
      let dy = p.y - interactionY;
      let dist = sqrt(dx * dx + dy * dy);
      let maxDist = 200; // interaction radius
      
      if (dist < maxDist && dist > 0) {
        // Create swirling force around touch/mouse
        let angle = atan2(dy, dx);
        let force = (1 - dist / maxDist) * 0.5; // stronger closer to touch
        
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
    let brightness = 80 + ampLevel * 0.2 + sin(frameCount * 0.01 + p.hueOffset) * 15;
    let size = p.size + ampLevel * 0.15 + sin(frameCount * 0.02 + p.hueOffset * 0.1) * 5;
    
    fill(hue, 100, brightness, 100);
    ellipse(p.x, p.y, size);
  }

  // Rotate color base
  hueBase = (hueBase + 0.5) % 360;
}

function mousePressed() {
  isDragging = true;
  mousePos.x = mouseX;
  mousePos.y = mouseY;
  touchPos.x = mouseX;
  touchPos.y = mouseY;
}

function mouseDragged() {
  isDragging = true;
  mousePos.x = mouseX;
  mousePos.y = mouseY;
  touchPos.x = mouseX;
  touchPos.y = mouseY;
}

function mouseReleased() {
  isDragging = false;
}

function touchStarted() {
  isDragging = true;
  // Use first touch point
  if (touches.length > 0) {
    touchPos.x = touches[0].x;
    touchPos.y = touches[0].y;
    mousePos.x = touches[0].x;
    mousePos.y = touches[0].y;
  }
  return false; // Prevent default
}

function touchMoved() {
  isDragging = true;
  // Use first touch point
  if (touches.length > 0) {
    touchPos.x = touches[0].x;
    touchPos.y = touches[0].y;
    mousePos.x = touches[0].x;
    mousePos.y = touches[0].y;
  }
  return false; // Prevent scrolling
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
