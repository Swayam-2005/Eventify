const events = [
  {
    id: "techfusion-2026", name: "TechFusion 2026", category: "Technology",
    date: "2026-11-18", dateLabel: "18 Nov 2026", time: "10:00 AM – 5:00 PM",
    venue: "Bhubaneswar Tech Hub", description: "A practical technology summit covering AI, cloud, developer tools and the future of digital products.",
    accent: "#7b61ff", bg: "linear-gradient(135deg,#17152b,#44308c)"
  },
  {
    id: "codestorm", name: "CodeStorm Hackathon", category: "Hackathon",
    date: "2026-11-21", dateLabel: "21 Nov 2026", time: "9:00 AM – 9:00 PM",
    venue: "Innovation Arena", description: "Build, prototype and pitch a working solution in a fast-paced team hackathon.",
    accent: "#ffb000", bg: "linear-gradient(135deg,#2d2010,#8c4f12)"
  },
  {
    id: "designx", name: "DesignX Workshop", category: "Workshop",
    date: "2026-11-26", dateLabel: "26 Nov 2026", time: "11:00 AM – 3:00 PM",
    venue: "Creative Studio 04", description: "A hands-on session on design thinking, rapid prototyping and user-centered problem solving.",
    accent: "#ff5e9c", bg: "linear-gradient(135deg,#321526,#8b2e5a)"
  },
  {
    id: "startup-connect", name: "Startup Connect", category: "Business",
    date: "2026-12-02", dateLabel: "02 Dec 2026", time: "2:00 PM – 7:00 PM",
    venue: "Founders Hall", description: "Meet founders, builders and mentors and learn how early-stage ideas become real products.",
    accent: "#4fd1c5", bg: "linear-gradient(135deg,#102827,#166b68)"
  },
  {
    id: "cybersec", name: "CyberSec Summit", category: "Technology",
    date: "2026-12-07", dateLabel: "07 Dec 2026", time: "10:00 AM – 4:30 PM",
    venue: "Secure Systems Lab", description: "Explore practical cybersecurity, threat awareness, secure development and modern defense strategies.",
    accent: "#56d364", bg: "linear-gradient(135deg,#102414,#21652a)"
  },
  {
    id: "culture-canvas", name: "Culture Canvas", category: "Culture",
    date: "2026-12-12", dateLabel: "12 Dec 2026", time: "4:00 PM – 8:00 PM",
    venue: "Open Arts Courtyard", description: "An evening celebrating local art, music, stories and creative collaboration.",
    accent: "#ff7a45", bg: "linear-gradient(135deg,#30180f,#8b3f1f)"
  },
  {
    id: "cloud-native", name: "Cloud Native Day", category: "Technology",
    date: "2026-12-17", dateLabel: "17 Dec 2026", time: "10:00 AM – 5:00 PM",
    venue: "Cloud Commons", description: "Learn modern cloud architecture, containers, observability and deployment practices.",
    accent: "#50b7ff", bg: "linear-gradient(135deg,#102235,#1d5f88)"
  },
  {
    id: "creators-lab", name: "Creators Lab", category: "Workshop",
    date: "2026-12-21", dateLabel: "21 Dec 2026", time: "1:00 PM – 5:00 PM",
    venue: "Makers District", description: "A practical creative lab for turning ideas into compelling digital content and experiences.",
    accent: "#d88cff", bg: "linear-gradient(135deg,#271533,#733f88)"
  }
];

const state = { category: "All", query: "" };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const eventsGrid = $("#events-grid");
const noResults = $("#no-results");
const searchInput = $("#search-input");
const filterGroup = $("#filter-group");
const eventModal = $("#event-modal");
const registrationModal = $("#registration-modal");
const successModal = $("#success-modal");
const registrationForm = $("#registration-form");
const eventSelect = $("#event-select");

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

function formatDateTime(dateString) {
  return new Date(`${dateString}T00:00:00`);
}

function renderEvents() {
  const query = state.query.trim().toLowerCase();
  const filtered = events.filter(event => {
    const matchesCategory = state.category === "All" || event.category === state.category;
    const haystack = `${event.name} ${event.category} ${event.venue} ${event.description}`.toLowerCase();
    return matchesCategory && haystack.includes(query);
  });

  eventsGrid.innerHTML = filtered.map((event, index) => `
    <article class="event-card">
      <div class="event-art" style="--event-bg:${event.bg};--event-accent:${event.accent}">
        <span class="event-category">${escapeHTML(event.category)}</span>
        <span class="event-index">${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="event-body">
        <h3>${escapeHTML(event.name)}</h3>
        <div class="event-meta">
          <span>▣ ${escapeHTML(event.dateLabel)}</span>
          <span>⌖ ${escapeHTML(event.venue)}</span>
        </div>
        <p class="event-desc">${escapeHTML(event.description)}</p>
        <div class="card-actions">
          <button class="btn-outline details-btn" type="button" data-event="${event.id}">Details</button>
          <button class="btn register-btn" type="button" data-event="${event.id}">Register</button>
        </div>
      </div>
    </article>
  `).join("");

  noResults.hidden = filtered.length !== 0;
}

