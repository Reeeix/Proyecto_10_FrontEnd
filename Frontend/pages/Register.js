import { apiFetch } from "../src/utils/fetch.js";
import Events from "./Events.js";

const template = () => `
  <section id="register">
    <form id="registerForm">
      <input type="text" placeholder="Username" id="username" required />
      <input type="text" placeholder="Email" id="email" required />
      <input type="password" id="password" placeholder="Password" required />
      <button id="registerbtn" type="submit">Register</button>
    </form>
  </section>
`;

const registerSubmit = async (e) => {
  e.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  if (!username || !email || !password) {
    alert("Debes rellenar todos los campos");
    return;
  }

  try {
    await apiFetch("/users/register", {
      method: "POST",
      body: { userName: username, email, password }, 
    });
   
    const dataLogin = await apiFetch("/users/login", {
      method: "POST",
      body: { email, password }, 
    });
   
    localStorage.setItem("token", dataLogin.token);
    localStorage.setItem("user", JSON.stringify({ userName: dataLogin.userName }));

    alert(`Registro exitoso. Bienvenido ${dataLogin.userName}!`);
    Events(); 
  } catch (error) {
    alert(`Error: ${error.message || error}`);
  }
};

const Register = () => {
  document.querySelector("main").innerHTML = template();
  const form = document.querySelector("#registerForm");
  if (form) form.addEventListener("submit", registerSubmit);
};

export default Register;