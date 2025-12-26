  // Queue implementation with limit
        class RoyalQueue {
            constructor(limit = 10) {
                this.items = [];
                this.limit = limit;
                this.lastEnqueued = null;
                this.lastDequeued = null;
                this.messageLog = [];
                this.updateCapacityBar();
                this.updateContainerWidth();
            }

            // Set queue limit
            setLimit(newLimit) {
                if (newLimit < this.items.length) {
                    this.addMessage(`Cannot set limit to ${newLimit} - queue has ${this.items.length} items. Dequeue some items first.`, 'error');
                    return false;
                }
                
                this.limit = newLimit;
                this.addMessage(`Queue limit set to ${newLimit}`, 'info');
                this.updateCapacityBar();
                this.updateLimitIndicator();
                this.updateContainerWidth();
                return true;
            }

            // Enqueue element to queue
            enqueue(element) {
                if (this.isFull()) {
                    this.addMessage(`Queue is full (limit: ${this.limit}). Cannot enqueue "${element}".`, 'error');
                    return null;
                }
                
                this.items.push(element);
                this.lastEnqueued = element;
                this.addMessage(`Enqueued gold coin "${element}" to queue`, 'success');
                this.updateDisplay();
                this.updateCapacityBar();
                this.updateContainerWidth();
                return element;
            }

            // Dequeue element from queue
            dequeue() {
                if (this.isEmpty()) {
                    this.addMessage("Queue is empty. Cannot dequeue.", 'error');
                    return null;
                }
                
                const dequeued = this.items.shift();
                this.lastDequeued = dequeued;
                this.addMessage(`Dequeued gold coin "${dequeued}" from queue`, 'warning');
                this.updateDisplay();
                this.updateCapacityBar();
                this.updateContainerWidth();
                return dequeued;
            }

            // Get front element without dequeuing
            front() {
                if (this.isEmpty()) {
                    return null;
                }
                return this.items[0];
            }

            // Get rear element without dequeuing
            rear() {
                if (this.isEmpty()) {
                    return null;
                }
                return this.items[this.items.length - 1];
            }

            // Check if queue is empty
            isEmpty() {
                return this.items.length === 0;
            }

            // Check if queue is full
            isFull() {
                return this.items.length >= this.limit;
            }

            // Get queue size
            size() {
                return this.items.length;
            }

            // Clear the queue
            clear() {
                this.items = [];
                this.lastEnqueued = null;
                this.lastDequeued = null;
                this.addMessage("Queue cleared", 'info');
                this.updateDisplay();
                this.updateCapacityBar();
                this.updateContainerWidth();
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
                this.updateQueueVisualization();
                this.updateInfoBoxes();
                this.updatePositionIndicators();
            }

            // Update queue visualization with gold coins
            updateQueueVisualization() {
                const queueContainer = document.getElementById('queue-container');
                
                // Remove existing coins (except base and limit indicators)
                const existingCoins = queueContainer.querySelectorAll('.gold-coin, .queue-empty-message');
                existingCoins.forEach(coin => coin.remove());
                
                if (this.isEmpty()) {
                    const emptyMsg = document.createElement('div');
                    emptyMsg.className = 'queue-empty-message';
                    emptyMsg.innerHTML = `<i class="fas fa-layer-group"></i><br>Queue is empty<br><small>Enqueue gold coins to build your queue</small>`;
                    emptyMsg.style.color = '#b5a8ff';
                    emptyMsg.style.textAlign = 'center';
                    emptyMsg.style.padding = '50px';
                    emptyMsg.style.fontSize = '1.5rem';
                    emptyMsg.style.width = '100%';
                    emptyMsg.style.margin = 'auto';
                    queueContainer.appendChild(emptyMsg);
                    return;
                }
                
                // Create gold coins
                this.items.forEach((value, index) => {
                    const coin = document.createElement('div');
                    coin.className = 'gold-coin';
                    coin.textContent = value;
                    coin.dataset.index = index;
                    
                    // Mark front and rear elements
                    if (index === 0) {
                        coin.classList.add('front');
                        coin.title = `Front of queue: ${value}`;
                    } else if (index === this.items.length - 1) {
                        coin.classList.add('rear');
                        coin.title = `Rear of queue: ${value}`;
                    } else {
                        coin.title = `Queue position: ${index}, Value: ${value}`;
                    }
                    
                    // Add index indicator
                    const indexIndicator = document.createElement('div');
                    indexIndicator.className = 'coin-index';
                    indexIndicator.textContent = `Pos: ${index}`;
                    coin.appendChild(indexIndicator);
                    
                    queueContainer.appendChild(coin);
                });
            }

            // Update information boxes
            updateInfoBoxes() {
                // Front of queue
                const frontBox = document.getElementById('front-box');
                const frontValue = this.front();
                
                if (frontValue !== null) {
                    frontBox.textContent = frontValue;
                    frontBox.classList.remove('empty');
                } else {
                    frontBox.textContent = 'Empty';
                    frontBox.classList.add('empty');
                }
                
                // Rear of queue
                const rearBox = document.getElementById('rear-box');
                const rearValue = this.rear();
                
                if (rearValue !== null) {
                    rearBox.textContent = rearValue;
                    rearBox.classList.remove('empty');
                } else {
                    rearBox.textContent = 'Empty';
                    rearBox.classList.add('empty');
                }
                
                // Last enqueued
                const lastEnqueuedBox = document.getElementById('last-enqueued-box');
                if (this.lastEnqueued !== null) {
                    lastEnqueuedBox.textContent = this.lastEnqueued;
                    lastEnqueuedBox.classList.remove('empty');
                } else {
                    lastEnqueuedBox.textContent = 'None';
                    lastEnqueuedBox.classList.add('empty');
                }
                
                // Last dequeued
                const lastDequeuedBox = document.getElementById('last-dequeued-box');
                if (this.lastDequeued !== null) {
                    lastDequeuedBox.textContent = this.lastDequeued;
                    lastDequeuedBox.classList.remove('empty');
                } else {
                    lastDequeuedBox.textContent = 'None';
                    lastDequeuedBox.classList.add('empty');
                }
                
                // Size
                const sizeBox = document.getElementById('size-box');
                sizeBox.textContent = this.size();
                
                // Update capacity text
                document.getElementById('current-size').textContent = this.size();
                document.getElementById('queue-limit').textContent = this.limit;
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

            // Update container width based on queue size
            updateContainerWidth() {
                const queueContainer = document.getElementById('queue-container');
                const coinWidth = 120; // 100px width + 10px left margin + 10px right margin
                const minWidth = 200;
                
                // Calculate required width
                let requiredWidth = this.size() * coinWidth + 40; // Add padding
                
                // Ensure minimum width
                requiredWidth = Math.max(requiredWidth, minWidth);
                
                // Set the container width for small queues
                if (this.size() < 5) {
                    queueContainer.style.minWidth = `${requiredWidth}px`;
                } else {
                    queueContainer.style.minWidth = '100%';
                }
            }

            // Update position indicators
            updatePositionIndicators() {
                const frontIndicator = document.getElementById('front-indicator');
                const rearIndicator = document.getElementById('rear-indicator');
                
                if (this.isEmpty()) {
                    frontIndicator.style.display = 'none';
                    rearIndicator.style.display = 'none';
                } else {
                    frontIndicator.style.display = 'block';
                    rearIndicator.style.display = 'block';
                }
            }
        }

        // Initialize the queue with default limit
        const royalQueue = new RoyalQueue(10);
        royalQueue.updateLimitIndicator();

        // Initialize with some sample values
        setTimeout(() => {
            royalQueue.enqueue(10);
            setTimeout(() => royalQueue.enqueue(20), 300);
            setTimeout(() => royalQueue.enqueue(30), 600);
            setTimeout(() => royalQueue.enqueue(40), 900);
        }, 500);

        // DOM elements
        const enqueueButton = document.getElementById('enqueue-btn');
        const dequeueButton = document.getElementById('dequeue-btn');
        const resetButton = document.getElementById('reset-btn');
        const setLimitButton = document.getElementById('set-limit-btn');
        const valueInput = document.getElementById('value-input');
        const limitInput = document.getElementById('limit-input');

        // Enqueue button event
        enqueueButton.addEventListener('click', () => {
            const value = valueInput.value.trim();
            
            if (!value) {
                royalQueue.addMessage('Please enter a value to enqueue', 'error');
                // Shake animation for input
                valueInput.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    valueInput.style.animation = '';
                }, 500);
                return;
            }
            
            // Check if queue is full
            if (royalQueue.isFull()) {
                royalQueue.addMessage(`Queue is full (limit: ${royalQueue.limit}). Cannot enqueue.`, 'error');
                return;
            }
            
            // Remove rear class from current rear coin
            const rearCoin = document.querySelector('.gold-coin.rear');
            if (rearCoin) {
                rearCoin.classList.remove('rear');
            }
            
            // Enqueue the value
            const enqueuedValue = royalQueue.enqueue(value);
            
            if (enqueuedValue !== null) {
                // Add enqueuing animation to new coin
                const newCoin = document.querySelector('.gold-coin:last-child');
                if (newCoin) {
                    newCoin.classList.add('enqueuing');
                    
                    setTimeout(() => {
                        newCoin.classList.remove('enqueuing');
                    }, 500);
                }
                
                // Clear input
                valueInput.value = '';
                valueInput.focus();
            }
            
            // Update button states
            updateButtonStates();
        });

        // Dequeue button event
        dequeueButton.addEventListener('click', () => {
            if (royalQueue.isEmpty()) {
                royalQueue.addMessage('Queue is empty. Cannot dequeue.', 'error');
                return;
            }
            
            // Add dequeuing animation to front coin
            const frontCoin = document.querySelector('.gold-coin.front');
            if (frontCoin) {
                frontCoin.classList.add('dequeuing');
                
                // After animation, remove from queue
                setTimeout(() => {
                    royalQueue.dequeue();
                    updateButtonStates();
                }, 400);
            } else {
                royalQueue.dequeue();
                updateButtonStates();
            }
        });

        // Reset button event
        resetButton.addEventListener('click', () => {
            // Animate all coins dequeuing
            const coins = document.querySelectorAll('.gold-coin');
            if (coins.length > 0) {
                coins.forEach((coin, index) => {
                    setTimeout(() => {
                        coin.classList.add('dequeuing');
                    }, index * 100);
                });
                
                // Clear after animations
                setTimeout(() => {
                    royalQueue.clear();
                    updateButtonStates();
                }, coins.length * 100 + 400);
            } else {
                royalQueue.clear();
                updateButtonStates();
            }
        });

        // Set limit button event
        setLimitButton.addEventListener('click', () => {
            const limitValue = parseInt(limitInput.value);
            
            if (isNaN(limitValue) || limitValue < 1 || limitValue > 50) {
                royalQueue.addMessage('Please enter a valid limit between 1 and 50', 'error');
                limitInput.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    limitInput.style.animation = '';
                }, 500);
                return;
            }
            
            const success = royalQueue.setLimit(limitValue);
            if (success) {
                limitInput.value = limitValue;
                updateButtonStates();
            }
        });

        // Enter key support for inputs
        valueInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                enqueueButton.click();
            }
        });
        
        limitInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                setLimitButton.click();
            }
        });

        // Update button states based on queue
        function updateButtonStates() {
            dequeueButton.disabled = royalQueue.isEmpty();
            enqueueButton.disabled = royalQueue.isFull();
            
            // Update enqueue button text if queue is full
            if (royalQueue.isFull()) {
                enqueueButton.innerHTML = '<i class="fas fa-ban"></i> Queue Full';
            } else {
                enqueueButton.innerHTML = '<i class="fas fa-plus-circle"></i> Enqueue';
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
            
            .queue-empty-message {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: #b5a8ff;
                text-align: center;
                width: 100%;
            }
            
            .queue-empty-message i {
                font-size: 3rem;
                margin-bottom: 20px;
                opacity: 0.7;
            }
            
            .queue-empty-message small {
                font-size: 1rem;
                margin-top: 10px;
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);