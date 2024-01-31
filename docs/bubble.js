document.addEventListener('DOMContentLoaded', (event) => {
    class Circle {
      constructor(hue, radius, x, y, creationTime, lifetime) {
        this.hue = hue;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.creationTime = creationTime;
        this.lifetime = lifetime;
        this.driftX = (Math.random() - 0.5) * 3.0; // Increased drift speed in x
        this.driftY = (Math.random() - 0.5) * 3.0; // Increased drift speed in y
        this.lastDirectionChangeTime = creationTime;
        this.directionChangeInterval = 24000 + Math.random() * 8000; // Random interval for direction change (between 2 to 5 seconds)
      }
  
      drift() {
        const currentTime = Date.now();
        const timeSinceLastDirectionChange = currentTime - this.lastDirectionChangeTime;
  
        if (timeSinceLastDirectionChange > this.directionChangeInterval) {
          // Change direction
          this.driftX = (Math.random() - 0.5) * 3.0; // New random drift speed in x
          this.driftY = (Math.random() - 0.5) * 3.0; // New random drift speed in y
          this.lastDirectionChangeTime = currentTime; // Update the last direction change time
        }
  
        this.x += this.driftX; // Increment x position
        this.y += this.driftY; // Increment y position
      }
    }
  
    class Canvas {
      constructor() {
        this.circles = [];
        this.ctx = document.getElementById("canvas").getContext("2d");
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
        let hue = 0; // Initialize hue
        for (let i = 0; i < 12; i++) { // Create 12 circles initially
          this.addCircle(hue);
          hue += 80 + Math.random() * 60; // Increment hue for the next circle
        }
        setInterval(() => this.updateCircles(), 50); // Update at the original rate
      }
  
      addCircle(hue) {
        const canvasWidth = this.ctx.canvas.width;
        const radius = canvasWidth * (0.06 + Math.random() * 0.18);
        const x = Math.random() * canvasWidth;
        const y = Math.random() * this.ctx.canvas.height;
        const color = `hsl(${hue}, 70%, 50%)`; // Use HSL color
        const creationTime = Date.now();
        const lifetime = 5000 + Math.random() * 10000; // Longer lifetime range for initial circles
        this.circles.push(new Circle(hue, radius, x, y, creationTime, lifetime));
      }
  
      updateCircles() {
        const currentTime = Date.now();
        const initialCircleCount = this.circles.length;
        this.circles = this.circles.filter(circle => {
          const age = currentTime - circle.creationTime;
          if (age < circle.lifetime) {
            circle.drift(); // Apply drift effect
            return true;
          }
          return false;
        });
        const poppedCircles = initialCircleCount - this.circles.length;
        for (let i = 0; i < poppedCircles; i++) {
          let hue = this.circles[this.circles.length - 1].hue + 50 + Math.random() * 30; // Increment hue for the next circle
          this.addCircle(hue); // Add a new circle for each one that popped
        }
        this.drawCircles();
      }
  
      drawCircles() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.circles.forEach(circle => {
          this.ctx.beginPath();
          this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
          this.ctx.fillStyle = `hsla(${circle.hue}, 50%, 70%, 70%)`; // Use HSL color
          this.ctx.fill();
        });
      }
  
      resizeCanvas() {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
      }
    }
  
    new Canvas();
  });
  