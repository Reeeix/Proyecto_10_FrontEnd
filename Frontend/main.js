import Events from "./pages/Events.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import CreateEvent from "./pages/CreateEvent.js";
import "./style.css";
import "./navbar.css";
import "./forms.css";
import "./events.css";

const navigate = (page) => {
  switch (page) {
    case "events":
      Events();
      break;
    case "login":
      Login();
      break;
    case "register":
      Register();
      break;
    case "create":
      if (!localStorage.getItem("token")) {
        alert("Debes iniciar sesión para crear un evento");
        return navigate("login");
      }
      CreateEvent();
      break;
    default:
      Events();
  }
  
  renderNavbar();
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  alert("Sesión cerrada");
  renderNavbar();
  navigate("login");
};

const renderNavbar = () => {
  const header = document.querySelector("header");
  const token = localStorage.getItem("token");

  header.innerHTML = `
    <h1>Events App</h1>
    <a href="#" id="eventslink">Events</a>
    ${
      token
        ? `<a href="#" id="createlink">Crear Evento</a>
           <a href="#" id="logoutlink">Logout</a>`
        : `<a href="#" id="loginlink">Login</a>
           <a href="#" id="registerlink">Register</a>`
    }
  `;

  document.querySelector("#eventslink").addEventListener("click", () => navigate("events"));

  if (token) {
    document.querySelector("#createlink").addEventListener("click", () => navigate("create"));
    document.querySelector("#logoutlink").addEventListener("click", handleLogout);
  } else {
    document.querySelector("#loginlink").addEventListener("click", () => navigate("login"));
    document.querySelector("#registerlink").addEventListener("click", () => navigate("register"));
  }
};

const init = () => {
  renderNavbar();
  navigate("events");
};

init();