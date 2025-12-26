// Global state for each algorithm
        const algorithmStates = {
            bubble: {
                data: [5, 3, 8, 1, 9, 2, 7, 4, 6],
                steps: 0,
                comparisons: 0,
                swaps: 0,
                startTime: 0,
                isSorting: false,
                isPaused: false,
                timeoutId: null,
                currentStep: null
            },
            selection: {
                data: [9, 3, 7, 1, 8, 2, 5, 4, 6],
                steps: 0,
                comparisons: 0,
                swaps: 0,
                startTime: 0,
                isSorting: false,
                isPaused: false,
                timeoutId: null,
                currentStep: null
            },
            merge: {
                data: [6, 2, 9, 1, 7, 3, 8, 4, 5],
                steps: 0,
                comparisons: 0,
                merges: 0,
                startTime: 0,
                isSorting: false,
                isPaused: false,
                timeoutId: null,
                currentStep: null
            },
            quick: {
                data: [8, 3, 7, 1, 9, 2, 6, 4, 5],
                steps: 0,
                comparisons: 0,
                swaps: 0,
                startTime: 0,
                isSorting: false,
                isPaused: false,
                timeoutId: null,
                currentStep: null
            },
            insertion: {
                data: [7, 2, 8, 1, 9, 3, 6, 4, 5],
                steps: 0,
                comparisons: 0,
                swaps: 0,
                startTime: 0,
                isSorting: false,
                isPaused: false,
                timeoutId: null,
                currentStep: null
            }
        };

        // Function to show selected algorithm
        function showAlgorithm(algorithmId) {
            // Hide all algorithm boxes
            document.querySelectorAll('.right-box').forEach(box => {
                box.classList.remove('active');
            });
            
            // Show the selected algorithm box
            document.getElementById(`right-box-${algorithmId}`).classList.add('active');
            
            // Generate visualization for the selected algorithm
            const algorithmNames = ['bubble', 'selection', 'merge', 'quick', 'insertion'];
            const algorithmName = algorithmNames[algorithmId - 1];
            generateVisualization(algorithmName);
        }

        // Function to generate visualization
        function generateVisualization(algorithm) {
            const state = algorithmStates[algorithm];
            
            // Update array visualization
            updateArrayVisualization(algorithm, state.data);
            
            // Update bar visualization
            updateBarVisualization(algorithm, state.data);
            
            // Update stats
            updateStats(algorithm);
        }

        // Function to update array visualization
        function updateArrayVisualization(algorithm, data, highlights = {}) {
            const container = document.getElementById(`${algorithm}-array`);
            container.innerHTML = '';
            
            const maxValue = Math.max(...data);
            
            data.forEach((value, index) => {
                const element = document.createElement('div');
                element.className = 'array-element';
                element.textContent = value;
                
                // Apply highlights
                if (highlights.comparing && highlights.comparing.includes(index)) {
                    element.classList.add('comparing');
                }
                if (highlights.swapping && highlights.swapping.includes(index)) {
                    element.classList.add('swapping');
                }
                if (highlights.sorted && highlights.sorted.includes(index)) {
                    element.classList.add('sorted');
                }
                if (highlights.pivot && highlights.pivot === index) {
                    element.classList.add('pivot');
                }
                if (highlights.current && highlights.current === index) {
                    element.classList.add('current');
                }
                
                container.appendChild(element);
            });
        }

        // Function to update bar visualization
        function updateBarVisualization(algorithm, data, highlights = {}) {
            const container = document.getElementById(`${algorithm}-bars`);
            container.innerHTML = '';
            
            const maxValue = Math.max(...data);
            
            data.forEach((value, index) => {
                const barHeight = (value / maxValue) * 100;
                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = `${barHeight}%`;
                bar.innerHTML = `<div class="bar-value">${value}</div>`;
                
                // Apply highlights
                if (highlights.comparing && highlights.comparing.includes(index)) {
                    bar.classList.add('comparing');
                }
                if (highlights.swapping && highlights.swapping.includes(index)) {
                    bar.classList.add('swapping');
                }
                if (highlights.sorted && highlights.sorted.includes(index)) {
                    bar.classList.add('sorted');
                }
                if (highlights.pivot && highlights.pivot === index) {
                    bar.classList.add('pivot');
                }
                if (highlights.current && highlights.current === index) {
                    bar.classList.add('current');
                }
                
                container.appendChild(bar);
            });
        }

        // Function to update stats
        function updateStats(algorithm) {
            const state = algorithmStates[algorithm];
            
            // Update step count
            document.getElementById(`${algorithm}-steps`).textContent = state.steps;
            
            // Update comparisons
            if (algorithm === 'merge') {
                document.getElementById(`${algorithm}-comparisons`).textContent = state.comparisons;
                document.getElementById(`${algorithm}-merges`).textContent = state.merges;
            } else {
                document.getElementById(`${algorithm}-comparisons`).textContent = state.comparisons;
                document.getElementById(`${algorithm}-swaps`).textContent = state.swaps;
            }
            
            // Update time if sorting has started
            if (state.startTime > 0) {
                const elapsed = Date.now() - state.startTime;
                document.getElementById(`${algorithm}-time`).textContent = `${elapsed}ms`;
            }
        }

        // Function to generate random values
        function generateRandom(algorithm) {
            const state = algorithmStates[algorithm];
            
            // Generate 9 random numbers between 1 and 100
            state.data = Array.from({length: 9}, () => Math.floor(Math.random() * 100) + 1);
            
            // Reset stats
            resetStats(algorithm);
            
            // Update input field
            document.getElementById(`${algorithm}-input`).value = state.data.join(',');
            
            // Generate visualization
            generateVisualization(algorithm);
        }

        // Function to reset algorithm
        function resetAlgorithm(algorithm) {
            const state = algorithmStates[algorithm];
            
            // Reset data to default
            const defaultData = {
                bubble: [5, 3, 8, 1, 9, 2, 7, 4, 6],
                selection: [9, 3, 7, 1, 8, 2, 5, 4, 6],
                merge: [6, 2, 9, 1, 7, 3, 8, 4, 5],
                quick: [8, 3, 7, 1, 9, 2, 6, 4, 5],
                insertion: [7, 2, 8, 1, 9, 3, 6, 4, 5]
            };
            
            state.data = [...defaultData[algorithm]];
            
            // Reset stats
            resetStats(algorithm);
            
            // Update input field
            document.getElementById(`${algorithm}-input`).value = state.data.join(',');
            
            // Stop any ongoing sorting
            if (state.timeoutId) {
                clearTimeout(state.timeoutId);
                state.timeoutId = null;
            }
            
            state.isSorting = false;
            state.isPaused = false;
            
            // Update pause button
            const pauseBtn = document.getElementById(`${algorithm}-pause-btn`);
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            
            // Generate visualization
            generateVisualization(algorithm);
        }

        // Function to reset stats
        function resetStats(algorithm) {
            const state = algorithmStates[algorithm];
            
            state.steps = 0;
            state.comparisons = 0;
            state.swaps = 0;
            state.merges = 0;
            state.startTime = 0;
            
            updateStats(algorithm);
        }

        // Function to start sorting
        function startSorting(algorithm) {
            const state = algorithmStates[algorithm];
            
            // If already sorting, do nothing
            if (state.isSorting) return;
            
            // Get data from input field
            const inputField = document.getElementById(`${algorithm}-input`);
            let data = inputField.value;
            
            // If input is empty, use the default data
            if (!data.trim()) {
                data = state.data.join(',');
                inputField.value = data;
            }
            
            // Convert string to array of numbers
            const dataArray = data.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
            
            if (dataArray.length === 0) {
                alert('Please enter valid numbers separated by commas.');
                return;
            }
            
            // Update the algorithm data
            state.data = dataArray;
            
            // Reset stats
            state.steps = 0;
            state.comparisons = 0;
            state.swaps = 0;
            state.merges = 0;
            state.startTime = Date.now();
            
            // Set sorting state
            state.isSorting = true;
            state.isPaused = false;
            
            // Update pause button
            const pauseBtn = document.getElementById(`${algorithm}-pause-btn`);
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            
            // Generate initial visualization
            generateVisualization(algorithm);
            
            // Start the appropriate sorting algorithm
            if (algorithm === 'bubble') {
                bubbleSortStep(state);
            } else if (algorithm === 'selection') {
                selectionSortStep(state);
            } else if (algorithm === 'merge') {
                mergeSortStep(state);
            } else if (algorithm === 'quick') {
                quickSortStep(state);
            } else if (algorithm === 'insertion') {
                insertionSortStep(state);
            }
        }

        // Function to toggle pause
        function togglePause(algorithm) {
            const state = algorithmStates[algorithm];
            const pauseBtn = document.getElementById(`${algorithm}-pause-btn`);
            
            if (!state.isSorting) return;
            
            state.isPaused = !state.isPaused;
            
            if (state.isPaused) {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                
                // Resume sorting
                if (algorithm === 'bubble') {
                    bubbleSortStep(state);
                } else if (algorithm === 'selection') {
                    selectionSortStep(state);
                } else if (algorithm === 'merge') {
                    mergeSortStep(state);
                } else if (algorithm === 'quick') {
                    quickSortStep(state);
                } else if (algorithm === 'insertion') {
                    insertionSortStep(state);
                }
            }
        }

        // Function to step forward
        function stepForward(algorithm) {
            const state = algorithmStates[algorithm];
            
            if (!state.isSorting || !state.isPaused) return;
            
            // Execute one step
            if (state.currentStep) {
                state.currentStep();
            }
        }

        // Bubble Sort implementation
        function bubbleSortStep(state) {
            const data = state.data;
            const n = data.length;
            let i = state.currentStep?.i || 0;
            let j = state.currentStep?.j || 0;
            let swapped = state.currentStep?.swapped || false;
            
            // If we're starting fresh
            if (!state.currentStep) {
                i = 0;
                j = 0;
                swapped = false;
            }
            
            // Define the step function
            const step = () => {
                // Update step count
                state.steps++;
                
                // If we've completed a pass
                if (j >= n - i - 1) {
                    // If no swaps occurred, array is sorted
                    if (!swapped || i >= n - 1) {
                        state.isSorting = false;
                        state.currentStep = null;
                        
                        // Mark all elements as sorted
                        updateArrayVisualization('bubble', data, { sorted: Array.from({length: n}, (_, idx) => idx) });
                        updateBarVisualization('bubble', data, { sorted: Array.from({length: n}, (_, idx) => idx) });
                        updateStats('bubble');
                        return;
                    }
                    
                    // Start next pass
                    i++;
                    j = 0;
                    swapped = false;
                }
                
                // Highlight comparing elements
                updateArrayVisualization('bubble', data, { comparing: [j, j + 1] });
                updateBarVisualization('bubble', data, { comparing: [j, j + 1] });
                
                // Update comparison count
                state.comparisons++;
                
                // Check if we need to swap
                if (data[j] > data[j + 1]) {
                    // Swap elements
                    [data[j], data[j + 1]] = [data[j + 1], data[j]];
                    state.swaps++;
                    
                    // Highlight swapping
                    updateArrayVisualization('bubble', data, { swapping: [j, j + 1] });
                    updateBarVisualization('bubble', data, { swapping: [j, j + 1] });
                    
                    swapped = true;
                }
                
                // Move to next comparison
                j++;
                
                // Save current step state
                state.currentStep = { i, j, swapped };
                
                // Update stats
                updateStats('bubble');
                
                // Schedule next step if not paused
                if (state.isSorting && !state.isPaused) {
                    const speed = parseInt(document.getElementById('bubble-speed').value);
                    state.timeoutId = setTimeout(step, speed);
                }
            };
            
            // Start the step
            step();
        }

        // Selection Sort implementation
        function selectionSortStep(state) {
            const data = state.data;
            const n = data.length;
            let i = state.currentStep?.i || 0;
            let j = state.currentStep?.j || i + 1;
            let minIdx = state.currentStep?.minIdx || i;
            
            // Define the step function
            const step = () => {
                // Update step count
                state.steps++;
                
                // If we've completed finding the min for this i
                if (j >= n) {
                    // Swap if needed
                    if (minIdx !== i) {
                        [data[i], data[minIdx]] = [data[minIdx], data[i]];
                        state.swaps++;
                        
                        // Highlight swap
                        updateArrayVisualization('selection', data, { swapping: [i, minIdx], sorted: Array.from({length: i + 1}, (_, idx) => idx) });
                        updateBarVisualization('selection', data, { swapping: [i, minIdx], sorted: Array.from({length: i + 1}, (_, idx) => idx) });
                    } else {
                        // Mark as sorted
                        updateArrayVisualization('selection', data, { sorted: Array.from({length: i + 1}, (_, idx) => idx) });
                        updateBarVisualization('selection', data, { sorted: Array.from({length: i + 1}, (_, idx) => idx) });
                    }
                    
                    // Move to next i
                    i++;
                    
                    // Check if sorting is complete
                    if (i >= n - 1) {
                        state.isSorting = false;
                        state.currentStep = null;
                        
                        // Mark all elements as sorted
                        updateArrayVisualization('selection', data, { sorted: Array.from({length: n}, (_, idx) => idx) });
                        updateBarVisualization('selection', data, { sorted: Array.from({length: n}, (_, idx) => idx) });
                        updateStats('selection');
                        return;
                    }
                    
                    // Reset for next iteration
                    j = i + 1;
                    minIdx = i;
                } else {
                    // Compare current element with min
                    state.comparisons++;
                    
                    // Highlight comparing elements
                    updateArrayVisualization('selection', data, { 
                        comparing: [j, minIdx],
                        current: minIdx,
                        sorted: Array.from({length: i}, (_, idx) => idx)
                    });
                    updateBarVisualization('selection', data, { 
                        comparing: [j, minIdx],
                        current: minIdx,
                        sorted: Array.from({length: i}, (_, idx) => idx)
                    });
                    
                    // Update min index if current element is smaller
                    if (data[j] < data[minIdx]) {
                        minIdx = j;
                    }
                    
                    // Move to next element
                    j++;
                }
                
                // Save current step state
                state.currentStep = { i, j, minIdx };
                
                // Update stats
                updateStats('selection');
                
                // Schedule next step if not paused
                if (state.isSorting && !state.isPaused) {
                    const speed = parseInt(document.getElementById('selection-speed').value);
                    state.timeoutId = setTimeout(step, speed);
                }
            };
            
            // Start the step
            step();
        }

        // Merge Sort implementation (simplified step-by-step)
        function mergeSortStep(state) {
            // For simplicity, we'll show a simplified version
            const data = state.data;
            const n = data.length;
            
            // Mark all elements as being processed
            updateArrayVisualization('merge', data, { comparing: Array.from({length: n}, (_, idx) => idx) });
            updateBarVisualization('merge', data, { comparing: Array.from({length: n}, (_, idx) => idx) });
            
            // Simulate merge sort with delays
            simulateMergeSort(state, 0, n - 1);
        }

        function simulateMergeSort(state, left, right) {
            if (left >= right) return;
            
            const mid = Math.floor((left + right) / 2);
            
            // Recursively sort left and right halves
            setTimeout(() => {
                // Highlight left half
                const leftIndices = Array.from({length: mid - left + 1}, (_, idx) => left + idx);
                updateArrayVisualization('merge', state.data, { comparing: leftIndices });
                updateBarVisualization('merge', state.data, { comparing: leftIndices });
                state.steps++;
                updateStats('merge');
                
                simulateMergeSort(state, left, mid);
            }, 500);
            
            setTimeout(() => {
                // Highlight right half
                const rightIndices = Array.from({length: right - mid}, (_, idx) => mid + 1 + idx);
                updateArrayVisualization('merge', state.data, { comparing: rightIndices });
                updateBarVisualization('merge', state.data, { comparing: rightIndices });
                state.steps++;
                updateStats('merge');
                
                simulateMergeSort(state, mid + 1, right);
            }, 1000);
            
            // Merge the halves
            setTimeout(() => {
                merge(state, left, mid, right);
            }, 1500);
        }

        function merge(state, left, mid, right) {
            const leftArr = state.data.slice(left, mid + 1);
            const rightArr = state.data.slice(mid + 1, right + 1);
            
            let i = 0, j = 0, k = left;
            
            const mergeStep = () => {
                if (i < leftArr.length && j < rightArr.length) {
                    state.comparisons++;
                    state.steps++;
                    
                    // Highlight elements being compared
                    updateArrayVisualization('merge', state.data, { 
                        comparing: [left + i, mid + 1 + j]
                    });
                    updateBarVisualization('merge', state.data, { 
                        comparing: [left + i, mid + 1 + j]
                    });
                    
                    if (leftArr[i] <= rightArr[j]) {
                        state.data[k] = leftArr[i];
                        i++;
                    } else {
                        state.data[k] = rightArr[j];
                        j++;
                    }
                    k++;
                    
                    updateStats('merge');
                    
                    // Continue merging
                    setTimeout(mergeStep, 300);
                } else {
                    // Copy remaining elements
                    while (i < leftArr.length) {
                        state.data[k] = leftArr[i];
                        i++;
                        k++;
                        state.steps++;
                        updateStats('merge');
                    }
                    
                    while (j < rightArr.length) {
                        state.data[k] = rightArr[j];
                        j++;
                        k++;
                        state.steps++;
                        updateStats('merge');
                    }
                    
                    state.merges++;
                    
                    // Highlight merged section as sorted
                    const sortedIndices = Array.from({length: right - left + 1}, (_, idx) => left + idx);
                    updateArrayVisualization('merge', state.data, { sorted: sortedIndices });
                    updateBarVisualization('merge', state.data, { sorted: sortedIndices });
                    
                    // Check if sorting is complete
                    if (left === 0 && right === state.data.length - 1) {
                        state.isSorting = false;
                        state.currentStep = null;
                    }
                }
            };
            
            mergeStep();
        }

        // Quick Sort implementation (simplified step-by-step)
        function quickSortStep(state) {
            // Start quick sort
            quickSortRecursive(state, 0, state.data.length - 1);
        }

        function quickSortRecursive(state, low, high) {
            if (low < high) {
                // Partition the array
                partitionStep(state, low, high, (pivotIndex) => {
                    // Recursively sort left and right partitions
                    quickSortRecursive(state, low, pivotIndex - 1);
                    quickSortRecursive(state, pivotIndex + 1, high);
                    
                    // Check if sorting is complete
                    if (low === 0 && high === state.data.length - 1) {
                        state.isSorting = false;
                        state.currentStep = null;
                        
                        // Mark all elements as sorted
                        updateArrayVisualization('quick', state.data, { sorted: Array.from({length: state.data.length}, (_, idx) => idx) });
                        updateBarVisualization('quick', state.data, { sorted: Array.from({length: state.data.length}, (_, idx) => idx) });
                    }
                });
            }
        }

        function partitionStep(state, low, high, callback) {
            const pivot = state.data[high];
            let i = low - 1;
            let j = low;
            
            const step = () => {
                if (j <= high - 1) {
                    state.steps++;
                    state.comparisons++;
                    
                    // Highlight comparing elements
                    updateArrayVisualization('quick', state.data, { 
                        comparing: [j, high],
                        pivot: high
                    });
                    updateBarVisualization('quick', state.data, { 
                        comparing: [j, high],
                        pivot: high
                    });
                    
                    if (state.data[j] < pivot) {
                        i++;
                        
                        // Swap elements
                        [state.data[i], state.data[j]] = [state.data[j], state.data[i]];
                        state.swaps++;
                        
                        // Highlight swap
                        updateArrayVisualization('quick', state.data, { 
                            swapping: [i, j],
                            pivot: high
                        });
                        updateBarVisualization('quick', state.data, { 
                            swapping: [i, j],
                            pivot: high
                        });
                    }
                    
                    j++;
                    updateStats('quick');
                    
                    // Schedule next step
                    if (state.isSorting && !state.isPaused) {
                        const speed = parseInt(document.getElementById('quick-speed').value);
                        state.timeoutId = setTimeout(step, speed);
                    } else {
                        state.currentStep = step;
                    }
                } else {
                    // Place pivot in correct position
                    [state.data[i + 1], state.data[high]] = [state.data[high], state.data[i + 1]];
                    state.swaps++;
                    
                    // Highlight final pivot placement
                    updateArrayVisualization('quick', state.data, { 
                        swapping: [i + 1, high],
                        pivot: i + 1
                    });
                    updateBarVisualization('quick', state.data, { 
                        swapping: [i + 1, high],
                        pivot: i + 1
                    });
                    
                    updateStats('quick');
                    
                    // Callback with pivot index
                    callback(i + 1);
                }
            };
            
            step();
        }

        // Insertion Sort implementation
        function insertionSortStep(state) {
            const data = state.data;
            const n = data.length;
            let i = state.currentStep?.i || 1;
            let j = state.currentStep?.j || i - 1;
            let key = state.currentStep?.key || data[i];
            
            // Define the step function
            const step = () => {
                // Update step count
                state.steps++;
                
                // If we're starting a new element
                if (j === i - 1) {
                    key = data[i];
                    
                    // Highlight current element
                    updateArrayVisualization('insertion', data, { 
                        current: i,
                        sorted: Array.from({length: i}, (_, idx) => idx)
                    });
                    updateBarVisualization('insertion', data, { 
                        current: i,
                        sorted: Array.from({length: i}, (_, idx) => idx)
                    });
                }
                
                // Check if we need to shift
                if (j >= 0 && data[j] > key) {
                    state.comparisons++;
                    
                    // Shift element to the right
                    data[j + 1] = data[j];
                    state.swaps++;
                    
                    // Highlight shift
                    updateArrayVisualization('insertion', data, { 
                        comparing: [j, j + 1],
                        current: i,
                        sorted: Array.from({length: i}, (_, idx) => idx)
                    });
                    updateBarVisualization('insertion', data, { 
                        comparing: [j, j + 1],
                        current: i,
                        sorted: Array.from({length: i}, (_, idx) => idx)
                    });
                    
                    j--;
                } else {
                    // Insert key at correct position
                    data[j + 1] = key;
                    
                    // Mark as sorted up to i
                    updateArrayVisualization('insertion', data, { 
                        sorted: Array.from({length: i + 1}, (_, idx) => idx)
                    });
                    updateBarVisualization('insertion', data, { 
                        sorted: Array.from({length: i + 1}, (_, idx) => idx)
                    });
                    
                    // Move to next element
                    i++;
                    
                    // Check if sorting is complete
                    if (i >= n) {
                        state.isSorting = false;
                        state.currentStep = null;
                        
                        // Mark all elements as sorted
                        updateArrayVisualization('insertion', data, { sorted: Array.from({length: n}, (_, idx) => idx) });
                        updateBarVisualization('insertion', data, { sorted: Array.from({length: n}, (_, idx) => idx) });
                        updateStats('insertion');
                        return;
                    }
                    
                    // Reset for next element
                    j = i - 1;
                }
                
                // Save current step state
                state.currentStep = { i, j, key };
                
                // Update stats
                updateStats('insertion');
                
                // Schedule next step if not paused
                if (state.isSorting && !state.isPaused) {
                    const speed = parseInt(document.getElementById('insertion-speed').value);
                    state.timeoutId = setTimeout(step, speed);
                }
            };
            
            // Start the step
            step();
        }

        // Initialize the page
        window.onload = function() {
            // Generate visualizations for all algorithms
            for (const algorithm in algorithmStates) {
                generateVisualization(algorithm);
            }
            
            // Highlight code
            Prism.highlightAll();
        };