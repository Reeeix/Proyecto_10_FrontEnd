import { apiFetch } from "../src/utils/fetch.js";

const template = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).userName
    : null;

  return `
    <section id="events">
      ${user ? `<h3>Welcome ${user}</h3>` : ``}
      <ul id="eventscontainer"></ul>
    </section>
  `;
};

const getEvents = async () => {
  try {
    const token = localStorage.getItem("token");
    const url = token ? "/events/users" : "/events";

    const events = await apiFetch(url, token ? { auth: true } : {});
    const eventsContainer = document.querySelector("#eventscontainer");
    eventsContainer.innerHTML = "";

    const userName = token && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).userName
      : null;

    for (const event of events) {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${
          event.poster ? 'https://proyecto-10-back.onrender.com' + event.poster : 'https://via.placeholder.com/150'
        }" alt="${event.eventName}" width="150"/>
        <h3>${event.eventName}</h3>
        <h4>Fecha: ${new Date(event.date).toLocaleDateString()}</h4>
        <h5>Ubicación: ${event.location}</h5>
        <p>${event.description}</p>
        <div class="attendees">
          <strong>Asistentes:</strong>
          <ul id="attendees-${event._id}">
            ${
              event.attendees && event.attendees.length
                ? event.attendees.map(a => `<li>${a.userName}</li>`).join("")
                : "<li>No hay asistentes aún</li>"
            }
          </ul>
        </div>
      `;

      if (token) {
        const btn = document.createElement("button");
        btn.textContent = event.attendees?.some(a => a.userName === userName)
          ? "Asistencia confirmada"
          : "Confirmar asistencia";

        btn.disabled = event.attendees?.some(a => a.userName === userName);
        btn.addEventListener("click", () => attendEvent(event._id, btn));
        li.appendChild(btn);
      }

      eventsContainer.appendChild(li);
    }
  } catch (error) {
    console.error(error);
    document.querySelector("#eventscontainer").innerHTML =
      "<li>Error cargando eventos</li>";
  }
};

const attendEvent = async (eventId, button) => {
  try {
    const data = await apiFetch(`/events/${eventId}/attend`, { method: "POST", auth: true });

    alert("Asistencia confirmada ✅");
    button.disabled = true;
    button.textContent = "Asistencia confirmada";

    const ul = document.getElementById(`attendees-${eventId}`);
    const li = document.createElement("li");
    const userName = JSON.parse(localStorage.getItem("user")).userName;
    li.textContent = userName;
    ul.appendChild(li);
  } catch (error) {
    alert(`Error: ${error.message || error}`);
  }
};

const Events = () => {
  document.querySelector("main").innerHTML = template();
  getEvents();
};

export default Events;