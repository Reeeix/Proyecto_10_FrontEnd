import { apiFetch } from "../src/utils/fetch.js";
import Events from "./Events.js";

const CreateEvent = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión para crear un evento");
    Events();
    return;
  }

  const template = `
    <section id="create-event">
      <h2>Crear Evento</h2>
      <form id="createEventForm" enctype="multipart/form-data">
        <input type="text" name="title" placeholder="Título" required />
        <input type="text" name="description" placeholder="Descripción" required />
        <input type="date" name="date" required />
        <input type="text" name="location" placeholder="Ubicación" required />
        <input type="file" name="poster" accept="image/*" required />
        <button type="submit">Crear</button>
      </form>
    </section>
  `;

  document.querySelector("main").innerHTML = template;

  document.querySelector("#createEventForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;

    
    const formData = new FormData();
    formData.append("eventName", form.title.value);
    formData.append("description", form.description.value);
    formData.append("date", form.date.value);
    formData.append("location", form.location.value);
    formData.append("poster", form.poster.files[0]);

    try {
      await apiFetch("/events", {
        method: "POST",
        body: formData, 
        auth: true,
      });

      alert("Evento creado correctamente 💥");
      Events();
    } catch (error) {
      alert(`Error al crear evento: ${error.message || error}`);
    }
  });
};

export default CreateEvent;