function populateEventSelect() {
  eventSelect.innerHTML = `<option value="">Choose an event</option>` +
    events.map(event => `<option value="${event.id}">${escapeHTML(event.name)}</option>`).join("");
}

function getEvent(id) {
  return events.find(event => event.id === id);
}

function openModal(modal) {
  modal.hidden = false;
  document.body.classList.add("modal-open");
  const focusable = modal.querySelector("button, input, select, textarea");
  if (focusable) setTimeout(() => focusable.focus(), 0);
}

function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  if ($$(".modal:not([hidden])").length === 0) document.body.classList.remove("modal-open");
}

function openEventDetails(id) {
  const event = getEvent(id);
  if (!event) return;

  $("#event-modal-content").innerHTML = `
    <div class="modal-hero" style="--event-bg:${event.bg}">
      <h3>${escapeHTML(event.name)}</h3>
    </div>
    <p class="eyebrow">${escapeHTML(event.category)}</p>
    <h2 id="event-modal-title">${escapeHTML(event.name)}</h2>
    <p>${escapeHTML(event.description)}</p>
    <div class="detail-meta">
      <div><small>DATE</small><b>${escapeHTML(event.dateLabel)}</b></div>
      <div><small>TIME</small><b>${escapeHTML(event.time)}</b></div>
      <div><small>VENUE</small><b>${escapeHTML(event.venue)}</b></div>
      <div><small>FORMAT</small><b>In-person</b></div>
    </div>
    <p class="eyebrow">SCHEDULE</p>
    <div class="schedule">
      <div><span>Registration & welcome</span><b>09:30 AM</b></div>
      <div><span>Opening session</span><b>10:00 AM</b></div>
      <div><span>Main sessions / activities</span><b>11:00 AM</b></div>
      <div><span>Networking & close</span><b>04:30 PM</b></div>
    </div>
    <button class="btn" type="button" data-register-event="${event.id}">Register for this event →</button>
  `;
  openModal(eventModal);
}

function openRegistration(id = "") {
  clearErrors();
  registrationForm.reset();
  if (id) eventSelect.value = id;
  openModal(registrationModal);
}

function clearErrors() {
  $$("[data-error-for]").forEach(element => element.textContent = "");
  $$("input, select, textarea", registrationForm).forEach(element => element.removeAttribute("aria-invalid"));
}

function showError(field, message) {
  const error = $(`[data-error-for="${field}"]`);
  const input = $(`[name="${field}"]`, registrationForm);
  if (error) error.textContent = message;
  if (input) input.setAttribute("aria-invalid", "true");
}

function validateForm(data) {
  let valid = true;
  clearErrors();

  if (data.name.trim().length < 2) {
    showError("name", "Enter your full name.");
    valid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
    showError("email", "Enter a valid email address.");
    valid = false;
  }

  if (!/^[6-9]\d{9}$/.test(data.phone.replace(/\s+/g, ""))) {
    showError("phone", "Enter a valid 10-digit Indian mobile number.");
    valid = false;
  }

  if (!getEvent(data.event)) {
    showError("event", "Select an event.");
    valid = false;
  }

  return valid;
}

function generateConfirmationId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "EVT-";
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function handleRegistration(event) {
  event.preventDefault();

  const formData = new FormData(registrationForm);
  const data = Object.fromEntries(formData.entries());

  if (!validateForm(data)) {
    const firstInvalid = registrationForm.querySelector('[aria-invalid="true"]');
    firstInvalid?.focus();
    return;
  }

  const selectedEvent = getEvent(data.event);
  const registration = {
    id: generateConfirmationId(),
    createdAt: new Date().toISOString(),
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.replace(/\s+/g, ""),
    eventId: selectedEvent.id,
    eventName: selectedEvent.name,
    message: data.message.trim()
  };

  try {
    const existing = JSON.parse(localStorage.getItem("eventifyRegistrations") || "[]");
    existing.push(registration);
    localStorage.setItem("eventifyRegistrations", JSON.stringify(existing));
  } catch (error) {
    console.warn("LocalStorage unavailable:", error);
  }

  closeModal(registrationModal);
  $("#confirmation-id").textContent = registration.id;
  $("#success-message").textContent = `Thanks, ${registration.name}. Your registration for ${registration.eventName} has been recorded on this device.`;
  openModal(successModal);
}

