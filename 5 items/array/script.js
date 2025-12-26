  // Array state
        let array = [];
        let activeIndex = -1;
        
        // DOM elements
        const arrayContainer = document.getElementById('array-container');
        const emptyMessage = document.getElementById('empty-message');
        const valueInput = document.getElementById('value-input');
        const indexInput = document.getElementById('index-input');
        const insertButton = document.getElementById('insert-button');
        const updateButton = document.getElementById('update-button');
        const deleteButton = document.getElementById('delete-button');
        const randomButton = document.getElementById('random-generate-button');
        
        // Stats elements
        const arraySizeElement = document.getElementById('array-size');
        const arrayMaxElement = document.getElementById('array-max');
        const arrayMinElement = document.getElementById('array-min');
        const arraySumElement = document.getElementById('array-sum');
        
        // Initialize with a sample array
        initializeArray();
        
        function initializeArray() {
            // Start with a sample array
            array = [42, 17, 89, 33, 56];
            renderArray();
            updateStats();
        }
        
        function renderArray() {
            // Clear the array container
            arrayContainer.innerHTML = '';
            
            if (array.length === 0) {
                // Show empty message
                emptyMessage.style.display = 'block';
                return;
            }
            
            // Hide empty message
            emptyMessage.style.display = 'none';
            
            // Create elements for each array item
            array.forEach((value, index) => {
                const element = document.createElement('div');
                element.className = 'array-element';
                element.dataset.index = index;
                
                // Add index label
                const indexLabel = document.createElement('div');
                indexLabel.className = 'element-index';
                indexLabel.textContent = `Index: ${index}`;
                
                // Add value
                const valueDisplay = document.createElement('div');
                valueDisplay.className = 'element-value';
                valueDisplay.textContent = value;
                
                // Add tooltip on hover
                element.title = `Index: ${index}\nValue: ${value}`;
                
                element.appendChild(indexLabel);
                element.appendChild(valueDisplay);
                
                // Add click handler to select element
                element.addEventListener('click', () => {
                    setActiveIndex(index);
                    indexInput.value = index;
                });
                
                // Add hover effect
                element.addEventListener('mouseenter', () => {
                    if (activeIndex !== index) {
                        element.classList.add('active');
                    }
                });
                
                element.addEventListener('mouseleave', () => {
                    if (activeIndex !== index) {
                        element.classList.remove('active');
                    }
                });
                
                // Add to container
                arrayContainer.appendChild(element);
            });
            
            // Highlight active element if any
            if (activeIndex >= 0 && activeIndex < array.length) {
                const activeElement = arrayContainer.querySelector(`.array-element[data-index="${activeIndex}"]`);
                if (activeElement) {
                    activeElement.classList.add('active');
                }
            }
        }
        
        function setActiveIndex(index) {
            // Remove active class from all elements
            const elements = document.querySelectorAll('.array-element');
            elements.forEach(el => el.classList.remove('active'));
            
            // Set new active index
            activeIndex = index;
            
            // Add active class to clicked element
            if (index >= 0 && index < array.length) {
                const activeElement = arrayContainer.querySelector(`.array-element[data-index="${index}"]`);
                if (activeElement) {
                    activeElement.classList.add('active');
                }
            }
        }
        
        function updateStats() {
            arraySizeElement.textContent = array.length;
            
            if (array.length > 0) {
                const max = Math.max(...array);
                const min = Math.min(...array);
                const sum = array.reduce((acc, val) => acc + val, 0);
                
                arrayMaxElement.textContent = max;
                arrayMinElement.textContent = min;
                arraySumElement.textContent = sum;
            } else {
                arrayMaxElement.textContent = 0;
                arrayMinElement.textContent = 0;
                arraySumElement.textContent = 0;
            }
        }
        
        // Insert operation
        insertButton.addEventListener('click', () => {
            const value = parseInt(valueInput.value);
            
            if (isNaN(value)) {
                showMessage('Please enter a valid value', 'error');
                return;
            }
            
            const index = parseInt(indexInput.value);
            
            if (isNaN(index)) {
                // Insert at the end
                array.push(value);
                renderArray();
                
                // Animate the new element
                const newIndex = array.length - 1;
                const newElement = arrayContainer.querySelector(`.array-element[data-index="${newIndex}"]`);
                if (newElement) {
                    newElement.classList.add('inserting');
                    setTimeout(() => {
                        newElement.classList.remove('inserting');
                    }, 800);
                }
                
                showMessage(`Value ${value} inserted at the end of the array`, 'success');
            } else {
                // Validate index
                if (index < 0 || index > array.length) {
                    showMessage(`Index must be between 0 and ${array.length}`, 'error');
                    return;
                }
                
                // Insert at specified index
                array.splice(index, 0, value);
                renderArray();
                
                // Animate the new element
                const newElement = arrayContainer.querySelector(`.array-element[data-index="${index}"]`);
                if (newElement) {
                    newElement.classList.add('inserting');
                    setTimeout(() => {
                        newElement.classList.remove('inserting');
                    }, 800);
                }
                
                showMessage(`Value ${value} inserted at index ${index}`, 'success');
            }
            
            // Clear inputs and update stats
            valueInput.value = '';
            indexInput.value = '';
            updateStats();
        });
        
        // Update operation
        updateButton.addEventListener('click', () => {
            const value = parseInt(valueInput.value);
            const index = parseInt(indexInput.value);
            
            if (isNaN(value)) {
                showMessage('Please enter a valid value', 'error');
                return;
            }
            
            if (isNaN(index)) {
                showMessage('Please enter a valid index for update operation', 'error');
                return;
            }
            
            // Validate index
            if (index < 0 || index >= array.length) {
                showMessage(`Index must be between 0 and ${array.length - 1}`, 'error');
                return;
            }
            
            // Store old value
            const oldValue = array[index];
            
            // Update the value
            array[index] = value;
            
            // Re-render and animate
            renderArray();
            
            // Animate the updated element
            const updatedElement = arrayContainer.querySelector(`.array-element[data-index="${index}"]`);
            if (updatedElement) {
                updatedElement.classList.add('updating');
                setTimeout(() => {
                    updatedElement.classList.remove('updating');
                }, 800);
            }
            
            showMessage(`Index ${index} updated from ${oldValue} to ${value}`, 'success');
            
            // Clear inputs and update stats
            valueInput.value = '';
            indexInput.value = '';
            updateStats();
        });
        
        // Delete operation
        deleteButton.addEventListener('click', () => {
            const index = parseInt(indexInput.value);
            
            if (isNaN(index)) {
                showMessage('Please enter a valid index for delete operation', 'error');
                return;
            }
            
            // Validate index
            if (index < 0 || index >= array.length) {
                showMessage(`Index must be between 0 and ${array.length - 1}`, 'error');
                return;
            }
            
            // Store deleted value
            const deletedValue = array[index];
            
            // Animate deletion before removing
            const deletedElement = arrayContainer.querySelector(`.array-element[data-index="${index}"]`);
            if (deletedElement) {
                deletedElement.classList.add('deleting');
                
                // Remove from array after animation
                setTimeout(() => {
                    array.splice(index, 1);
                    renderArray();
                    updateStats();
                }, 800);
            }
            
            showMessage(`Value ${deletedValue} deleted from index ${index}`, 'success');
            
            // Clear input
            indexInput.value = '';
        });
        
        // Generate random array
        randomButton.addEventListener('click', () => {
            // Generate random array with 5-10 elements
            const size = Math.floor(Math.random() * 6) + 5; // 5 to 10
            array = [];
            
            for (let i = 0; i < size; i++) {
                array.push(Math.floor(Math.random() * 100) + 1); // 1 to 100
            }
            
            renderArray();
            updateStats();
            showMessage(`Generated random array with ${size} elements`, 'success');
            
            // Clear inputs
            valueInput.value = '';
            indexInput.value = '';
        });
        
        // Show message function
        function showMessage(message, type) {
            // Create message element
            const messageEl = document.createElement('div');
            messageEl.className = `royal-message ${type}`;
            messageEl.textContent = message;
            
            // Style the message
            messageEl.style.position = 'fixed';
            messageEl.style.top = '20px';
            messageEl.style.right = '20px';
            messageEl.style.padding = '15px 25px';
            messageEl.style.borderRadius = '10px';
            messageEl.style.fontWeight = 'bold';
            messageEl.style.zIndex = '1000';
            messageEl.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            messageEl.style.animation = 'slideIn 0.3s ease-out';
            
            // Set color based on type
            if (type === 'success') {
                messageEl.style.background = 'linear-gradient(145deg, #4CAF50, #2E7D32)';
                messageEl.style.color = 'white';
                messageEl.style.border = '2px solid #81C784';
            } else {
                messageEl.style.background = 'linear-gradient(145deg, #f44336, #b71c1c)';
                messageEl.style.color = 'white';
                messageEl.style.border = '2px solid #EF9A9A';
            }
            
            // Add to document
            document.body.appendChild(messageEl);
            
            // Remove after 3 seconds
            setTimeout(() => {
                messageEl.style.animation = 'slideOut 0.3s ease-out forwards';
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.parentNode.removeChild(messageEl);
                    }
                }, 300);
            }, 3000);
            
            // Add CSS for animations
            if (!document.querySelector('#message-animations')) {
                const style = document.createElement('style');
                style.id = 'message-animations';
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Add some interactive effects to inputs
        const inputs = document.querySelectorAll('.royal-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'translateY(-5px)';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = 'translateY(0)';
            });
        });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter to insert
            if (e.ctrlKey && e.key === 'Enter') {
                insertButton.click();
            }
            
            // Escape to clear active element
            if (e.key === 'Escape') {
                setActiveIndex(-1);
            }
            
            // Number keys to quickly set index
            if (e.key >= '0' && e.key <= '9' && !e.ctrlKey && !e.altKey) {
                if (document.activeElement !== indexInput && document.activeElement !== valueInput) {
                    indexInput.value = e.key;
                    indexInput.focus();
                }
            }
        });