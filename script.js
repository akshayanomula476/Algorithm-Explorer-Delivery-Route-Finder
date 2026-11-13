
// ==========================================
// 1. BRUTE FORCE ALGORITHM
// ==========================================

function bruteForce(graph, start, end) {

    let bestPath = null;
    let minDistance = Infinity;

    function explore(current, path, distance) {

        if (current === end) {

            if (distance < minDistance) {
                minDistance = distance;
                bestPath = [...path];
            }

            return;
        }

        for (let neighbor of graph[current] || []) {

            if (!path.includes(neighbor.node)) {

                explore(
                    neighbor.node,
                    [...path, neighbor.node],
                    distance + neighbor.distance
                );
            }
        }
    }

    explore(start, [start], 0);

    if (bestPath === null) return null;

    return {
        path: bestPath,
        distance: minDistance
    };
}


// ==========================================
// 2. GREEDY ALGORITHM
// ==========================================

function greedy(graph, start, end) {

    let current = start;
    let path = [start];
    let totalDistance = 0;

    let visited = new Set([start]);

    while (current !== end) {

        let neighbors = graph[current] || [];

        let available = neighbors.filter(
            neighbor => !visited.has(neighbor.node)
        );

        if (available.length === 0) return null;

        available.sort((a, b) => a.distance - b.distance);

        let next = available[0];

        current = next.node;
        totalDistance += next.distance;

        path.push(current);
        visited.add(current);
    }

    return {
        path: path,
        distance: totalDistance
    };
}


// ==========================================
// 3. DYNAMIC PROGRAMMING ALGORITHM
// ==========================================

function dynamicProgramming(graph, start, end) {

    let memo = {};
    let nextNode = {};

    function findDistance(current, visited) {

        if (current === end) return 0;

        let key = current + "|" + [...visited].sort().join(",");

        if (memo[key] !== undefined) {
            return memo[key];
        }

        let minDistance = Infinity;
        let bestNext = null;

        for (let neighbor of graph[current] || []) {

            if (!visited.has(neighbor.node)) {

                let newVisited = new Set(visited);
                newVisited.add(neighbor.node);

                let distance = neighbor.distance +
                    findDistance(neighbor.node, newVisited);

                if (distance < minDistance) {

                    minDistance = distance;
                    bestNext = neighbor.node;
                }
            }
        }

        memo[key] = minDistance;
        nextNode[key] = bestNext;

        return minDistance;
    }

    let visited = new Set([start]);

    let totalDistance = findDistance(start, visited);

    if (totalDistance === Infinity) return null;

    let path = [start];
    let current = start;

    while (current !== end) {

        let key = current + "|" + [...visited].sort().join(",");

        current = nextNode[key];

        if (!current) return null;

        path.push(current);
        visited.add(current);
    }

    return {
        path: path,
        distance: totalDistance
    };
}


// ==========================================
// 4. BACKTRACKING ALGORITHM
// ==========================================

function backtracking(graph, start, end) {

    let bestPath = null;
    let minDistance = Infinity;

    function explore(current, path, distance) {

        if (distance >= minDistance) return;

        if (current === end) {

            minDistance = distance;
            bestPath = [...path];

            return;
        }

        for (let neighbor of graph[current] || []) {

            if (!path.includes(neighbor.node)) {

                path.push(neighbor.node);

                explore(
                    neighbor.node,
                    path,
                    distance + neighbor.distance
                );

                path.pop();
            }
        }
    }

    explore(start, [start], 0);

    if (bestPath === null) return null;

    return {
        path: bestPath,
        distance: minDistance
    };
}


// ==========================================
// 5. CREATE GRAPH FROM USER INPUT
// ==========================================

function createGraph(roadsInput) {

    let graph = {};

    let roads = roadsInput.trim().split(/\r?\n/);

    for (let road of roads) {

        let parts = road.split(",");

        if (parts.length !== 3) {
            throw new Error("Invalid road format: " + road);
        }

        let from = parts[0].trim();
        let to = parts[1].trim();
        let distance = Number(parts[2].trim());

        if (
            !from ||
            !to ||
            from === to ||
            !Number.isFinite(distance) ||
            distance <= 0
        ) {
            throw new Error("Invalid road: " + road);
        }

        if (!graph[from]) graph[from] = [];
        if (!graph[to]) graph[to] = [];

        // Add road in both directions

        graph[from].push({
            node: to,
            distance: distance
        });

        graph[to].push({
            node: from,
            distance: distance
        });
    }

    return graph;
}


// ==========================================
// 6. DISPLAY ALGORITHM RESULTS
// ==========================================

