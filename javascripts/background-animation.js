/**
 * Enhanced Circular Flow Animation
 * An efficient, interactive flowing background effect with circular patterns
 */

document.addEventListener('DOMContentLoaded', () => {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'background-animation';
    
    // Set styles for canvas - more visible now
    Object.assign(canvas.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: '1'
    });
    
    // Insert canvas as the first child of body
    document.body.insertBefore(canvas, document.body.firstChild);
    
    // Get canvas context
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions - use lower resolution for better performance
    const resizeCanvas = () => {
        const pixelRatio = Math.min(window.devicePixelRatio, 1.5); // Cap pixel ratio for performance
        canvas.width = window.innerWidth * pixelRatio;
        canvas.height = window.innerHeight * pixelRatio;
        ctx.scale(pixelRatio, pixelRatio);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Configuration - optimized for performance and visual impact
    // Colors matched to your header gradient (cream to lavender)
    const config = {
        particleCount: 150,
        trailLength: 15,
        flowStrength: 25,
        cursorInfluence: 150,
        cursorStrength: 0.8,
        speedRange: { min: 0.8, max: 2.5 },
        // Updated colors to match header gradient and site theme
        colorPalette: [
            { r: 254, g: 247, b: 226, a: 0.5 }, // Light cream #fef7e2 (from header)
            { r: 252, g: 242, b: 220, a: 0.4 }, // Lighter cream
            { r: 243, g: 231, b: 246, a: 0.5 }, // Light lavender #f3e7f6 (from header)
            { r: 235, g: 220, b: 240, a: 0.4 }, // Lighter lavender
            { r: 164, g: 36, b: 59, a: 0.25 },  // Accent red #f3e7f6 (more transparent)
        ],
        // Parameters for circular motion
        circularMotion: {
            enabled: true,
            vortexPoints: 3,      // Number of vortex points
            vortexStrength: 0.4,  // Strength of circular motion
            vortexRadius: 200,    // Radius of influence for each vortex
            vortexRotation: 0.001 // Speed of vortex rotation
        }
    };
    
    // Cursor tracking
    const cursor = {
        x: null,
        y: null,
        prevX: null,
        prevY: null,
        active: false,
        speed: 0
    };
    
    // Update cursor
    const updateCursor = (e) => {
        cursor.prevX = cursor.x;
        cursor.prevY = cursor.y;
        
        // Handle both mouse and touch events
        if (e.touches) {
            cursor.x = e.touches[0].clientX;
            cursor.y = e.touches[0].clientY;
        } else {
            cursor.x = e.clientX;
            cursor.y = e.clientY;
        }
        
        // Calculate cursor speed for more dynamic interaction
        if (cursor.prevX && cursor.prevY) {
            const dx = cursor.x - cursor.prevX;
            const dy = cursor.y - cursor.prevY;
            cursor.speed = Math.sqrt(dx*dx + dy*dy);
        }
        
        cursor.active = true;
        
        // Set timeout to fade effect
        clearTimeout(cursor.timeout);
        cursor.timeout = setTimeout(() => {
            cursor.active = false;
            cursor.speed = 0;
        }, 1500);
    };
    
    // Event listeners
    window.addEventListener('mousemove', updateCursor, { passive: true });
    window.addEventListener('touchmove', updateCursor, { passive: true });
    window.addEventListener('click', (e) => {
        // Add special "burst" effect on click
        createBurst(e.clientX, e.clientY);
    });
    
    // Generate vortex points for circular motion
    const vortexPoints = [];
    function generateVortexPoints() {
        vortexPoints.length = 0; // Clear existing points
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Create main vortex in center
        vortexPoints.push({
            x: width / 2,
            y: height / 2,
            radius: config.circularMotion.vortexRadius * 1.5,
            strength: config.circularMotion.vortexStrength * 0.7,
            rotation: 1 // 1 = clockwise, -1 = counterclockwise
        });
        
        // Create additional vortices
        for (let i = 0; i < config.circularMotion.vortexPoints; i++) {
            const angle = (i / config.circularMotion.vortexPoints) * Math.PI * 2;
            const distance = Math.min(width, height) * 0.35;
            
            vortexPoints.push({
                x: width / 2 + Math.cos(angle) * distance,
                y: height / 2 + Math.sin(angle) * distance,
                radius: config.circularMotion.vortexRadius,
                strength: config.circularMotion.vortexStrength,
                rotation: i % 2 === 0 ? 1 : -1 // Alternate rotation direction
            });
        }
    }
    
    // Call once at start and on window resize
    window.addEventListener('resize', generateVortexPoints);
    generateVortexPoints();
    
    // Simplified flow calculation with circular motion
    const flowAngles = [];
    const gridSize = 20; // Larger grid size = better performance
    const rows = Math.ceil(window.innerHeight / gridSize) + 1;
    const cols = Math.ceil(window.innerWidth / gridSize) + 1;
    
    // Pre-compute flow field for better performance
    // This will be modified by vortex points during animation
    for (let y = 0; y < rows; y++) {
        flowAngles[y] = [];
        for (let x = 0; x < cols; x++) {
            // Generate smooth flowing angles
            const angle = Math.sin(x * 0.1) * Math.cos(y * 0.1) * Math.PI;
            flowAngles[y][x] = angle;
        }
    }
    
    // Get flow angle at any position with circular influence
    const getFlowAngle = (x, y, time) => {
        // Base flow angle from grid
        const gridX = Math.floor(x / gridSize);
        const gridY = Math.floor(y / gridSize);
        
        // Use safe grid coordinates
        const safeX = Math.min(Math.max(0, gridX), cols - 1);
        const safeY = Math.min(Math.max(0, gridY), rows - 1);
        
        // Start with base flow angle
        let angle = flowAngles[safeY][safeX] + Math.sin(time * 0.001) * 0.3;
        
        // Apply circular motion from vortex points
        for (const vortex of vortexPoints) {
            // Slowly rotate vortex positions
            const vortexX = vortex.x + Math.cos(time * config.circularMotion.vortexRotation) * vortex.radius * 0.2;
            const vortexY = vortex.y + Math.sin(time * config.circularMotion.vortexRotation) * vortex.radius * 0.2;
            
            const dx = x - vortexX;
            const dy = y - vortexY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < vortex.radius) {
                // Calculate circular angle
                const circularAngle = Math.atan2(dy, dx) + (Math.PI / 2 * vortex.rotation);
                
                // Blend circular motion based on distance (stronger near center)
                const influence = (1 - distance / vortex.radius) * vortex.strength;
                angle = angle * (1 - influence) + circularAngle * influence;
            }
        }
        
        return angle;
    };
    
    // Create a burst of particles at a position
    const burstParticles = [];
    function createBurst(x, y) {
        const burstSize = 15 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < burstSize; i++) {
            // Create circular burst with spiral pattern
            const angle = (i / burstSize) * Math.PI * 6 + Math.random() * 0.5;
            const speed = 1 + Math.random() * 3;
            const size = 2 + Math.random() * 3;
            const life = 30 + Math.random() * 20;
            
            burstParticles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                life: life,
                maxLife: life,
                color: config.colorPalette[Math.floor(Math.random() * config.colorPalette.length)]
            });
        }
    }
    
    // Update and draw burst particles
    function updateBurstParticles() {
        for (let i = burstParticles.length - 1; i >= 0; i--) {
            const p = burstParticles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            
            // Add slight circular motion to burst particles
            const angle = Math.atan2(p.y - window.innerHeight/2, p.x - window.innerWidth/2);
            p.vx += Math.cos(angle + Math.PI/2) * 0.03;
            p.vy += Math.sin(angle + Math.PI/2) * 0.03;
            
            // Draw
            const alpha = (p.life / p.maxLife) * p.color.a;
            ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Remove dead particles
            if (p.life <= 0) {
                burstParticles.splice(i, 1);
            }
        }
    }
    
    // Flow particle with trail
    class FlowParticle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = 1.5 + Math.random() * 2;
            this.speed = config.speedRange.min + Math.random() * (config.speedRange.max - config.speedRange.min);
            this.color = config.colorPalette[Math.floor(Math.random() * config.colorPalette.length)];
            
            // Trail array to store previous positions
            this.trail = [];
            for (let i = 0; i < config.trailLength; i++) {
                this.trail.push({x: this.x, y: this.y});
            }
        }
        
        update(time) {
            // Get angle from flow field with circular motion
            let angle = getFlowAngle(this.x, this.y, time);
            
            // Apply cursor influence
            if (cursor.active && cursor.x) {
                const dx = this.x - cursor.x;
                const dy = this.y - cursor.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.cursorInfluence) {
                    // Add spiral effect around cursor
                    const spiralAngle = Math.atan2(dy, dx) + Math.PI/2;
                    
                    // Calculate influence based on distance and cursor speed
                    const influence = (1 - distance / config.cursorInfluence) * 
                                     config.cursorStrength * 
                                     (1 + Math.min(cursor.speed, 20) / 10);
                    
                    // Blend with spiral angle for circular motion around cursor
                    angle = angle * (1 - influence) + spiralAngle * influence;
                    
                    // Boost speed near cursor
                    this.speed += influence * 0.5;
                }
            }
            
            // Update position based on angle
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
            
            // Gradually return speed to normal
            this.speed = this.speed * 0.98 + 
                        (config.speedRange.min + Math.random() * 
                        (config.speedRange.max - config.speedRange.min)) * 0.02;
            
            // Update trail
            this.trail.pop(); // Remove last position
            this.trail.unshift({x: this.x, y: this.y}); // Add current position
            
            // Reset if off-screen
            if (this.x < -50 || this.x > window.innerWidth + 50 || 
                this.y < -50 || this.y > window.innerHeight + 50) {
                this.reset();
            }
        }
        
        draw() {
            // Draw trail with curved lines for smoother appearance
            if (this.trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(this.trail[0].x, this.trail[0].y);
                
                // Use quadratic curves for smoother trail
                for (let i = 1; i < this.trail.length - 1; i++) {
                    const xc = (this.trail[i].x + this.trail[i+1].x) / 2;
                    const yc = (this.trail[i].y + this.trail[i+1].y) / 2;
                    ctx.quadraticCurveTo(
                        this.trail[i].x, 
                        this.trail[i].y, 
                        xc, 
                        yc
                    );
                }
                
                // Set line style with gradient transparency
                const gradient = ctx.createLinearGradient(
                    this.trail[0].x, this.trail[0].y,
                    this.trail[this.trail.length-1].x, this.trail[this.trail.length-1].y
                );
                
                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`);
                gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = this.size;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
        }
    }
    
    // Create particles
    const particles = Array.from({ length: config.particleCount }, () => new FlowParticle());
    let time = 0;
    
    // Animation loop
    function animate() {
        // Semi-transparent clear with color matching background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update(time);
            particle.draw();
        });
        
        // Update and draw burst particles
        updateBurstParticles();
        
        // Increment time
        time += 1;
        
        // Continue animation loop
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Create initial bursts for visual impact when page loads
    setTimeout(() => {
        // Create a few bursts in different locations for an interesting start
        createBurst(window.innerWidth / 2, window.innerHeight / 2);
        
        setTimeout(() => {
            createBurst(window.innerWidth / 3, window.innerHeight / 3);
        }, 200);
        
        setTimeout(() => {
            createBurst(window.innerWidth * 2/3, window.innerHeight * 2/3);
        }, 400);
    }, 500);
});