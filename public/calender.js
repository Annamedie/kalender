let currentDate = new Date();

// föklarra funktion för att uppdatera kalendern.
function initCalendar() {
  // Genrerar kalendern med nuvarande datum.
  renderCalendar();

  // Lägger till för att gå bakåt i kalendern.
  document.getElementById("beforeBtn").addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  // Lägger till för att gå framåt i kalendern.
  document.getElementById("nextBtn").addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
}

// Bestämma för en funktion för att generera kalendern.
function renderCalendar() {
  //hämtar element för datum o månad/år från HTML-dokumentet.
  const dateElement = document.getElementById("calendar-dates");
  const monthYearElement = document.getElementById("monthYear");

  // ser om elementen finns, avslutar funktionen om de inte finns.
  if (!dateElement || !monthYearElement) {
    return; // Exit function om elements inte hittats
  }

  // Hämtar nuvarande år och månad från det givna datumet.
  let storedTodosArray = [];
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  // Skapar objekt för första och sista dagen i månaden.
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  // Hämtar antalet dagar i månaden och index för första och sista dagen.
  const totalDays = lastDay.getDate();
  /* Justerar så 0 = sön och mån = 1 ist för den amerkanska tänket*/
  let firstDayIndex = firstDay.getDay();
  if (firstDayIndex === 0) {
    firstDayIndex = 6;
  } else {
    firstDayIndex -= 1;
  }
  const lastDayIndex = lastDay.getDay();

  // Omvandlar datumet till en sträng som visar månadens namn och året, och visar sedan denna sträng.
  const monthYearString = currentDate.toLocaleString("sv-se", {
    month: "long",
    year: "numeric",
  });
  let upperCaseMontYearString =
    monthYearString.charAt(0).toUpperCase() + monthYearString.slice(1);
  monthYearElement.textContent = upperCaseMontYearString;
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    storedTodosArray = JSON.parse(storedTodos);
  } else {
    storedTodosArray = [];
  }
  console.log(storedTodosArray);
  // skapr Html för datumen
  let datesHTML = "";
  //lägger till de inaktiva datumen före den första dagen i månaden
  for (let i = firstDayIndex; i > 0; i--) {
    datesHTML += `<div class="date inactive" data-cy="calendar-cell"><p data-cy="calendar-cell-date"> ${new Date(
      currentYear,
      currentMonth,
      -i + 1
    ).getDate()}</p></div>`;
  }
  // lägger till alla datumen för månaden.
  for (let i = 1; i <= totalDays; i++) {
    const activeClass =
      i === new Date().getDate() &&
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
        ? "active"
        : "";

    const currentDateTodos = storedTodosArray.filter((todo) => {
      const todoDate = new Date(todo.date);
      return (
        todoDate.getDate() === i &&
        todoDate.getMonth() === currentMonth &&
        todoDate.getFullYear() === currentYear
      ); // gör så att todos är filtrerade baserad på dag, månad och år
    });
    let todoContent =
      currentDateTodos.length > 0 ? currentDateTodos.length : ""; //gör så att todoContent visar rätt siffra för todos

    datesHTML += `<div class="date ${activeClass}" data-cy="calendar-cell">
                <p data-cy="calendar-cell-date">${i}</p>
                ${
                  todoContent
                    ? `<span class="event-count" data-cy="calendar-cell-todos">${todoContent}</span>`
                    : ""
                }
              </div>`;
  }
  //lägger till inaktiva datum efter den sista dagen i månaden
  let remainingDays = 7 - lastDayIndex;
  if (lastDayIndex === 0) {
    remainingDays = 0;
  }

  const daysAfterMonth = remainingDays === 7 ? 0 : remainingDays;

  // Add inactive dates after the end of the month up to the end of the current week
  for (let i = 1; i <= daysAfterMonth; i++) {
    datesHTML += `<div class="date inactive" data-cy="calendar-cell"><p data-cy="calendar-cell-date">${i}</p></div>`;
  }
  // sätter in HTML för datumen i kalenderelementen.
  dateElement.innerHTML = datesHTML;
  const allDatesElements = document.querySelectorAll(".date");
  allDatesElements.forEach((allDate) => {
    allDate.addEventListener("click", getClickedDay);
  });
}

function getClickedDay(e) {
  const clickedDay = e.currentTarget;

  const clickedDateText = clickedDay.querySelector("p").textContent;

  const monthAndYear = document.getElementById("monthYear").textContent;
  const arrayMonthYear = monthAndYear.split(" ");
  const clickedMonth = arrayMonthYear[0];
  const clickedYear = Number(arrayMonthYear[1]);

  const months = [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december",
  ];
  const lowercaseMonth = clickedMonth.toLowerCase();
  const monthIndex = months.indexOf(lowercaseMonth);
  const clickedDate = Number(clickedDateText);

  let year = clickedYear;
  let month = monthIndex;
  let day = clickedDate;

  const clickedClass = clickedDay.classList;
  if (clickedClass.contains("first-inactive")) {
    month -= 1;
  } else if (clickedClass.contains("last-inactive")) {
    month += 1;
  }

  const date = new Date(year, month, day);

  const dateString = date.toLocaleDateString("sv-sv");

  clickedDay.classList.toggle("slected-day");
  const allDatesElements = document.querySelectorAll(".date");
  allDatesElements.forEach((dateElement) => {
    if (dateElement !== clickedDay) {
      dateElement.classList.remove("slected-day");
    }
  });
  console.log("You Clicked on me!", dateString);

  renderTodoList(dateString);
}
