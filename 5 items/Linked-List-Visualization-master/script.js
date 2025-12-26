 // Linked List Node Class
        class ListNode {
            constructor(data) {
                this.data = data;
                this.next = null;
            }
        }

        // Linked List Class
        class LinkedList {
            constructor() {
                this.head = null;
                this.size = 0;
                this.animationSpeed = 500;
                this.pointerSpeed = 300;
                this.deleteSpeed = 500;
            }

            // Add node at the end
            add(data) {
                const newNode = new ListNode(data);
                if (!this.head) {
                    this.head = newNode;
                } else {
                    let current = this.head;
                    while (current.next) {
                        current = current.next;
                    }
                    current.next = newNode;
                }
                this.size++;
                return newNode;
            }

            // Insert node at specific index
            insertAt(data, index) {
                if (index < 0 || index > this.size) {
                    throw new Error("Invalid index");
                }

                const newNode = new ListNode(data);
                if (index === 0) {
                    newNode.next = this.head;
                    this.head = newNode;
                } else {
                    let current = this.head;
                    let previous = null;
                    let i = 0;

                    while (i < index) {
                        previous = current;
                        current = current.next;
                        i++;
                    }

                    newNode.next = current;
                    previous.next = newNode;
                }
                this.size++;
                return newNode;
            }

            // Remove node by index
            removeFrom(index) {
                if (index < 0 || index >= this.size) {
                    throw new Error("Invalid index");
                }

                let removedNode;
                if (index === 0) {
                    removedNode = this.head;
                    this.head = this.head.next;
                } else {
                    let current = this.head;
                    let previous = null;
                    let i = 0;

                    while (i < index) {
                        previous = current;
                        current = current.next;
                        i++;
                    }

                    removedNode = current;
                    previous.next = current.next;
                }
                this.size--;
                return removedNode;
            }

            // Remove node by data value
            removeData(data) {
                let current = this.head;
                let previous = null;

                while (current !== null) {
                    if (current.data === data) {
                        if (previous === null) {
                            this.head = current.next;
                        } else {
                            previous.next = current.next;
                        }
                        this.size--;
                        return current;
                    }
                    previous = current;
                    current = current.next;
                }
                return null;
            }

            // Update node data at index
            set(data, index) {
                if (index < 0 || index >= this.size) {
                    throw new Error("Invalid index");
                }

                let current = this.head;
                let i = 0;

                while (i < index) {
                    current = current.next;
                    i++;
                }

                const oldData = current.data;
                current.data = data;
                return { node: current, oldData };
            }

            // Get node at index
            get(index) {
                if (index < 0 || index >= this.size) {
                    throw new Error("Invalid index");
                }

                let current = this.head;
                let i = 0;

                while (i < index) {
                    current = current.next;
                    i++;
                }

                return current;
            }

            // Check if list is empty
            isEmpty() {
                return this.size === 0;
            }

            // Get list size
            getSize() {
                return this.size;
            }
        }

        // Visualization Class
        class LinkedListVisualizer {
            constructor() {
                this.list = new LinkedList();
                this.listContainer = document.getElementById('list');
                this.emptyMessage = document.getElementById('empty-message');
                this.errorElement = document.getElementById('error');
                this.errorText = document.getElementById('error-text');
                this.settingsError = document.getElementById('settings-error');
                this.settingsSuccess = document.getElementById('settings-success');
                
                this.initEventListeners();
                this.initSampleData();
            }

            // Initialize event listeners
            initEventListeners() {
                // Settings
                document.getElementById('settings-btn').addEventListener('click', () => {
                    document.getElementById('settings').classList.add('open');
                });

                document.getElementById('close-menu').addEventListener('click', () => {
                    document.getElementById('settings').classList.remove('open');
                });

                document.getElementById('save-settings').addEventListener('click', () => {
                    this.saveSettings();
                });

                // Operations
                document.getElementById('add-btn').addEventListener('click', () => {
                    this.addNode();
                });

                document.getElementById('insert-btn').addEventListener('click', () => {
                    this.insertNode();
                });

                document.getElementById('set-btn').addEventListener('click', () => {
                    this.updateNode();
                });

                document.getElementById('remove-btn').addEventListener('click', () => {
                    this.removeNode();
                });

                document.getElementById('remove-settings').addEventListener('click', () => {
                    this.toggleRemoveOptions();
                });

                document.getElementById('remove-index-btn').addEventListener('click', () => {
                    this.removeByIndex();
                });

                document.getElementById('remove-data-btn').addEventListener('click', () => {
                    this.removeByData();
                });

                // Enter key support
                document.getElementById('add-data').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addNode();
                });

                document.getElementById('insert-data').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.insertNode();
                });

                document.getElementById('set-data').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.updateNode();
                });

                document.getElementById('remove-data').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.removeByData();
                });

                document.getElementById('remove-index').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.removeByIndex();
                });
            }

            // Initialize with sample data
            initSampleData() {
                setTimeout(() => {
                    this.list.add(10);
                    this.renderList();
                    setTimeout(() => {
                        this.list.add(20);
                        this.renderList();
                        setTimeout(() => {
                            this.list.add(30);
                            this.renderList();
                        }, 500);
                    }, 500);
                }, 1000);
            }

            // Render the linked list
            renderList() {
                this.listContainer.innerHTML = '';
                
                if (this.list.isEmpty()) {
                    this.emptyMessage.style.display = 'flex';
                    this.emptyMessage.style.flexDirection = 'column';
                    this.emptyMessage.style.alignItems = 'center';
                    this.emptyMessage.style.justifyContent = 'center';
                    this.emptyMessage.style.color = '#b5a8ff';
                    this.emptyMessage.style.padding = '50px';
                    this.emptyMessage.style.gap = '15px';
                    this.listContainer.appendChild(this.emptyMessage);
                    return;
                }

                this.emptyMessage.style.display = 'none';
                
                let current = this.list.head;
                let index = 0;

                while (current) {
                    // Create node container
                    const nodeContainer = document.createElement('div');
                    nodeContainer.className = 'node';
                    nodeContainer.dataset.index = index;

                    // Create node data element
                    const nodeData = document.createElement('div');
                    nodeData.className = 'node-data';
                    nodeData.textContent = current.data;
                    nodeContainer.appendChild(nodeData);

                    // Create index label
                    const indexLabel = document.createElement('div');
                    indexLabel.className = 'node-index';
                    indexLabel.textContent = `Index: ${index}`;
                    nodeContainer.appendChild(indexLabel);

                    // Create pointer if not last node
                    if (current.next) {
                        const pointer = document.createElement('div');
                        pointer.className = 'node-pointer';
                        pointer.innerHTML = '<i class="fas fa-arrow-right"></i>';
                        nodeContainer.appendChild(pointer);
                    } else {
                        const nullPointer = document.createElement('div');
                        nullPointer.className = 'null-pointer';
                        nullPointer.textContent = 'NULL';
                        nodeContainer.appendChild(nullPointer);
                    }

                    this.listContainer.appendChild(nodeContainer);
                    current = current.next;
                    index++;
                }
            }

            // Highlight a specific node
            async highlightNode(index, duration = 1000) {
                const nodes = document.querySelectorAll('.node');
                if (nodes[index]) {
                    nodes[index].classList.add('highlight');
                    
                    if (index > 0) {
                        const pointer = nodes[index - 1].querySelector('.node-pointer');
                        if (pointer) pointer.classList.add('highlight');
                    }
                    
                    await this.sleep(duration);
                    
                    nodes[index].classList.remove('highlight');
                    if (index > 0) {
                        const pointer = nodes[index - 1].querySelector('.node-pointer');
                        if (pointer) pointer.classList.remove('highlight');
                    }
                }
            }

            // Add node
            async addNode() {
                const dataInput = document.getElementById('add-data');
                const data = parseInt(dataInput.value.trim());

                if (isNaN(data)) {
                    this.showError('Please enter a valid number for data');
                    this.shakeElement(dataInput);
                    return;
                }

                try {
                    this.hideError();
                    this.list.add(data);
                    this.renderList();
                    
                    // Highlight the new node
                    await this.sleep(this.list.animationSpeed);
                    await this.highlightNode(this.list.size - 1);
                    
                    dataInput.value = '';
                    dataInput.focus();
                } catch (error) {
                    this.showError(error.message);
                }
            }

            // Insert node at index
            async insertNode() {
                const indexInput = document.getElementById('insert-index');
                const dataInput = document.getElementById('insert-data');
                const index = parseInt(indexInput.value.trim());
                const data = parseInt(dataInput.value.trim());

                if (isNaN(index) || index < 0) {
                    this.showError('Please enter a valid index');
                    this.shakeElement(indexInput);
                    return;
                }

                if (isNaN(data)) {
                    this.showError('Please enter a valid number for data');
                    this.shakeElement(dataInput);
                    return;
                }

                try {
                    this.hideError();
                    this.list.insertAt(data, index);
                    this.renderList();
                    
                    // Highlight the inserted node
                    await this.sleep(this.list.animationSpeed);
                    await this.highlightNode(index);
                    
                    indexInput.value = '';
                    dataInput.value = '';
                    indexInput.focus();
                } catch (error) {
                    this.showError(error.message);
                }
            }

            // Update node
            async updateNode() {
                const indexInput = document.getElementById('set-index');
                const dataInput = document.getElementById('set-data');
                const index = parseInt(indexInput.value.trim());
                const data = parseInt(dataInput.value.trim());

                if (isNaN(index) || index < 0) {
                    this.showError('Please enter a valid index');
                    this.shakeElement(indexInput);
                    return;
                }

                if (isNaN(data)) {
                    this.showError('Please enter a valid number for data');
                    this.shakeElement(dataInput);
                    return;
                }

                try {
                    this.hideError();
                    const result = this.list.set(data, index);
                    this.renderList();
                    
                    // Highlight the updated node
                    await this.sleep(this.list.animationSpeed);
                    await this.highlightNode(index);
                    
                    indexInput.value = '';
                    dataInput.value = '';
                    indexInput.focus();
                } catch (error) {
                    this.showError(error.message);
                }
            }

            // Remove node
            async removeNode() {
                const removeIndex = document.getElementById('remove-index');
                const removeData = document.getElementById('remove-data');
                
                // Try index first, then data
                if (removeIndex.value.trim() !== '') {
                    await this.removeByIndex();
                } else if (removeData.value.trim() !== '') {
                    await this.removeByData();
                } else {
                    this.showError('Please enter either index or data to remove');
                }
            }

            // Remove by index
            async removeByIndex() {
                const indexInput = document.getElementById('remove-index');
                const index = parseInt(indexInput.value.trim());

                if (isNaN(index) || index < 0) {
                    this.showError('Please enter a valid index');
                    this.shakeElement(indexInput);
                    return;
                }

                try {
                    this.hideError();
                    
                    // Highlight before removing
                    await this.highlightNode(index);
                    
                    this.list.removeFrom(index);
                    this.renderList();
                    
                    indexInput.value = '';
                    indexInput.focus();
                    this.hideRemoveOptions();
                } catch (error) {
                    this.showError(error.message);
                }
            }

            // Remove by data
            async removeByData() {
                const dataInput = document.getElementById('remove-data');
                const data = parseInt(dataInput.value.trim());

                if (isNaN(data)) {
                    this.showError('Please enter a valid number for data');
                    this.shakeElement(dataInput);
                    return;
                }

                try {
                    this.hideError();
                    const removedNode = this.list.removeData(data);
                    
                    if (!removedNode) {
                        this.showError(`Node with data ${data} not found`);
                        return;
                    }
                    
                    this.renderList();
                    
                    dataInput.value = '';
                    dataInput.focus();
                    this.hideRemoveOptions();
                } catch (error) {
                    this.showError(error.message);
                }
            }

            // Toggle remove options
            toggleRemoveOptions() {
                const options = document.querySelectorAll('.remove-option');
                options.forEach(option => option.classList.toggle('show'));
            }

            // Hide remove options
            hideRemoveOptions() {
                const options = document.querySelectorAll('.remove-option');
                options.forEach(option => option.classList.remove('show'));
            }

            // Save settings
            saveSettings() {
                const nodeSpeed = parseInt(document.getElementById('node-speed').value);
                const pointerSpeed = parseInt(document.getElementById('pointer-speed').value);
                const deleteSpeed = parseInt(document.getElementById('delete-speed').value);

                if (isNaN(nodeSpeed) || nodeSpeed < 100 || nodeSpeed > 3000) {
                    this.showSettingsError('Node animation speed must be between 100 and 3000 ms');
                    return;
                }

                if (isNaN(pointerSpeed) || pointerSpeed < 100 || pointerSpeed > 3000) {
                    this.showSettingsError('Pointer animation speed must be between 100 and 3000 ms');
                    return;
                }

                if (isNaN(deleteSpeed) || deleteSpeed < 100 || deleteSpeed > 3000) {
                    this.showSettingsError('Delete animation speed must be between 100 and 3000 ms');
                    return;
                }

                this.list.animationSpeed = nodeSpeed;
                this.list.pointerSpeed = pointerSpeed;
                this.list.deleteSpeed = deleteSpeed;

                this.hideSettingsError();
                this.showSettingsSuccess('Settings saved successfully!');
                
                setTimeout(() => {
                    this.hideSettingsSuccess();
                }, 2000);
            }

            // Utility functions
            showError(message) {
                this.errorText.textContent = message;
                this.errorElement.classList.add('show');
            }

            hideError() {
                this.errorElement.classList.remove('show');
            }

            showSettingsError(message) {
                this.settingsError.textContent = message;
                this.settingsSuccess.classList.remove('show');
            }

            hideSettingsError() {
                this.settingsError.textContent = '';
            }

            showSettingsSuccess(message) {
                this.settingsSuccess.textContent = message;
                this.settingsSuccess.classList.add('show');
                this.settingsError.textContent = '';
            }

            hideSettingsSuccess() {
                this.settingsSuccess.classList.remove('show');
            }

            shakeElement(element) {
                element.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    element.style.animation = '';
                }, 500);
            }

            sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }

        // Initialize the visualizer when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            const visualizer = new LinkedListVisualizer();
        });