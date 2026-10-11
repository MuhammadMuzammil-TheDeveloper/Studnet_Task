
const USERS_KEY = "noir_users";
const SESSION_KEY = "noir_current_user";

function getUsers() {
  try {
    const data = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function showMessage(message, type = "danger") {
  const box = document.getElementById("message");

  if (!box) return;

  box.textContent = message;
  box.className = `alert alert-${type}`;
}

function clearMessage() {
  const box = document.getElementById("message");

  if (box) {
    box.textContent = "";
    box.className = "alert d-none";
  }
}

// Show or hide password
document.querySelectorAll(".toggle-password").forEach(button => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);

    if (!input) return;

    const isHidden = input.type === "password";

    input.type = isHidden ? "text" : "password";
    button.textContent = isHidden ? "Hide" : "Show";
  });
});

// Signup
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", event => {
    event.preventDefault();
    clearMessage();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (name.length < 2) {
      return showMessage("Please enter your full name.");
    }

    if (!emailPattern.test(email)) {
      return showMessage("Please enter a valid email address.");
    }

    if (!passwordPattern.test(password)) {
      return showMessage(
        "Password must have at least 8 characters, a letter, and a number."
      );
    }

    if (password !== confirmPassword) {
      return showMessage("Passwords do not match.");
    }

    const users = getUsers();

    if (users.some(user => user.email === email)) {
      return showMessage("This email is already registered. Please log in.");
    }

    // Demo only: plain-text passwords are NOT secure.
    users.push({
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    });

    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      return showMessage("Unable to save account in this browser.");
    }

    showMessage("Account created successfully! Redirecting to login...", "success");
    signupForm.reset();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  });
}

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", event => {
    event.preventDefault();
    clearMessage();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      return showMessage("Please enter your email and password.");
    }

    const users = getUsers();

    const user = users.find(
      user => user.email === email && user.password === password
    );

    if (!user) {
      return showMessage("Invalid email or password.");
    }

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
      }));
    } catch {
      return showMessage("Unable to save your login session.");
    }

    showMessage("Login successful! Opening your store...", "success");

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 700);
  });
}