function displayResult(name, result, time) {

    let resultsDiv = document.getElementById("results");

    if (result === null) {

        resultsDiv.innerHTML += `
            <div class="result-card">
                <h3>${name}</h3>
                <p>No route found.</p>
                <p>Execution Time: ${time.toFixed(4)} ms</p>
            </div>
        `;

        return;
    }

    resultsDiv.innerHTML += `
        <div class="result-card">
            <h3>${name}</h3>

            <p>
                <strong>Route:</strong>
                ${result.path.join(" → ")}
            </p>

            <p>
                <strong>Total Distance:</strong>
                ${result.distance}
            </p>

            <p>
                <strong>Execution Time:</strong>
                ${time.toFixed(4)} ms
            </p>
        </div>
    `;
}


// ==========================================
// 7. DRAW PERFORMANCE CHART
// ==========================================

function drawPerformanceChart(times) {

    let canvas = document.getElementById("performanceChart");
    let context = canvas.getContext("2d");

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    let ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    context.scale(ratio, ratio);

    context.clearRect(0, 0, width, height);

    let names = [
        "Brute Force",
        "Greedy",
        "Dynamic Programming",
        "Backtracking"
    ];

    let values = [
        times.bruteForce,
        times.greedy,
        times.dynamicProgramming,
        times.backtracking
    ];

    let colors = [
        "#f97316",
        "#22c55e",
        "#3b82f6",
        "#a78bfa"
    ];

    let maxValue = Math.max(...values, 0.0001);

    let left = 155;
    let right = 35;
    let top = 30;
    let bottom = 35;

    let chartWidth = width - left - right;
    let chartHeight = height - top - bottom;

    let barHeight = 30;
    let gap = (chartHeight - names.length * barHeight) /
              (names.length + 1);

    // Chart title

    context.fillStyle = "#ffffff";
    context.font = "bold 13px Arial";
    context.fillText("Execution Time (ms)", left, 17);

    names.forEach((name, index) => {

        let y = top + gap + index * (barHeight + gap);

        let barWidth = (values[index] / maxValue) * chartWidth;

        // Algorithm name

        context.fillStyle = "#ffffff";
        context.font = "12px Arial";
        context.textAlign = "right";

        context.fillText(name, left - 12, y + 20);

        // Bar

        context.fillStyle = colors[index];

        context.fillRect(
            left,
            y,
            Math.max(barWidth, 2),
            barHeight
        );

        // Time value

        context.fillStyle = "#ffffff";
        context.textAlign = "left";
        context.font = "12px Arial";

        let labelX = Math.min(
            left + barWidth + 8,
            width - 65
        );

        context.fillText(
            values[index].toFixed(4) + " ms",
            labelX,
            y + 20
        );
    });

    document.getElementById("chartMessage").textContent =
        "Chart updated using your entered road network.";
}


// ==========================================
// 8. RUN ALL FOUR ALGORITHMS
// ==========================================

function runAllAlgorithms() {

    let start = document.getElementById("start").value.trim();
    let end = document.getElementById("end").value.trim();

    let roadsInput = document.getElementById("roads").value;

    let errorDiv = document.getElementById("error");
    let resultsDiv = document.getElementById("results");

    errorDiv.textContent = "";
    resultsDiv.innerHTML = "";

    document.getElementById("chartMessage").textContent =
        "Waiting for valid route input.";

    if (!start || !end || !roadsInput.trim()) {

        errorDiv.textContent =
            "Please enter starting location, destination and roads.";

        return;
    }

    try {

        let graph = createGraph(roadsInput);

        if (!graph[start] || !graph[end]) {

            throw new Error(
                "Starting location or destination is missing from the roads."
            );
        }

        if (start === end) {

            throw new Error(
                "Starting location and destination must be different."
            );
        }

        // Measure Brute Force

        let begin = performance.now();
        let bruteResult = bruteForce(graph, start, end);
        let bruteTime = performance.now() - begin;

        // Measure Greedy

        begin = performance.now();
        let greedyResult = greedy(graph, start, end);
        let greedyTime = performance.now() - begin;

        // Measure Dynamic Programming

        begin = performance.now();
        let dpResult = dynamicProgramming(graph, start, end);
        let dpTime = performance.now() - begin;

        // Measure Backtracking

        begin = performance.now();
        let backtrackingResult = backtracking(graph, start, end);
        let backtrackingTime = performance.now() - begin;

        // Display results

        displayResult("1. Brute Force", bruteResult, bruteTime);

        displayResult("2. Greedy", greedyResult, greedyTime);

        displayResult(
            "3. Dynamic Programming",
            dpResult,
            dpTime
        );

        displayResult(
            "4. Backtracking",
            backtrackingResult,
            backtrackingTime
        );

        // Draw chart

        drawPerformanceChart({
            bruteForce: bruteTime,
            greedy: greedyTime,
            dynamicProgramming: dpTime,
            backtracking: backtrackingTime
        });

    } catch (error) {

        errorDiv.textContent = error.message;
    }
}
