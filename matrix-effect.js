/**
 * Matrix Rain Effect
 * A customizable matrix-style digital rain animation for web pages
 * 
 * Usage:
 * 1. Add a canvas element to your HTML: <canvas id="matrix-bg"></canvas>
 * 2. Include this script in your project
 * 3. Initialize: const matrix = new MatrixRain(options);
 * 
 * Example HTML setup:
 * ```html
 * <!DOCTYPE html>
 * <html>
 * <head>
 *     <style>
 *         #matrix-bg {
 *             position: fixed;
 *             top: 0;
 *             left: 0;
 *             width: 100vw;
 *             height: 100vh;
 *             z-index: -1;
 *             opacity: 0.3;
 *             pointer-events: none;
 *         }
 *     </style>
 * </head>
 * <body>
 *     <canvas id="matrix-bg"></canvas>
 *     <!-- Your content here -->
 *     <script src="matrix-effect.js"></script>
 *     <script>
 *         document.addEventListener('DOMContentLoaded', () => {
 *             new MatrixRain();
 *         });
 *     </script>
 * </body>
 * </html>
 * ```
 */

// Utility functions
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Matrix Rain Background Effect
class MatrixRain {
    /**
     * Creates a new Matrix Rain effect
     * @param {Object} options - Configuration options
     * @param {string} options.canvasId - ID of the canvas element (default: 'matrix-bg')
     * @param {number} options.fps - Frame rate (default: 30)
     * @param {string} options.characters - Characters to use (default: Matrix-style characters)
     * @param {string} options.color - Color of the characters (default: '#00ff41')
     * @param {string} options.backgroundColor - Background color for fade effect (default: 'rgba(0, 0, 0, 0.04)')
     * @param {number} options.fontSize - Font size in pixels (default: 15)
     * @param {number} options.columnWidth - Width of each column in pixels (default: 20)
     * @param {number} options.resetChance - Chance for a column to reset (0-1, default: 0.025)
     */
    constructor(options = {}) {
        this.options = {
            canvasId: 'matrix-bg',
            fps: 30,
            characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()+=[]{}|;:,.<>?",
            color: '#00ff41',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            fontSize: 15,
            columnWidth: 20,
            resetChance: 0.025,
            ...options
        };

        this.canvas = document.getElementById(this.options.canvasId);
        if (!this.canvas) {
            console.warn(`Matrix canvas element with ID '${this.options.canvasId}' not found - matrix effect will not display`);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.lastTime = 0;
        this.fpsInterval = 1000 / this.options.fps;
        
        this.resize();
        this.init();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Throttled resize handler
        window.addEventListener('resize', throttle(() => this.resize(), 250));
        
        // Pause animation when tab is not visible for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.columns = Math.floor(this.canvas.width / this.options.columnWidth);
        this.drops = new Array(this.columns).fill(1);
    }

    init() {
        this.matrix = this.options.characters;
        this.start();
    }

    draw(currentTime) {
        // Control FPS
        if (currentTime - this.lastTime < this.fpsInterval) {
            this.animationId = requestAnimationFrame((time) => this.draw(time));
            return;
        }
        this.lastTime = currentTime;

        // Semi-transparent background for fade effect
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Matrix characters
        this.ctx.fillStyle = this.options.color;
        this.ctx.font = `${this.options.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.matrix[Math.floor(Math.random() * this.matrix.length)];
            this.ctx.fillText(text, i * this.options.columnWidth, this.drops[i] * this.options.columnWidth);

            // Reset column when it reaches bottom
            if (this.drops[i] * this.options.columnWidth > this.canvas.height && Math.random() > (1 - this.options.resetChance)) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }

        this.animationId = requestAnimationFrame((time) => this.draw(time));
    }

    start() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame((time) => this.draw(time));
        }
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Update options and restart the effect
     * @param {Object} newOptions - New options to apply
     */
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.fpsInterval = 1000 / this.options.fps;
        this.matrix = this.options.characters;
        this.resize();
    }

    /**
     * Destroy the effect and clean up
     */
    destroy() {
        this.stop();
        window.removeEventListener('resize', this.resize);
        document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
}

// Auto-initialize if canvas exists (for simple usage)
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('matrix-bg')) {
        window.matrixEffect = new MatrixRain();
    }
});

/**
 * Additional Examples:
 * 
 * // Custom colors and characters
 * const redMatrix = new MatrixRain({
 *     canvasId: 'my-canvas',
 *     color: '#ff0000',
 *     characters: '01',
 *     fps: 60
 * });
 * 
 * // Binary rain
 * const binaryRain = new MatrixRain({
 *     characters: '01',
 *     color: '#0099ff',
 *     fontSize: 12
 * });
 * 
 * // Slow and dramatic
 * const slowMatrix = new MatrixRain({
 *     fps: 15,
 *     resetChance: 0.01,
 *     color: '#00ff41'
 * });
 */ 