(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function a(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();const g="http://localhost:3000/api/v1",l=async(r,o={})=>{const n=localStorage.getItem("token"),e={...o.body instanceof FormData?{}:{"Content-Type":"application/json"},...n&&{Authorization:`Bearer ${n}`},...o.headers},t=await fetch(`${g}${r}`,{...o,headers:e}),s=await t.json();if(!t.ok)throw new Error(s.message||s);return s},h=()=>{const r=localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).userName:null;return`
    <section id="events">
      ${r?`<h3>Welcome ${r}</h3>`:""}
      <ul id="eventscontainer"></ul>
    </section>
  `},v=async()=>{try{const r=localStorage.getItem("token"),n=await l(r?"/events/users":"/events",r?{auth:!0}:{}),a=document.querySelector("#eventscontainer");a.innerHTML="";const e=r&&localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).userName:null;for(const t of n){const s=document.createElement("li");if(s.innerHTML=`
        <img src="${t.poster?"http://localhost:3000"+t.poster:"https://via.placeholder.com/150"}" alt="${t.eventName}" width="150"/>
        <h3>${t.eventName}</h3>
        <h4>Fecha: ${new Date(t.date).toLocaleDateString()}</h4>
        <h5>Ubicación: ${t.location}</h5>
        <p>${t.description}</p>
        <div class="attendees">
          <strong>Asistentes:</strong>
          <ul id="attendees-${t._id}">
            ${t.attendees&&t.attendees.length?t.attendees.map(i=>`<li>${i.userName}</li>`).join(""):"<li>No hay asistentes aún</li>"}
          </ul>
        </div>
      `,r){const i=document.createElement("button");i.textContent=t.attendees?.some(d=>d.userName===e)?"Asistencia confirmada":"Confirmar asistencia",i.disabled=t.attendees?.some(d=>d.userName===e),i.addEventListener("click",()=>y(t._id,i)),s.appendChild(i)}a.appendChild(s)}}catch(r){console.error(r),document.querySelector("#eventscontainer").innerHTML="<li>Error cargando eventos</li>"}},y=async(r,o)=>{try{const n=await l(`/events/${r}/attend`,{method:"POST",auth:!0});alert("Asistencia confirmada ✅"),o.disabled=!0,o.textContent="Asistencia confirmada";const a=document.getElementById(`attendees-${r}`),e=document.createElement("li"),t=JSON.parse(localStorage.getItem("user")).userName;e.textContent=t,a.appendChild(e)}catch(n){alert(`Error: ${n.message||n}`)}},u=()=>{document.querySelector("main").innerHTML=h(),v()},f=()=>{const r=localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")).userName:null;return`
    <section id="login">
      ${r?`<h2>Ya estás logueado como ${r}</h2>
             <button id="logoutbtn">Logout</button>`:`<form id="loginForm">
               <input type="text" placeholder="Email" id="email" required/>
               <input type="password" id="password" placeholder="Password" required/>
               <button id="loginbtn" type="submit">Login</button>
             </form>`}
    </section>
  `},S=async(r,o)=>{const n=document.querySelector("#email").value,a=document.querySelector("#password").value;try{const e=await l("/users/login",{method:"POST",body:JSON.stringify({email:n,password:a})});localStorage.setItem("token",e.token),localStorage.setItem("user",JSON.stringify({userName:e.userName})),alert(`Bienvenido, ${e.userName}!`),u()}catch(e){alert(`Error: ${e.message||e}`)}},b=()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),alert("Sesión cerrada"),m()},m=()=>{document.querySelector("main").innerHTML=f();const r=document.querySelector("#loginForm");r&&r.addEventListener("submit",n=>{n.preventDefault(),S()});const o=document.querySelector("#logoutbtn");o&&o.addEventListener("click",b)},E=()=>`
  <section id="register">
    <form id="registerForm">
      <input type="text" placeholder="Username" id="username" required />
      <input type="text" placeholder="Email" id="email" required />
      <input type="password" id="password" placeholder="Password" required />
      <button id="registerbtn" type="submit">Register</button>
    </form>
  </section>
`,k=async r=>{r.preventDefault();const o=document.querySelector("#username").value,n=document.querySelector("#email").value,a=document.querySelector("#password").value;try{await l("/users/register",{method:"POST",body:JSON.stringify({userName:o,email:n,password:a})});const e=await l("/users/login",{method:"POST",body:JSON.stringify({email:n,password:a})});localStorage.setItem("token",e.token),localStorage.setItem("user",e.userName),alert("Registro exitoso. Bienvenido!"),u()}catch(e){alert(`Error: ${e.message||e}`)}},L=()=>{document.querySelector("main").innerHTML=E(),document.querySelector("#registerForm").addEventListener("submit",k)},q=()=>{if(!localStorage.getItem("token")){alert("Debes iniciar sesión para crear un evento"),u();return}const o=`
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
  `;document.querySelector("main").innerHTML=o,document.querySelector("#createEventForm").addEventListener("submit",async n=>{n.preventDefault();const a=n.target,e=new FormData;e.append("eventName",a.title.value),e.append("description",a.description.value),e.append("date",a.date.value),e.append("location",a.location.value),e.append("poster",a.poster.files[0]);try{await l("/events",{method:"POST",body:e,auth:!0}),alert("Evento creado correctamente 💥"),u()}catch(t){alert(`Error al crear evento: ${t.message||t}`)}})},c=r=>{switch(r){case"events":u();break;case"login":m();break;case"register":L();break;case"create":if(!localStorage.getItem("token"))return alert("Debes iniciar sesión para crear un evento"),c("login");q();break;default:u()}},N=()=>{localStorage.removeItem("token"),localStorage.removeItem("user"),alert("Sesión cerrada"),p(),c("login")},p=()=>{const r=document.querySelector("header"),o=localStorage.getItem("token");r.innerHTML=`
    <h1>Events App</h1>
    <a href="#" id="Eventslink">Events</a>
    ${o?`<a href="#" id="createlink">Crear Evento</a>
           <button id="logoutlink">Logout</button>`:`<a href="#" id="loginlink">Login</a>
           <a href="#" id="registerlink">Register</a>`}
  `,document.querySelector("#Eventslink").addEventListener("click",()=>c("events")),o?(document.querySelector("#createlink").addEventListener("click",()=>c("create")),document.querySelector("#logoutlink").addEventListener("click",N)):(document.querySelector("#loginlink").addEventListener("click",()=>c("login")),document.querySelector("#registerlink").addEventListener("click",()=>c("register")))},$=()=>{p(),c("events")};$();
