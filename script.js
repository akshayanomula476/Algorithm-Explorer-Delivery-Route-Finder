
// ========================================
// 11. CONNECT ALL BUTTONS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // Find Routes button
    const findButton = document.getElementById("findBtn");

    if (findButton) {
        findButton.addEventListener("click", function () {
            runAllAlgorithms();
        });
    }

    // Load Sample Input button
    const sampleButton = document.getElementById("sampleBtn");

    if (sampleButton) {
        sampleButton.addEventListener("click", function () {
            loadSample();
        });
    }

    // Four Algorithm Explanation buttons
    const algorithmButtons = document.querySelectorAll(
        "[data-algorithm]"
    );

    algorithmButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const algorithm = button.getAttribute("data-algorithm");

            showAlgorithm(algorithm);

            // Highlight selected button
            algorithmButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

        });

    });

});
