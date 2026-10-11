
const USERS_KEY = "noir_users";
const SESSION_KEY = "noir_current_user";
const REMEMBER_KEY = "noir_remembered_email";

// Select elements
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");
const togglePassword = document.getElementById("togglePassword");

// Display messages
function showMessage(text, type = "danger") {
    message.textContent = text;
    message.className = `alert alert-${type}`;
}

// Clear messages
function clearMessage() {
    message.textContent = "";
    message.className = "alert d-none";
}

// Load remembered email
try {
    const savedEmail = localStorage.getItem(REMEMBER_KEY);

    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
    }
} catch {
    showMessage("Unable to access browser storage.");
}

// Show / Hide password
togglePassword.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "Hide" : "Show";
});

// Login logic
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearMessage();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    // Validate empty fields
    if (!email || !password) {
        showMessage("Please enter your email and password.");
        return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\4s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showMessage("Please enter a valid email address.");
        return;
    }

    let users;

    try {
        users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

        if (!Array.isArray(users)) {
            users = [];
        }
    } catch {
        showMessage("Unable to read saved accounts.");
        return;
    }

    // Find matching user
    const user = users.find(function (item) {
        return (
            item.email?.toLowerCase() === email &&
            item.password === password
        );
    });

    // Check credentials
    if (!user) {
        showMessage("Invalid email or password.");
        return;
    }

    // Save or remove remembered email
    try {
        if (rememberMe.checked) {
            localStorage.setItem(REMEMBER_KEY, email);
        } else {
            localStorage.removeItem(REMEMBER_KEY);
        }

        // Store only non-password user information
        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(sessionUser)
        );
    } catch {
        showMessage("Unable to save your login session.");
        return;
    }

    // Success
    showMessage("Login successful! Redirecting...", "success");

    loginBtn.disabled = true;
    loginBtn.textContent = "Signing In...";

    setTimeout(function () {
        window.location.href = "../pages/dashboard.html";
    }, 700);
});

// Forgot password demo
document.getElementById("forgotPassword").addEventListener("click", function (event) {
    event.preventDefault();

    showMessage(
        "Password recovery is not available yet. Please create a new test account if needed."
    );
});
