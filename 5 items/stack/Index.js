  // Stack implementation with limit
        class RoyalStack {
            constructor(limit = 5) {
                this.items = [];
                this.limit = limit;
                this.lastPushed = null;
                this.lastPopped = null;
                this.messageLog = [];
                this.updateCapacityBar();
                this.updateContainerHeight();
            }

            // Set stack limit
            setLimit(newLimit) {
                if (newLimit < this.items.length) {
                    this.addMessage(`Cannot set limit to ${newLimit} - stack has ${this.items.length} items. Pop some items first.`, 'error');
                    return false;
                }
                
                this.limit = newLimit;
                this.addMessage(`Stack limit set to ${newLimit}`, 'info');
                this.updateCapacityBar();
                this.updateLimitIndicator();
                this.updateContainerHeight();
                return true;
            }

            // Push element to stack
            push(element) {
                if (this.isFull()) {
                    this.addMessage(`Stack is full (limit: ${this.limit}). Cannot push "${element}".`, 'error');
                    return null;
                }
                
                this.items.push(element);
                this.lastPushed = element;
                this.addMessage(`Pushed gold brick "${element}" to stack`, 'success');
                this.updateDisplay();
                this.updateCapacityBar();
                this.updateContainerHeight();
                return element;
            }

            // Pop element from stack
            pop() {
                if (this.isEmpty()) {
                    this.addMessage("Stack is empty. Cannot pop.", 'error');
                    return null;
                }
                
                const popped = this.items.pop();
                this.lastPopped = popped;
                this.addMessage(`Popped gold brick "${popped}" from stack`, 'warning');
                this.updateDisplay();
                this.updateCapacityBar();
                this.updateContainerHeight();
                return popped;
            }

            // Get top element without popping
            peek() {
                if (this.isEmpty()) {
                    return null;
                }
                return this.items[this.items.length - 1];
            }

            // Check if stack is empty
            isEmpty() {
                return this.items.length === 0;
            }

            // Check if stack is full
            isFull() {
                return this.items.length >= this.limit;
            }

            // Get stack size
            size() {
                return this.items.length;
            }

            // Clear the stack
            clear() {
                this.items = [];
                this.lastPushed = null;
                this.lastPopped = null;
                this.addMessage("Stack cleared", 'info');
                this.updateDisplay();
                this.updateCapacityBar();
                this.updateContainerHeight();
            }

            // Add message to log
            addMessage(text, type = 'info') {
                const timestamp = new Date().toLocaleTimeString();
                this.messageLog.unshift({
                    text: `[${timestamp}] ${text}`,
                    type: type
                });
                
                // Keep only last 10 messages
                if (this.messageLog.length > 10) {
                    this.messageLog.pop();
                }
                
                this.updateMessageDisplay();
            }

            // Update visual display
            updateDisplay() {
                this.updateStackVisualization();
                this.updateInfoBoxes();
            }

            // Update stack visualization with gold bricks
            updateStackVisualization() {
                const stackContainer = document.getElementById('stack-container');
                
                // Remove existing bricks (except base and limit indicators)
                const existingBricks = stackContainer.querySelectorAll('.gold-brick, .stack-empty-message');
                existingBricks.forEach(brick => brick.remove());
                
                if (this.isEmpty()) {
                    const emptyMsg = document.createElement('div');
                    emptyMsg.className = 'stack-empty-message';
                    emptyMsg.innerHTML = `<i class="fas fa-layer-group"></i><br>Stack is empty<br><small>Push gold bricks to build your stack</small>`;
                    emptyMsg.style.color = '#b5a8ff';
                    emptyMsg.style.textAlign = 'center';
                    emptyMsg.style.padding = '50px';
                    emptyMsg.style.fontSize = '1.5rem';
                    emptyMsg.style.marginTop = 'auto';
                    emptyMsg.style.marginBottom = 'auto';
                    stackContainer.appendChild(emptyMsg);
                    return;
                }
                
                // Create gold bricks
                this.items.forEach((value, index) => {
                    const brick = document.createElement('div');
                    brick.className = 'gold-brick';
                    brick.textContent = value;
                    brick.dataset.index = index;
                    
                    // Mark top element
                    if (index === this.items.length - 1) {
                        brick.classList.add('top');
                        brick.title = `Top of stack: ${value}`;
                    } else {
                        brick.title = `Stack position: ${index}, Value: ${value}`;
                    }
                    
                    // Add index indicator
                    const indexIndicator = document.createElement('div');
                    indexIndicator.className = 'brick-index';
                    indexIndicator.textContent = `Index: ${index}`;
                    brick.appendChild(indexIndicator);
                    
                    stackContainer.appendChild(brick);
                });
            }

            // Update information boxes
            updateInfoBoxes() {
                // Top of stack
                const topBox = document.getElementById('top-box');
                const topValue = this.peek();
                
                if (topValue !== null) {
                    topBox.textContent = topValue;
                    topBox.classList.remove('empty');
                } else {
                    topBox.textContent = 'Empty';
                    topBox.classList.add('empty');
                }
                
                // Last pushed
                const lastPushedBox = document.getElementById('last-pushed-box');
                if (this.lastPushed !== null) {
                    lastPushedBox.textContent = this.lastPushed;
                    lastPushedBox.classList.remove('empty');
                } else {
                    lastPushedBox.textContent = 'None';
                    lastPushedBox.classList.add('empty');
                }
                
                // Last popped
                const lastPoppedBox = document.getElementById('last-popped-box');
                if (this.lastPopped !== null) {
                    lastPoppedBox.textContent = this.lastPopped;
                    lastPoppedBox.classList.remove('empty');
                } else {
                    lastPoppedBox.textContent = 'None';
                    lastPoppedBox.classList.add('empty');
                }
                
                // Size
                const sizeBox = document.getElementById('size-box');
                sizeBox.textContent = this.size();
                
                // Update capacity text
                document.getElementById('current-size').textContent = this.size();
                document.getElementById('stack-limit').textContent = this.limit;
            }

            // Update message display
            updateMessageDisplay() {
                const messageContainer = document.getElementById('message-container');
                messageContainer.innerHTML = '';
                
                this.messageLog.forEach(message => {
                    const messageElement = document.createElement('div');
                    messageElement.className = `message-item ${message.type}`;
                    messageElement.textContent = message.text;
                    messageContainer.appendChild(messageElement);
                });
            }

            // Update capacity bar
            updateCapacityBar() {
                const capacityFill = document.getElementById('capacity-fill');
                const percentage = (this.size() / this.limit) * 100;
                
                capacityFill.style.width = `${percentage}%`;
                
                // Change color based on fill level
                capacityFill.classList.remove('warning', 'danger');
                if (percentage >= 80) {
                    capacityFill.classList.add('danger');
                } else if (percentage >= 60) {
                    capacityFill.classList.add('warning');
                }
            }

            // Update limit indicator
            updateLimitIndicator() {
                const limitIndicator = document.getElementById('limit-indicator');
                const limitText = document.getElementById('limit-text');
                
                if (this.limit <= 20) {
                    limitIndicator.style.display = 'block';
                    limitText.style.display = 'block';
                } else {
                    limitIndicator.style.display = 'none';
                    limitText.style.display = 'none';
                }
            }

            // Update container height based on stack size
            updateContainerHeight() {
                const stackContainer = document.getElementById('stack-container');
                const brickHeight = 70; // 60px height + 5px top margin + 5px bottom margin
                const baseHeight = 15;
                const paddingBottom = 10;
                const minHeight = 120;
                
                // Calculate required height
                let requiredHeight = this.size() * brickHeight + baseHeight + paddingBottom;
                
                // Ensure minimum height
                requiredHeight = Math.max(requiredHeight, minHeight);
                
                // Set the container height
                stackContainer.style.minHeight = `${requiredHeight}px`;
                
                // If stack is full, show max height
                if (this.isFull() && this.limit <= 10) {
                    stackContainer.style.minHeight = `${this.limit * brickHeight + baseHeight + paddingBottom}px`;
                }
            }
        }

        // Initialize the stack with default limit
        const royalStack = new RoyalStack(5);
        royalStack.updateLimitIndicator();

        // Initialize with some sample values
        setTimeout(() => {
            royalStack.push(42);
            setTimeout(() => royalStack.push(17), 300);
            setTimeout(() => royalStack.push(89), 600);
        }, 500);

        // DOM elements
        const pushButton = document.getElementById('push-btn');
        const popButton = document.getElementById('pop-btn');
        const resetButton = document.getElementById('reset-btn');
        const setLimitButton = document.getElementById('set-limit-btn');
        const valueInput = document.getElementById('value-input');
        const limitInput = document.getElementById('limit-input');

        // Push button event
        pushButton.addEventListener('click', () => {
            const value = valueInput.value.trim();
            
            if (!value) {
                royalStack.addMessage('Please enter a value to push', 'error');
                // Shake animation for input
                valueInput.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    valueInput.style.animation = '';
                }, 500);
                return;
            }
            
            // Check if stack is full
            if (royalStack.isFull()) {
                royalStack.addMessage(`Stack is full (limit: ${royalStack.limit}). Cannot push.`, 'error');
                return;
            }
            
            // Remove top class from current top brick
            const topBrick = document.querySelector('.gold-brick.top');
            if (topBrick) {
                topBrick.classList.remove('top');
            }
            
            // Push the value
            const pushedValue = royalStack.push(value);
            
            if (pushedValue !== null) {
                // Add pushing animation to new brick
                const newBrick = document.querySelector('.gold-brick:last-child');
                if (newBrick) {
                    newBrick.classList.add('pushing');
                    
                    setTimeout(() => {
                        newBrick.classList.remove('pushing');
                    }, 500);
                }
                
                // Clear input
                valueInput.value = '';
                valueInput.focus();
            }
            
            // Update button states
            updateButtonStates();
        });

        // Pop button event
        popButton.addEventListener('click', () => {
            if (royalStack.isEmpty()) {
                royalStack.addMessage('Stack is empty. Cannot pop.', 'error');
                return;
            }
            
            // Add popping animation to top brick
            const topBrick = document.querySelector('.gold-brick.top');
            if (topBrick) {
                topBrick.classList.add('popping');
                
                // After animation, remove from stack
                setTimeout(() => {
                    royalStack.pop();
                    updateButtonStates();
                }, 400);
            } else {
                royalStack.pop();
                updateButtonStates();
            }
        });

        // Reset button event
        resetButton.addEventListener('click', () => {
            // Animate all bricks popping
            const bricks = document.querySelectorAll('.gold-brick');
            if (bricks.length > 0) {
                bricks.forEach((brick, index) => {
                    setTimeout(() => {
                        brick.classList.add('popping');
                    }, index * 100);
                });
                
                // Clear after animations
                setTimeout(() => {
                    royalStack.clear();
                    updateButtonStates();
                }, bricks.length * 100 + 400);
            } else {
                royalStack.clear();
                updateButtonStates();
            }
        });

        // Set limit button event
        setLimitButton.addEventListener('click', () => {
            const limitValue = parseInt(limitInput.value);
            
            if (isNaN(limitValue) || limitValue < 1 || limitValue > 50) {
                royalStack.addMessage('Please enter a valid limit between 1 and 50', 'error');
                limitInput.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    limitInput.style.animation = '';
                }, 500);
                return;
            }
            
            const success = royalStack.setLimit(limitValue);
            if (success) {
                limitInput.value = limitValue;
                updateButtonStates();
            }
        });

        // Enter key support for inputs
        valueInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                pushButton.click();
            }
        });
        
        limitInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                setLimitButton.click();
            }
        });

        // Update button states based on stack
        function updateButtonStates() {
            popButton.disabled = royalStack.isEmpty();
            pushButton.disabled = royalStack.isFull();
            
            // Update push button text if stack is full
            if (royalStack.isFull()) {
                pushButton.innerHTML = '<i class="fas fa-ban"></i> Stack Full';
            } else {
                pushButton.innerHTML = '<i class="fas fa-plus-circle"></i> Push';
            }
        }

        // Initialize button states
        updateButtonStates();

        // Add CSS for shake animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            .stack-empty-message {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: #b5a8ff;
                text-align: center;
                width: 100%;
                flex-grow: 1;
            }
            
            .stack-empty-message i {
                font-size: 3rem;
                margin-bottom: 20px;
                opacity: 0.7;
            }
            
            .stack-empty-message small {
                font-size: 1rem;
                margin-top: 10px;
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);