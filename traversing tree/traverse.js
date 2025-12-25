  // Global variables
        let tree = null;
        let traversalArray = [];
        let currentTraversalIndex = 0;
        let isAnimating = false;

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
            const size = 7 + Math.floor(Math.random() * 8); // 7-14 nodes
            const values = new Set();
            
            // Generate unique random values
            while (values.size < size) {
                values.add(Math.floor(Math.random() * 100) + 1);
            }
            
            const valuesArray = Array.from(values);
            
            // Display the values in input for reference
            document.getElementById('valuesInput').value = valuesArray.join(',');
            
            // Create tree from random values
            createTreeFromArray(valuesArray);
            
            // Update result message
            document.getElementById('result').innerHTML = `
                <strong>Random tree created with ${size} nodes!</strong><br>
                Values: ${valuesArray.join(', ')}
            `;
            
            // Reset traversal display
            resetTraversal();
        }

        // Function to insert values manually
        function insertValuesManually() {
            const input = document.getElementById('valuesInput').value;
            if (!input.trim()) {
                alert('Please enter some values!');
                return;
            }
            
            const values = input.split(',').map(val => {
                const num = parseInt(val.trim());
                return isNaN(num) ? null : num;
            }).filter(val => val !== null);
            
            if (values.length === 0) {
                alert('Please enter valid numbers!');
                return;
            }
            
            createTreeFromArray(values);
            
            // Update result message
            document.getElementById('result').innerHTML = `
                <strong>Tree created with ${values.length} nodes!</strong><br>
                Values: ${values.join(', ')}
            `;
            
            // Reset traversal display
            resetTraversal();
        }

        // Function to create tree from array
        function createTreeFromArray(values) {
            // Simple binary search tree creation
            tree = { nodes: [], connections: [] };
            
            // Create nodes
            for (let i = 0; i < values.length; i++) {
                tree.nodes.push({
                    id: i,
                    value: values[i],
                    level: Math.floor(Math.log2(i + 1)),
                    position: i
                });
            }
            
            // Create connections (parent-child relationships)
            for (let i = 0; i < values.length; i++) {
                const leftChild = 2 * i + 1;
                const rightChild = 2 * i + 2;
                
                if (leftChild < values.length) {
                    tree.connections.push({ from: i, to: leftChild });
                }
                if (rightChild < values.length) {
                    tree.connections.push({ from: i, to: rightChild });
                }
            }
            
            // Display the tree
            displayTree();
        }

        // Function to display tree
        function displayTree() {
            const treeDisplay = document.getElementById('treeDisplay');
            treeDisplay.innerHTML = '';
            
            if (!tree || tree.nodes.length === 0) return;
            
            // Group nodes by level
            const levels = {};
            tree.nodes.forEach(node => {
                if (!levels[node.level]) {
                    levels[node.level] = [];
                }
                levels[node.level].push(node);
            });
            
            // Create tree levels
            Object.keys(levels).sort((a, b) => a - b).forEach(level => {
                const levelDiv = document.createElement('div');
                levelDiv.className = 'tree-level';
                
                levels[level].forEach(node => {
                    const nodeDiv = document.createElement('div');
                    nodeDiv.className = 'tree-node';
                    nodeDiv.id = `node-${node.id}`;
                    nodeDiv.textContent = node.value;
                    levelDiv.appendChild(nodeDiv);
                });
                
                treeDisplay.appendChild(levelDiv);
            });
            
            // Add some basic styling for tree structure
            const style = document.createElement('style');
            style.textContent = `
                .tree-level {
                    display: flex;
                    justify-content: center;
                    margin: 40px 0;
                }
                .tree-node {
                    position: relative;
                    margin: 0 40px;
                }
            `;
            document.head.appendChild(style);
        }

        // Function to reset traversal
        function resetTraversal() {
            traversalArray = [];
            currentTraversalIndex = 0;
            isAnimating = false;
            
            // Reset all nodes
            document.querySelectorAll('.tree-node').forEach(node => {
                node.classList.remove('visited', 'current');
            });
            
            // Clear array box container
            document.getElementById('arrayBoxContainer').innerHTML = '';
            
            // Reset traversal type
            document.getElementById('traversalType').textContent = 'No traversal selected';
        }

        // Function to perform inorder traversal
        function inorderTraversal() {
            if (!tree || tree.nodes.length === 0) {
                alert('Please create a tree first!');
                return;
            }
            
            if (isAnimating) {
                alert('Please wait for current animation to complete!');
                return;
            }
            
            document.getElementById('traversalType').textContent = 'Inorder Traversal';
            resetTraversal();
            
            // Generate inorder traversal
            const stack = [];
            let current = 0;
            
            function traverse() {
                while (current < tree.nodes.length || stack.length > 0) {
                    while (current < tree.nodes.length) {
                        stack.push(current);
                        current = 2 * current + 1; // Go to left child
                    }
                    
                    current = stack.pop();
                    traversalArray.push(current);
                    current = 2 * current + 2; // Go to right child
                }
            }
            
            traverse();
            animateTraversal();
        }

        // Function to perform preorder traversal
        function preorderTraversal() {
            if (!tree || tree.nodes.length === 0) {
                alert('Please create a tree first!');
                return;
            }
            
            if (isAnimating) {
                alert('Please wait for current animation to complete!');
                return;
            }
            
            document.getElementById('traversalType').textContent = 'Pre-order Traversal';
            resetTraversal();
            
            // Generate preorder traversal
            const stack = [0];
            
            while (stack.length > 0) {
                const current = stack.pop();
                if (current >= tree.nodes.length) continue;
                
                traversalArray.push(current);
                
                // Push right child first so left is processed first
                const rightChild = 2 * current + 2;
                const leftChild = 2 * current + 1;
                
                if (rightChild < tree.nodes.length) stack.push(rightChild);
                if (leftChild < tree.nodes.length) stack.push(leftChild);
            }
            
            animateTraversal();
        }

        // Function to perform postorder traversal
        function postorderTraversal() {
            if (!tree || tree.nodes.length === 0) {
                alert('Please create a tree first!');
                return;
            }
            
            if (isAnimating) {
                alert('Please wait for current animation to complete!');
                return;
            }
            
            document.getElementById('traversalType').textContent = 'Post-order Traversal';
            resetTraversal();
            
            // Generate postorder traversal
            const stack1 = [0];
            const stack2 = [];
            
            while (stack1.length > 0) {
                const current = stack1.pop();
                if (current >= tree.nodes.length) continue;
                
                stack2.push(current);
                
                const leftChild = 2 * current + 1;
                const rightChild = 2 * current + 2;
                
                if (leftChild < tree.nodes.length) stack1.push(leftChild);
                if (rightChild < tree.nodes.length) stack1.push(rightChild);
            }
            
            traversalArray = stack2.reverse();
            animateTraversal();
        }

        // Function to perform level-order traversal
        function levelorderTraversal() {
            if (!tree || tree.nodes.length === 0) {
                alert('Please create a tree first!');
                return;
            }
            
            if (isAnimating) {
                alert('Please wait for current animation to complete!');
                return;
            }
            
            document.getElementById('traversalType').textContent = 'Level-order Traversal';
            resetTraversal();
            
            // Generate level-order traversal
            const queue = [0];
            
            while (queue.length > 0) {
                const current = queue.shift();
                if (current >= tree.nodes.length) continue;
                
                traversalArray.push(current);
                
                const leftChild = 2 * current + 1;
                const rightChild = 2 * current + 2;
                
                if (leftChild < tree.nodes.length) queue.push(leftChild);
                if (rightChild < tree.nodes.length) queue.push(rightChild);
            }
            
            animateTraversal();
        }

        // Function to animate traversal
        function animateTraversal() {
            if (traversalArray.length === 0) return;
            
            isAnimating = true;
            const arrayBoxContainer = document.getElementById('arrayBoxContainer');
            arrayBoxContainer.innerHTML = '';
            
            // Clear previous node states
            document.querySelectorAll('.tree-node').forEach(node => {
                node.classList.remove('visited', 'current');
            });
            
            currentTraversalIndex = 0;
            
            function animateStep() {
                if (currentTraversalIndex >= traversalArray.length) {
                    isAnimating = false;
                    document.getElementById('result').innerHTML = `
                        <strong>Traversal Complete!</strong><br>
                        Order: ${traversalArray.map(idx => tree.nodes[idx].value).join(' → ')}
                    `;
                    return;
                }
                
                const nodeIndex = traversalArray[currentTraversalIndex];
                const node = document.getElementById(`node-${nodeIndex}`);
                
                if (node) {
                    // Highlight current node
                    document.querySelectorAll('.tree-node.current').forEach(n => {
                        n.classList.remove('current');
                        n.classList.add('visited');
                    });
                    
                    node.classList.add('current');
                    
                    // Add to array box
                    const arrayBox = document.createElement('div');
                    arrayBox.className = 'array-box current';
                    arrayBox.textContent = tree.nodes[nodeIndex].value;
                    arrayBoxContainer.appendChild(arrayBox);
                    
                    // Scroll array box container to show new box
                    arrayBoxContainer.scrollLeft = arrayBoxContainer.scrollWidth;
                    
                    // Update result
                    document.getElementById('result').innerHTML = `
                        <strong>Step ${currentTraversalIndex + 1}/${traversalArray.length}:</strong><br>
                        Visiting node with value ${tree.nodes[nodeIndex].value}
                    `;
                }
                
                currentTraversalIndex++;
                
                // Continue animation after delay
                setTimeout(() => {
                    if (node) {
                        node.classList.remove('current');
                        node.classList.add('visited');
                        
                        // Update array box
                        const lastBox = arrayBoxContainer.lastChild;
                        if (lastBox) {
                            lastBox.classList.remove('current');
                            lastBox.classList.add('visited');
                        }
                    }
                    
                    setTimeout(animateStep, 600);
                }, 800);
            }
            
            animateStep();
        }

        // Event Listeners
        document.getElementById('inorderButton').addEventListener('click', inorderTraversal);
        document.getElementById('preOrderButton').addEventListener('click', preorderTraversal);
        document.getElementById('postOrderButton').addEventListener('click', postorderTraversal);
        document.getElementById('labelOrderButton').addEventListener('click', levelorderTraversal);

        // Create a sample tree on load
        window.addEventListener('load', function() {
            const sampleValues = [50, 25, 75, 10, 30, 60, 90, 5, 15, 28, 35];
            createTreeFromArray(sampleValues);
            
            document.getElementById('result').innerHTML = `
                <strong>Sample tree loaded!</strong><br>
                Values: ${sampleValues.join(', ')}<br>
                Click on any traversal button to start visualization
            `;
        });