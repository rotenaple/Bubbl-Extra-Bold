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
            this.directionChangeInterval = 3000 + Math.random() * 8000; // Random interval for direction change (between 2 to 5 seconds)
            this.opacity = 0; // Start with zero opacity
            this.fadeInDuration = 750; // Duration for the circle to fully fade in
            this.spawnedNew = false; // Indicates whether this circle has spawned a new one
        }

        drift() {
            const currentTime = Date.now();
            const age = currentTime - this.creationTime;
            const timeSinceLastDirectionChange = currentTime - this.lastDirectionChangeTime;
          
            // Direction change logic
            if (timeSinceLastDirectionChange > this.directionChangeInterval) {
              this.driftX = (Math.random() - 0.5) * 3.0; // New random drift speed in x
              this.driftY = (Math.random() - 0.5) * 3.0; // New random drift speed in y
              this.lastDirectionChangeTime = currentTime; // Update the last direction change time
            }
          
            // Movement logic
            this.x += this.driftX; // Increment x position
            this.y += this.driftY; // Increment y position
          
            // Opacity logic for a gradual appearance and disappearance
            if (age < this.fadeInDuration) {
              this.opacity = Math.min(age / this.fadeInDuration, 0.8); // Gradual increase in opacity capped at 80%
              // Print when fade in starts
              console.log('Fade In Started for Circle with Hue:', this.hue);
            } else if (age > this.lifetime - this.fadeInDuration) {
              this.opacity = Math.min((this.lifetime - age) / this.fadeInDuration, 0.8); // Gradual decrease in opacity capped at 80%
              // Print when fade out starts
              console.log('Fade Out Started for Circle with Hue:', this.hue);
            } else {
              this.opacity = 0.8; // Maximum opacity capped at 80% for the majority of the lifetime
            }
          }
    }

    class Canvas {
        constructor() {
            this.circles = [];
            this.ctx = document.getElementById("canvas").getContext("2d");
            this.resizeCanvas();
            window.addEventListener("resize", () => this.resizeCanvas());
            let hue = 0; // Initialize hue
            for (let i = 0; i < 8; i++) { // Create 12 circles initially
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
            const lifetime = 12000 + Math.random() * 8000; // Longer lifetime range for initial circles
            this.circles.push(new Circle(hue, radius, x, y, creationTime, lifetime));
        }

        updateCircles() {
            const currentTime = Date.now();
            this.circles.forEach((circle, index) => {
                const age = currentTime - circle.creationTime;
                if (age > circle.lifetime - circle.fadeInDuration && !circle.spawnedNew) {
                    let hue = circle.hue + 50 + Math.random() * 30; // Increment hue for the next circle
                    this.addCircle(hue); // Add a new circle
                    circle.spawnedNew = true; // Mark that this circle has spawned a new one
                }
                if (age >= circle.lifetime) {
                    this.circles.splice(index, 1); // Remove circle that has completed its lifetime
                } else {
                    circle.drift(); // Apply drift effect
                }
            });
            this.drawCircles();
        }


        drawCircles() {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.circles.forEach(circle => {
                this.ctx.beginPath();
                this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
                this.ctx.fillStyle = `hsla(${circle.hue}, 40%, 75%, ${circle.opacity})`; // Use HSL color with opacity
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