function setupTheme() {
  try {
    const saved = localStorage.getItem("eventifyTheme");
    if (saved === "light") document.documentElement.classList.add("light");
  } catch (error) {
    console.warn("Theme preference unavailable:", error);
  }
  updateThemeButton();
}

function updateThemeButton() {
  const isLight = document.documentElement.classList.contains("light");
  const button = $(".theme-toggle");
  button.textContent = isLight ? "☀" : "☾";
  button.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
}

function toggleTheme() {
  document.documentElement.classList.toggle("light");
  const isLight = document.documentElement.classList.contains("light");
  try {
    localStorage.setItem("eventifyTheme", isLight ? "light" : "dark");
  } catch (error) {
    console.warn("Theme preference unavailable:", error);
  }
  updateThemeButton();
}

function setupCountdown() {
  const nameEl = $("#countdown-event-name");
  const dateEl = $("#countdown-event-date");
  const daysEl = $("#countdown-days");
  const hoursEl = $("#countdown-hours");
  const minutesEl = $("#countdown-minutes");
  const secondsEl = $("#countdown-seconds");

  const nextEvent = events
    .map(event => ({ ...event, timestamp: formatDateTime(event.date).getTime() }))
    .filter(event => event.timestamp > Date.now())
    .sort((a, b) => a.timestamp - b.timestamp)[0];

  if (!nextEvent) {
    nameEl.textContent = "All listed events have started.";
    dateEl.textContent = "Check back soon for new events.";
    return;
  }

  nameEl.textContent = nextEvent.name;
  dateEl.textContent = `${nextEvent.dateLabel} · ${nextEvent.time}`;

  const update = () => {
    const remaining = Math.max(0, nextEvent.timestamp - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  };

  update();
  window.setInterval(update, 1000);
}

function setupFAQ() {
  $$(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const shouldOpen = !item.classList.contains("open");
      $$(".faq-item").forEach(other => {
        other.classList.remove("open");
        $(".faq-question", other).setAttribute("aria-expanded", "false");
      });
      if (shouldOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function validateEmailField() {
  const email = $("#email");
  if (!email || email.value.trim() === "") return;
  const valid = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(email.value.trim());
  if (!valid) showError("email", "Enter a valid email address, e.g. name@example.com.");
  else {
    const error = $("[data-error-for=\"email\"]");
    error.textContent = "";
    email.removeAttribute("aria-invalid");
  }
}

function setupEvents() {
  filterGroup.addEventListener("click", event => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;
    state.category = button.dataset.category;
    $$(".filter-btn", filterGroup).forEach(item => item.classList.toggle("active", item === button));
    renderEvents();
  });

  searchInput.addEventListener("input", event => {
    state.query = event.target.value;
    renderEvents();
  });

  eventsGrid.addEventListener("click", event => {
    const detailsButton = event.target.closest(".details-btn");
    const registerButton = event.target.closest(".register-btn");
    if (detailsButton) openEventDetails(detailsButton.dataset.event);
    if (registerButton) openRegistration(registerButton.dataset.event);
  });

  $("#event-modal-content").addEventListener("click", event => {
    const button = event.target.closest("[data-register-event]");
    if (!button) return;
    closeModal(eventModal);
    openRegistration(button.dataset.registerEvent);
  });

  registrationForm.addEventListener("submit", handleRegistration);
  $("#email").addEventListener("blur", validateEmailField);
  $("#email").addEventListener("input", () => {
    if ($("#email").getAttribute("aria-invalid") === "true") validateEmailField();
  });
}


function setupModalClosing() {
  document.addEventListener("click", event => {
    const closeTarget = event.target.closest("[data-close]");
    if (closeTarget) closeModal(document.getElementById(closeTarget.dataset.close));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      $$(".modal:not([hidden])").forEach(closeModal);
    }
  });
}

function setupMobileNav() {
  const toggle = $(".nav-toggle");
  const menu = $("#nav-menu");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#nav-menu a").forEach(link => link.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

function init() {
  $("#year").textContent = new Date().getFullYear();
  populateEventSelect();
  renderEvents();
  setupTheme();
  setupCountdown();
  setupEvents();
  setupModalClosing();
  setupFAQ();
  setupMobileNav();
  $(".theme-toggle").addEventListener("click", toggleTheme);
}

document.addEventListener("DOMContentLoaded", init);
