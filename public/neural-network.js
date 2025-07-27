class NeuralNetwork {
    constructor() {
        this.canvas = document.getElementById('neuralCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.clusters = [];

        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Create nodes with zero connections (all start white)
        for (let i = 0; i < 150; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                type: 'white', // All nodes start white (isolated)
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                connections: []
            });
        }

        // Start connection timer
        this.connectionTimer = 0;
        this.connectionInterval = 50; // Add connection every 50ms
    }

    updateNodeColor(node) {
        const connectionCount = node.connections.length;

        if (connectionCount === 0) {
            node.type = 'white'; // Isolated
        } else if (connectionCount === 1) {
            node.type = 'blue'; // Low-connection
        } else if (connectionCount >= 2 && connectionCount <= 3) {
            node.type = 'cyan'; // Normal (cyan for medium connections)
        } else {
            node.type = 'red'; // Well-connected (4+ connections)
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        this.connections.forEach(connection => {
            const from = this.nodes[connection.from];
            const to = this.nodes[connection.to];

            connection.pulse += connection.pulseSpeed;
            const opacity = connection.opacity + Math.sin(connection.pulse) * 0.1;

            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(from.x, from.y);
            this.ctx.lineTo(to.x, to.y);
            this.ctx.stroke();
        });

        // Draw nodes
        this.nodes.forEach(node => {
            node.pulse += node.pulseSpeed;
            const scale = 1 + Math.sin(node.pulse) * 0.3;
            const radius = node.radius * scale;

            let color;
            let glowRadius;

            switch (node.type) {
                case 'red':
                    color = '#ff4444';
                    glowRadius = 15;
                    break;
                case 'blue':
                    color = '#44aaff';
                    glowRadius = 12;
                    break;
                case 'cyan':
                    color = '#00ffff';
                    glowRadius = 10;
                    break;
                default:
                    color = '#ffffff';
                    glowRadius = 8;
            }

            // Draw glow
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, glowRadius
            );
            gradient.addColorStop(0, `${color}80`);
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw node
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        });



        // Gradually build connections
        this.connectionTimer++;
        if (this.connectionTimer >= this.connectionInterval) {
            this.connectionTimer = 0;
            this.addSmartConnection();
        }

        // Add new nodes occasionally
        if (Math.random() < 0.003) {
            this.addRandomNode();
        }

        requestAnimationFrame(() => this.animate());
    }

    addSmartConnection() {
        // Find nodes that can still form connections (not red)
        const availableNodes = this.nodes.filter(node => node.connections.length < 4);

        if (availableNodes.length < 2) return;

        // Initialize search radius for each node if not already set
        if (!this.searchRadii) {
            this.searchRadii = {};
            this.nodes.forEach((node, index) => {
                this.searchRadii[index] = 80; // Start with 80px search radius
            });
        }

        // Find the best connection opportunity
        let bestConnection = null;
        let bestDistance = Infinity;

        for (let i = 0; i < availableNodes.length; i++) {
            const fromNode = availableNodes[i];
            const fromIndex = this.nodes.indexOf(fromNode);
            const searchRadius = this.searchRadii[fromIndex] || 80;

            // Look for potential connections within current search radius
            for (let j = 0; j < availableNodes.length; j++) {
                if (i === j) continue;

                const toNode = availableNodes[j];
                const toIndex = this.nodes.indexOf(toNode);

                // Skip if either node is red (well-connected)
                if (fromNode.connections.length >= 4 || toNode.connections.length >= 4) continue;

                // Skip if already connected
                const connectionExists = this.connections.some(conn =>
                    (conn.from === fromIndex && conn.to === toIndex) ||
                    (conn.from === toIndex && conn.to === fromIndex)
                );

                if (connectionExists) continue;

                const distance = Math.sqrt(
                    Math.pow(fromNode.x - toNode.x, 2) +
                    Math.pow(fromNode.y - toNode.y, 2)
                );

                // If within search radius and better than current best
                if (distance <= searchRadius && distance < bestDistance) {
                    bestConnection = { fromNode, toNode, distance };
                    bestDistance = distance;
                }
            }
        }

        // If no connection found, expand search radius for nodes that need connections
        if (!bestConnection) {
            availableNodes.forEach(node => {
                const nodeIndex = this.nodes.indexOf(node);
                if (node.connections.length < 4) {
                    this.searchRadii[nodeIndex] = (this.searchRadii[nodeIndex] || 80) + 20;
                    // Cap search radius at 200px
                    if (this.searchRadii[nodeIndex] > 200) {
                        this.searchRadii[nodeIndex] = 200;
                    }
                }
            });
            return;
        }

        // Make the connection
        const { fromNode, toNode } = bestConnection;
        const fromIndex = this.nodes.indexOf(fromNode);
        const toIndex = this.nodes.indexOf(toNode);

        this.connections.push({
            from: fromIndex,
            to: toIndex,
            opacity: Math.random() * 0.6 + 0.2,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.03 + 0.01
        });

        fromNode.connections.push(toIndex);
        toNode.connections.push(fromIndex);

        // Update colors after connection
        this.updateNodeColor(fromNode);
        this.updateNodeColor(toNode);

        // Reset search radius for connected nodes
        this.searchRadii[fromIndex] = 80;
        this.searchRadii[toIndex] = 80;
    }

    addRandomConnection() {
        const availableNodes = this.nodes.filter(node =>
            node.connections.length < 5
        );

        if (availableNodes.length >= 2) {
            const from = availableNodes[Math.floor(Math.random() * availableNodes.length)];
            const to = availableNodes[Math.floor(Math.random() * availableNodes.length)];

            if (from !== to) {
                const fromIndex = this.nodes.indexOf(from);
                const toIndex = this.nodes.indexOf(to);

                this.connections.push({
                    from: fromIndex,
                    to: toIndex,
                    opacity: Math.random() * 0.6 + 0.2,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.03 + 0.01
                });

                from.connections.push(toIndex);
                to.connections.push(fromIndex);
            }
        }
    }

    addRandomNode() {
        const newNode = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: Math.random() * 2 + 1,
            type: 'white', // New nodes start white (isolated)
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            connections: []
        };

        this.nodes.push(newNode);
        const newNodeIndex = this.nodes.length - 1;

        // Initialize search radius for new node
        if (this.searchRadii) {
            this.searchRadii[newNodeIndex] = 80;
        }

        // Connect to nearby nodes (but only if they're not red)
        this.nodes.forEach((node, index) => {
            if (node !== newNode && node.connections.length < 4) {
                const distance = Math.sqrt(
                    Math.pow(newNode.x - node.x, 2) +
                    Math.pow(newNode.y - node.y, 2)
                );

                if (distance < 100) {
                    this.connections.push({
                        from: newNodeIndex,
                        to: index,
                        opacity: Math.random() * 0.6 + 0.2,
                        pulse: Math.random() * Math.PI * 2,
                        pulseSpeed: Math.random() * 0.03 + 0.01
                    });

                    newNode.connections.push(index);
                    node.connections.push(newNodeIndex);
                }
            }
        });

        // Update colors for all affected nodes
        this.updateNodeColor(newNode);
        this.nodes.forEach(node => {
            if (node !== newNode) {
                this.updateNodeColor(node);
            }
        });
    }
}

// Initialize the neural network when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NeuralNetwork();
}); 