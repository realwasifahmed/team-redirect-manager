async function signUpUser(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { success: false, message: error.message };

  return { success: true, user: data.user };
}

async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, message: error.message };

  return { success: true, session: data.session };
}

document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signup-btn");
  const loginBtn = document.getElementById("login-btn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const messageBox = document.getElementById("message");

  function showMessage(text, color) {
    messageBox.style.color = color;
    messageBox.innerText = text;
  }

  function setLoading(isLoading) {
    signupBtn.disabled = isLoading;
    loginBtn.disabled = isLoading;
    emailInput.disabled = isLoading;
    passwordInput.disabled = isLoading;

    loginBtn.innerText = isLoading ? "Loading..." : "Login";
    signupBtn.innerText = isLoading ? "Creating..." : "Create Account";
  }

  // SIGNUP
  signupBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showMessage("Please fill all fields.", "red");
      return;
    }

    setLoading(true);

    const result = await signUpUser(email, password);

    if (result.success) {
      showMessage("Account created! Redirecting...", "green");
      setTimeout(() => (window.location.href = "popup.html"), 800);
    } else {
      showMessage(result.message, "red");
    }

    setLoading(false);
  });

  // LOGIN
  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showMessage("Please fill all fields.", "red");
      return;
    }

    setLoading(true);

    const result = await loginUser(email, password);

    if (result.success) {
      showMessage("Logged in! Redirecting...", "green");
      setTimeout(() => (window.location.href = "popup.html"), 800);
    } else {
      showMessage(result.message, "red");
    }

    setLoading(false);
  });
});

