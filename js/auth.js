function showMessage(text, type = "success") {

    const message = document.getElementById("message");

    message.className = `message ${type}`;
    message.textContent = text;
}

function clearMessage() {

    const message = document.getElementById("message");

    message.className = "message";
    message.textContent = "";
}

function saveSession(data) {

    localStorage.setItem(
        "access_token",
        data.access_token
    );

    localStorage.setItem(
        "refresh_token",
        data.refresh_token
    );

    localStorage.setItem(
        "user",
        JSON.stringify(data.user)
    );
}

async function login(email, password) {

    const response = await fetch(
        `${API_URL}/internal-users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    if (!response.ok) {
        throw new Error("Credenciales incorrectas");
    }

    return await response.json();
}

async function register(userData) {

    const response = await fetch(
        `${API_URL}/internal-users/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        }
    );

    if (!response.ok) {
        throw new Error("Error al registrar usuario");
    }

    return await response.json();
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            clearMessage();

            const button =
                loginForm.querySelector("button");

            button.disabled = true;
            button.textContent =
                "Iniciando sesión...";

            try {

                const email =
                    document.getElementById("email").value;

                const password =
                    document.getElementById("password").value;

                const data =
                    await login(email, password);

                saveSession(data);

                showMessage(
                    "Inicio de sesión exitoso"
                );

                setTimeout(() => {

                    window.location.href =
                        "pages/chat.html";

                }, 800);

            } catch (error) {

                showMessage(
                    error.message,
                    "error"
                );

            } finally {

                button.disabled = false;
                button.textContent =
                    "Iniciar sesión";
            }
        }
    );
}

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            clearMessage();

            const button =
                registerForm.querySelector("button");

            button.disabled = true;
            button.textContent =
                "Registrando...";

            try {

                const userData = {

                    name:
                        document.getElementById("name").value,

                    last_name:
                        document.getElementById("last_name").value,

                    email:
                        document.getElementById("email").value,

                    password:
                        document.getElementById("password").value
                };

                await register(userData);

                showMessage(
                    "Usuario registrado correctamente"
                );

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1200);

            } catch (error) {

                showMessage(
                    error.message,
                    "error"
                );

            } finally {

                button.disabled = false;
                button.textContent =
                    "Registrarme";
            }
        }
    );
}