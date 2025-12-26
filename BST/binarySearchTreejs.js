 // Global variables
        let bst = null;
        let nodeIdCounter = 0;
        let nodeMap = new Map(); // Store nodes by id
        let levelWidths = new Map(); // Store width of each level

        // BST Node class
        class TreeNode {
            constructor(value, id) {
                this.value = value;
                this.id = id;
                this.left = null;
                this.right = null;
                this.x = 0;
                this.y = 0;
                this.level = 0;
                this.indexAtLevel = 0;
            }
        }

        // Function to show tree creation options
        function showOptions() {
            const optionButtons = document.getElementById('optionButtons');
            const inputContainer = document.getElementById('inputContainer');
            
            if (optionButtons.style.display === 'none') {
                optionButtons.style.display = 'flex';
                inputContainer.style.display = 'none';
            } else {
                optionButtons.style.display = 'none';
            }
        }

        // Function to show values input
        function showValuesInput() {
            const optionButtons = document.getElementById('optionButtons');
            const inputContainer = document.getElementById('inputContainer');
            
            optionButtons.style.display = 'none';
            inputContainer.style.display = 'block';
        }

        // Function to create random array
        function createRandomArray() {
            const size = 7 + Math.floor(Math.random() * 6); // 7-12 nodes
            const values = new Set();
            
            // Generate unique random values
            while (values.size < size) {
                values.add(Math.floor(Math.random() * 100) + 1);
            }
            
            const valuesArray = Array.from(values);
            
            // Display the values in input for reference
            document.getElementById('valuesInput').value = valuesArray.join(',');
            
            // Create BST from random values
            createBSTFromArray(valuesArray);
            
            // Update result message
            document.getElementById('result').innerHTML = `
                <strong>Random BST created with ${size} nodes!</strong><br>
                Values: ${valuesArray.join(', ')}
            `;
        }

        // Function to insert values manually
        function insertValuesManually() {
            const input = document.getElementById('valuesInput').value;
            if (!input.trim()) {
                showMessage('Please enter some values!', 'error');
                return;
            }
            
            const values = input.split(',').map(val => {
                const num = parseInt(val.trim());
                return isNaN(num) ? null : num;
            }).filter(val => val !== null);
            
            if (values.length === 0) {
                showMessage('Please enter valid numbers!', 'error');
                return;
            }
            
            createBSTFromArray(values);
            
            // Update result message
            document.getElementById('result').innerHTML = `
                <strong>BST created with ${values.length} nodes!</strong><br>
                Values: ${values.join(', ')}
            `;
        }

        // Function to create BST from array
        function createBSTFromArray(values) {
            bst = null;
            nodeIdCounter = 0;
            nodeMap.clear();
            levelWidths.clear();
            
            // Insert each value into BST
            values.forEach(value => {
                bst = insertBSTNode(bst, value);
            });
            
            // Calculate node positions (non-overlapping)
            calculateNodePositions();
            
            // Display the BST
            displayBST();
        }

        // Function to insert a node into BST
        function insertBSTNode(root, value) {
            if (root === null) {
                const newNode = new TreeNode(value, nodeIdCounter++);
                nodeMap.set(newNode.id, newNode);
                return newNode;
            }
            
            if (value < root.value) {
                root.left = insertBSTNode(root.left, value);
            } else if (value > root.value) {
                root.right = insertBSTNode(root.right, value);
            }
            
            return root;
        }

        // Function to calculate node positions - FIXED: Non-overlapping nodes
        function calculateNodePositions() {
            if (!bst) return;
            
            // First pass: calculate levels and count nodes at each level
            const queue = [{node: bst, level: 0, parent: null}];
            const nodesByLevel = [];
            
            while (queue.length > 0) {
                const {node, level, parent} = queue.shift();
                if (!node) continue;
                
                // Set node level
                node.level = level;
                
                // Initialize level array if needed
                if (!nodesByLevel[level]) {
                    nodesByLevel[level] = [];
                    levelWidths.set(level, 0);
                }
                
                // Add node to level
                nodesByLevel[level].push(node);
                levelWidths.set(level, levelWidths.get(level) + 1);
                
                // Add children to queue
                queue.push({node: node.left, level: level + 1, parent: node});
                queue.push({node: node.right, level: level + 1, parent: node});
            }
            
            // Second pass: calculate positions for each level
            const baseXSpacing = 100; // Horizontal spacing between nodes
            const ySpacing = 120; // Vertical spacing between levels
            
            for (let level = 0; level < nodesByLevel.length; level++) {
                const nodes = nodesByLevel[level];
                const levelWidth = nodes.length;
                
                // Calculate total width for this level
                const totalWidth = (levelWidth - 1) * baseXSpacing;
                
                // Calculate starting position to center the level
                const startX = (window.innerWidth - totalWidth) / 2;
                
                // Assign x positions for nodes in this level
                nodes.forEach((node, index) => {
                    node.x = startX + (index * baseXSpacing);
                    node.y = 80 + (level * ySpacing);
                    node.indexAtLevel = index;
                });
            }
        }

        // Function to display BST - FIXED: Proper tree display
        function displayBST() {
            const treeDisplay = document.getElementById('treeDisplay');
            treeDisplay.innerHTML = '';
            
            if (!bst) {
                treeDisplay.innerHTML = '<div style="text-align: center; padding: 50px; color: var(--royal-silver);">No tree created yet</div>';
                return;
            }
            
            // Create SVG for connectors
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '700');
            svg.style.position = 'absolute';
            svg.style.top = '0';
            svg.style.left = '0';
            svg.style.zIndex = '1';
            
            // Draw connectors first (behind nodes)
            drawConnectors(svg);
            treeDisplay.appendChild(svg);
            
            // Create container for nodes
            const nodesContainer = document.createElement('div');
            nodesContainer.style.position = 'relative';
            nodesContainer.style.zIndex = '2';
            nodesContainer.style.height = '700px';
            
            // Draw nodes
            nodeMap.forEach((node, id) => {
                const nodeElement = createNodeElement(node);
                nodesContainer.appendChild(nodeElement);
            });
            
            treeDisplay.appendChild(nodesContainer);
        }

        // Function to create node element
        function createNodeElement(node) {
            const nodeElement = document.createElement('div');
            nodeElement.className = 'tree-node';
            nodeElement.id = `node-${node.id}`;
            nodeElement.textContent = node.value;
            nodeElement.style.left = `${node.x - 32}px`; // Center the node (65px width)
            nodeElement.style.top = `${node.y}px`;
            
            // Mark root node
            if (node.id === bst.id) {
                nodeElement.classList.add('root');
            }
            
            // Add click event
            nodeElement.addEventListener('click', () => {
                showMessage(`Node Value: ${node.value}, Level: ${node.level}`, 'info');
            });
            
            return nodeElement;
        }

        // Function to draw connectors
        function drawConnectors(svg) {
            nodeMap.forEach((node, id) => {
                // Draw connector to left child
                if (node.left && nodeMap.has(node.left.id)) {
                    const child = nodeMap.get(node.left.id);
                    drawConnector(svg, node.x, node.y + 32, child.x, child.y);
                }
                
                // Draw connector to right child
                if (node.right && nodeMap.has(node.right.id)) {
                    const child = nodeMap.get(node.right.id);
                    drawConnector(svg, node.x, node.y + 32, child.x, child.y);
                }
            });
        }

        // Function to draw a single connector
        function drawConnector(svg, x1, y1, x2, y2) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', 'var(--royal-gold)');
            line.setAttribute('stroke-width', '3');
            line.setAttribute('stroke-linecap', 'round');
            svg.appendChild(line);
        }

        // Function to show popup
        function showPopup(popupId) {
            if (!bst) {
                showMessage('Please create a BST first!', 'error');
                return;
            }
            
            document.getElementById(popupId).style.display = 'block';
            document.getElementById('popupOverlay').style.display = 'block';
            
            // Clear input field
            const inputId = popupId.replace('Popup', '') + 'Input';
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                inputElement.value = '';
                inputElement.focus();
            }
        }

        // Function to close popup
        function closePopup(popupId) {
            document.getElementById(popupId).style.display = 'none';
            document.getElementById('popupOverlay').style.display = 'none';
        }

        // Function to show message
        function showMessage(message, type = 'info') {
            const resultDiv = document.getElementById('result');
            const color = type === 'error' ? '#FF6B6B' : type === 'success' ? '#32CD32' : 'var(--royal-silver)';
            
            resultDiv.innerHTML = `<strong style="color: ${color}">${message}</strong>`;
        }

        // Function to highlight node
        function highlightNode(nodeId, className, duration = 2000) {
            const node = document.getElementById(`node-${nodeId}`);
            if (node) {
                node.classList.add(className);
                setTimeout(() => {
                    node.classList.remove(className);
                }, duration);
            }
        }

        // Function to perform insert operation
        function performInsert() {
            const input = document.getElementById('insertInput').value;
            if (!input.trim()) {
                showMessage('Please enter a value to insert!', 'error');
                return;
            }
            
            const value = parseInt(input);
            if (isNaN(value)) {
                showMessage('Please enter a valid number!', 'error');
                return;
            }
            
            // Check if value already exists
            if (findNodeByValue(bst, value)) {
                showMessage(`Value ${value} already exists in BST!`, 'error');
                closePopup('insertPopup');
                return;
            }
            
            // Insert into BST
            bst = insertBSTNode(bst, value);
            
            // Recalculate positions and redisplay
            calculateNodePositions();
            displayBST();
            
            // Find and highlight inserted node
            setTimeout(() => {
                const insertedNode = findNodeByValue(bst, value);
                if (insertedNode) {
                    highlightNode(insertedNode.id, 'inserted');
                    showMessage(`Value ${value} inserted successfully!`, 'success');
                }
            }, 500);
            
            closePopup('insertPopup');
        }

        // Function to perform delete operation
        function performDelete() {
            const input = document.getElementById('deleteInput').value;
            if (!input.trim()) {
                showMessage('Please enter a value to delete!', 'error');
                return;
            }
            
            const value = parseInt(input);
            if (isNaN(value)) {
                showMessage('Please enter a valid number!', 'error');
                return;
            }
            
            // Find node to delete
            const nodeToDelete = findNodeByValue(bst, value);
            if (!nodeToDelete) {
                showMessage(`Value ${value} not found in BST!`, 'error');
                closePopup('deletePopup');
                return;
            }
            
            // Highlight node before deletion
            highlightNode(nodeToDelete.id, 'deleted', 1000);
            
            // Delete from BST
            bst = deleteBSTNode(bst, value);
            nodeMap.delete(nodeToDelete.id);
            
            // Recalculate positions and redisplay
            setTimeout(() => {
                calculateNodePositions();
                displayBST();
                showMessage(`Value ${value} deleted successfully!`, 'success');
            }, 1000);
            
            closePopup('deletePopup');
        }

        // Function to delete node from BST
        function deleteBSTNode(root, value) {
            if (!root) return null;
            
            if (value < root.value) {
                root.left = deleteBSTNode(root.left, value);
            } else if (value > root.value) {
                root.right = deleteBSTNode(root.right, value);
            } else {
                // Node found
                if (!root.left) return root.right;
                if (!root.right) return root.left;
                
                // Node has two children
                const minNode = findMinNode(root.right);
                root.value = minNode.value;
                nodeMap.get(root.id).value = minNode.value;
                root.right = deleteBSTNode(root.right, minNode.value);
            }
            
            return root;
        }

        // Function to perform search operation
        function performSearch() {
            const input = document.getElementById('searchInput').value;
            if (!input.trim()) {
                showMessage('Please enter a value to search!', 'error');
                return;
            }
            
            const value = parseInt(input);
            if (isNaN(value)) {
                showMessage('Please enter a valid number!', 'error');
                return;
            }
            
            const foundNode = findNodeByValue(bst, value);
            if (foundNode) {
                highlightNode(foundNode.id, 'found');
                showMessage(`Value ${value} found in BST!`, 'success');
            } else {
                showMessage(`Value ${value} not found in BST!`, 'error');
            }
            
            closePopup('searchPopup');
        }

        // Function to perform find minimum
        function performFindMin() {
            if (!bst) {
                showMessage('BST is empty!', 'error');
                return;
            }
            
            const minNode = findMinNode(bst);
            highlightNode(minNode.id, 'min');
            showMessage(`Minimum value is ${minNode.value}`, 'success');
            closePopup('minPopup');
        }

        // Function to perform find maximum
        function performFindMax() {
            if (!bst) {
                showMessage('BST is empty!', 'error');
                return;
            }
            
            const maxNode = findMaxNode(bst);
            highlightNode(maxNode.id, 'max');
            showMessage(`Maximum value is ${maxNode.value}`, 'success');
            closePopup('maxPopup');
        }

        // Function to calculate tree height
        function calculateHeight() {
            if (!bst) {
                showMessage('BST is empty!', 'error');
                return;
            }
            
            const height = getTreeHeight(bst);
            document.getElementById('heightResult').textContent = `Height of the tree: ${height}`;
            showPopup('heightPopup');
        }

        // Function to find node by value
        function findNodeByValue(root, value) {
            if (!root) return null;
            if (root.value === value) return root;
            if (value < root.value) return findNodeByValue(root.left, value);
            return findNodeByValue(root.right, value);
        }

        // Function to find minimum node
        function findMinNode(root) {
            while (root.left) root = root.left;
            return root;
        }

        // Function to find maximum node
        function findMaxNode(root) {
            while (root.right) root = root.right;
            return root;
        }

        // Function to get tree height
        function getTreeHeight(node) {
            if (!node) return -1;
            const leftHeight = getTreeHeight(node.left);
            const rightHeight = getTreeHeight(node.right);
            return Math.max(leftHeight, rightHeight) + 1;
        }

        // Event Listeners
        document.getElementById('insertButton').addEventListener('click', () => showPopup('insertPopup'));
        document.getElementById('deleteButton').addEventListener('click', () => showPopup('deletePopup'));
        document.getElementById('searchButton').addEventListener('click', () => showPopup('searchPopup'));
        document.getElementById('minButton').addEventListener('click', () => showPopup('minPopup'));
        document.getElementById('maxButton').addEventListener('click', () => showPopup('maxPopup'));
        document.getElementById('heightButton').addEventListener('click', calculateHeight);

        // Close popup when clicking on overlay
        document.getElementById('popupOverlay').addEventListener('click', () => {
            document.querySelectorAll('.popup').forEach(popup => {
                popup.style.display = 'none';
            });
            document.getElementById('popupOverlay').style.display = 'none';
        });

        // Close popup with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.popup').forEach(popup => {
                    popup.style.display = 'none';
                });
                document.getElementById('popupOverlay').style.display = 'none';
            }
        });

        // Create sample BST on load
        window.addEventListener('load', function() {
            const sampleValues = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 85];
            createBSTFromArray(sampleValues);
            
            document.getElementById('result').innerHTML = `
                <strong>Sample BST loaded!</strong><br>
                Try inserting, deleting, or searching for values
            `;
        });

        // Adjust tree display on window resize
        window.addEventListener('resize', function() {
            if (bst) {
                calculateNodePositions();
                displayBST();
            }
        });