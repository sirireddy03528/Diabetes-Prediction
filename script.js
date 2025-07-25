function registerUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }

    if (localStorage.getItem(email)) {
        alert("User already exists!");
        return false;
    }

    const user = { name, email, password };
    localStorage.setItem(email, JSON.stringify(user));
    alert("Registered successfully!");
    window.location.href = "login.html";
    return false;
}

function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const user = JSON.parse(localStorage.getItem(email));

    if (user && user.password === password) {
        localStorage.setItem("loggedInUser", email);
        window.location.href = "result.html";
    } else {
        alert("Invalid credentials.");
    }
    return false;
}

function checkLogin() {
    if (!localStorage.getItem("loggedInUser")) {
        alert("Please log in first.");
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

function predictDiabetes() {
    const glucose = parseFloat(document.getElementById("glucose").value);
    const bmi = parseFloat(document.getElementById("bmi").value);
    const age = parseFloat(document.getElementById("age").value);
    const bloodPressure = parseFloat(document.getElementById("bloodpressure").value);
    const insulin = parseFloat(document.getElementById("insulin").value);

    const coefficients = {
        glucose: 0.04,
        bmi: 0.08,
        age: 0.03,
        bloodPressure: 0.02,
        insulin: 0.01,
        intercept: -4.5
    };

    const score = coefficients.intercept +
                  glucose * coefficients.glucose +
                  bmi * coefficients.bmi +
                  age * coefficients.age +
                  bloodPressure * coefficients.bloodPressure +
                  insulin * coefficients.insulin;

    const probability = 1 / (1 + Math.exp(-score));
    const resultMessage = document.getElementById("resultMessage");
    if (probability > 0.5) {
        resultMessage.innerText = High Risk of Diabetes (${(probability * 100).toFixed(2)}%);
        resultMessage.style.color = "red";
    } else {
        resultMessage.innerText = Low Risk of Diabetes (${(probability * 100).toFixed(2)}%);
        resultMessage.style.color = "green";
    }

    // Draw pie chart
    const ctx = document.getElementById('healthChart').getContext('2d');
    if (window.healthChartInstance) {
        window.healthChartInstance.destroy(); // Remove old chart
    }
    window.healthChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Glucose', 'BMI', 'Age', 'Blood Pressure', 'Insulin'],
            datasets: [{
                label: 'Health Metric Contribution',
                data: [glucose, bmi, age, bloodPressure, insulin],
                backgroundColor: [
                    '#f94144',
                    '#f3722c',
                    '#f9c74f',
                    '#43aa8b',
                    '#577590'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    return false; // Prevent form submit
}