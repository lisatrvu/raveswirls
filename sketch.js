let particles = [];
let hueBase = 0;
let mousePos = { x: 0, y: 0 };
let isDragging = false;
let touchPos = { x: 0, y: 0 };
let showInstructions = true;
let instructionAlpha = 255;
let hasInteracted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.06);

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
  let particleDensity = 1.2;
  let numParticles = Math.max(200, (width * height / 10000) * particleDensity);
  
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(25, 45),
      hueOffset: random(0, 360)
    });
  }
}

function draw() {
  // Fade background for trailing effect (very subtle - comment out to test)
  fill(0, 0, 0, 2);
  rect(0, 0, width, height);

  // Detect if mobile device
  let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Update and draw particles
  for (let p of particles) {
    // Mouse/touch interaction - create swirl effect when dragging
    if (isDragging) {
      // Use touch position if available, otherwise mouse position
      let interactionX = touchPos.x || mousePos.x;
      let interactionY = touchPos.y || mousePos.y;
      
      let dx = p.x - interactionX;
      let dy = p.y - interactionY;
      let dist = sqrt(dx * dx + dy * dy);
      
      // Larger interaction radius and stronger force on mobile
      let maxDist = isMobile ? 300 : 200; // interaction radius
      let forceMultiplier = isMobile ? 1.5 : 1.0; // stronger on mobile
      
      if (dist < maxDist && dist > 0) {
        // Create swirling force around touch/mouse
        let angle = atan2(dy, dx);
        let force = (1 - dist / maxDist) * 0.7 * forceMultiplier; // stronger closer to touch
        
        // Perpendicular force for swirl effect
        let perpAngle = angle + PI / 2;
        p.vx += cos(perpAngle) * force;
        p.vy += sin(perpAngle) * force;
        
        // Also push away slightly
        p.vx += cos(angle) * force * 0.4;
        p.vy += sin(angle) * force * 0.4;
      }
    }
    
    // Apply velocity with damping (less damping on mobile for more reactivity)
    let damping = isMobile ? 0.985 : 0.98; // less damping = more reactive
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= damping;
    p.vy *= damping;
    
    // Wrap around screen edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Calculate color based on position and time
    let hue = (hueBase + p.hueOffset + p.x * 0.1 + p.y * 0.1) % 360;
    let brightness = 90 + sin(frameCount * 0.01 + p.hueOffset) * 10;
    let size = p.size + sin(frameCount * 0.02 + p.hueOffset * 0.1) * 5;
    
    fill(hue, 100, brightness, 100);
    ellipse(p.x, p.y, size);
  }

  // Rotate color base
  hueBase = (hueBase + 0.5) % 360;
  
  // Show instructions
  if (showInstructions && instructionAlpha > 0) {
    fill(0, 0, 100, instructionAlpha);
    textSize(min(width, height) * 0.06);
    text("✨ Drag to create swirling colors ✨", width / 2, height / 2 - 40);
    textSize(min(width, height) * 0.04);
    text("Touch and move your finger across the screen", width / 2, height / 2 + 20);
    
    if (hasInteracted) {
      instructionAlpha -= 5;
      if (instructionAlpha <= 0) {
        showInstructions = false;
      }
    }
  }
}

function mousePressed() {
  hasInteracted = true;
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
  hasInteracted = true;
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
  let numParticles = Math.max(150, (width * height / 10000) * particleDensity);
  
  // Add or remove particles as needed
  while (particles.length < numParticles) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(25, 45),
      hueOffset: random(0, 360)
    });
  }
  
  while (particles.length > numParticles) {
    particles.pop();
  }
}
