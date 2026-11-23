const themeBtn = document.getElementById("themeBtn");
function setTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem("theme", theme);              
  themeBtn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}
setTheme(localStorage.getItem("theme") || "light");
themeBtn.addEventListener("click", function () {
  const now = document.documentElement.getAttribute("data-bs-theme");
  setTheme(now === "dark" ? "light" : "dark");
})

const places = [
  { name: "Maletsunyane Falls", type: "Nature",    img: "mal",      alt: "Waterfall dropping into a green gorge", text: "A 192 m drop near Semonkong, one of the highest single-drop waterfalls in southern Africa." },
  { name: "Thaba-Bosiu",        type: "History",   img: "thaba",    alt: "Flat-topped mountain at golden hour",   text: "The mountain where King Moshoeshoe I built the Basotho nation's stronghold." },
  { name: "Katse Dam",          type: "Nature",    img: "download", alt: "Blue reservoir between steep hills",    text: "A huge highland dam with lake views, boat trips and fishing." },
  { name: "Sani Pass",          type: "Adventure", img: "sani",     alt: "Winding mountain pass in grey rock",    text: "A steep 4x4 road up the Drakensberg to the highest pub in Africa." },
  { name: "Pony trekking",      type: "Adventure", img: "pony",     alt: "Green hills where pony treks run",      text: "Cross the highlands the way Basotho herders do, on a sure-footed pony." },
  { name: "Skiing at Afriski",  type: "Adventure", img: "images",   alt: "Snowy slopes at a ski resort",          text: "Southern Africa's snow season runs June to August." }
];
const cardBox = document.getElementById("cards");
if (cardBox) {                                                // only runs on destinations.html
  let chosenType = "All";
  function showCards() {
    const word = document.getElementById("search").value.toLowerCase();
    let html = "", found = 0;
    places.forEach(function (p) {
      const typeOk = chosenType === "All" || p.type === chosenType;
      const wordOk = (p.name + " " + p.text).toLowerCase().includes(word);
      if (typeOk && wordOk) {
        found++;
        html += '<article class="col-12 col-md-6 col-lg-4"><div class="card h-100">' +
          '<img src="' + p.img + '.jpg" class="card-img-top" alt="' + p.alt + '" width="800" height="500">' +
          '<div class="card-body"><span class="badge text-bg-info mb-2">' + p.type + '</span>' +
          '<h3 class="h5">' + p.name + '</h3><p>' + p.text + '</p></div></div></article>';
      }
    });
    cardBox.innerHTML = html;
    document.getElementById("resultCount").textContent = found > 0 ? found + " result(s)" : "No matches. Try another word, or choose All.";
  }
  document.getElementById("search").addEventListener("input", showCards);
  document.querySelectorAll("#filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      chosenType = btn.dataset.filter;
      document.querySelectorAll("#filters button").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      showCards();
    });
  });
  showCards();
}

const photos = [
  ["mal", "Maletsunyane Falls after rain"],
  ["thaba", "The view from Thaba-Bosiu"],
  ["download", "Katse Dam at sunrise"],
  ["sani", "Sani Pass switchbacks"],
  ["pony", "Pony trek in the highlands"],
  ["images", "Skiing at Afriski"]
];
const modalBox = document.getElementById("photoModal");
if (modalBox) {
  const popup = new bootstrap.Modal(modalBox);
  let current = 0;
  function showPhoto(n) {
    current = (n + photos.length) % photos.length;
    document.getElementById("photoTitle").textContent = photos[current][1];
    document.getElementById("modalImg").src = photos[current][0] + ".jpg";
    document.getElementById("modalImg").alt = photos[current][1];
  }
  document.querySelectorAll(".gallery-item").forEach(function (btn) {
    btn.addEventListener("click", function () { showPhoto(Number(btn.dataset.index)); popup.show(); });
  });
  document.getElementById("prevBtn").addEventListener("click", function () { showPhoto(current - 1); });
  document.getElementById("nextBtn").addEventListener("click", function () { showPhoto(current + 1); });
}


function checkForm(form, messageBox, successText) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let allGood = true;
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      if (field.checkValidity()) {
        field.classList.remove("is-invalid"); field.classList.add("is-valid");
      } else { field.classList.remove("is-valid"); field.classList.add("is-invalid"); allGood = false; }
    });
    if (allGood) {
      messageBox.textContent = successText();
      messageBox.className = "alert alert-success mt-4";
      form.reset();
      form.querySelectorAll(".is-valid").forEach(function (f) { f.classList.remove("is-valid"); });
    } else {
      messageBox.textContent = "Please fix the red fields and try again.";
      messageBox.className = "alert alert-danger mt-4";
    }
  });
}

const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("bDate").min = today;
  checkForm(bookingForm, bookingForm.nextElementSibling, function () {
    return "Thank you, " + document.getElementById("bName").value + ". We received your booking request and will email you soon.";
  });

  const service = document.getElementById("service");
  function calculate() {
    const rate = Number(service.selectedOptions[0].dataset.rate);
    const total = rate * Number(document.getElementById("people").value) * Number(document.getElementById("nights").value);
    document.getElementById("estimate").textContent = total > 0
      ? "Estimated cost: LSL " + total + " (sample prices, not a real quote)."
      : "Estimated cost: choose a service.";
  }
  ["service", "people", "nights"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", calculate);
  });
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  checkForm(contactForm, contactForm.nextElementSibling, function () {
    return "Thank you, " + document.getElementById("cName").value + ". Your message was sent.";
  });
}
