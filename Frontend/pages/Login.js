import { apiFetch } from "../src/utils/fetch.js";
import Events from "./Events.js";

const template = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).userName
    : null;

  return `
    <section id="login">
      ${
        user
          ? `<h2>Ya estás logueado como ${user}</h2>
             <button id="logoutbtn">Logout</button>`
          : `<form id="loginForm">
               <input type="text" placeholder="Email" id="email" required/>
               <input type="password" id="password" placeholder="Password" required/>
               <button id="loginbtn" type="submit">Login</button>
             </form>`
      }
    </section>
  `;
};

const loginSubmit = async (emailParam, passwordParam) => {
  const email = emailParam || document.querySelector("#email").value.trim();
  const password = passwordParam || document.querySelector("#password").value;

  if (!email || !password) {
    alert("Debes rellenar todos los campos");
    return;
  }

  try {
    const data = await apiFetch("/users/login", {
      method: "POST",
      body: { email, password }, 
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ userName: data.userName }));

    alert(`Bienvenido, ${data.userName}!`);
    Events();
  } catch (error) {
    alert(`Error: ${error.message || error}`);
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  alert("Sesión cerrada");
  Login(); 
};

const Login = () => {
  document.querySelector("main").innerHTML = template();

  const form = document.querySelector("#loginForm");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    loginSubmit();
  });

  const logoutBtn = document.querySelector("#logoutbtn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
};

export default Login;