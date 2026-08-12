
document.addEventListener('hide.bs.modal', function (event) {
    if (document.activeElement && event.target.contains(document.activeElement)) {
        document.activeElement.blur();
    }
});

const clickMenuBtn = document.querySelector('.click-menu');
const personalMenuEl = document.querySelector('.personal-menu');
if (clickMenuBtn && personalMenuEl) {
    clickMenuBtn.addEventListener('click', function () {
        this.classList.toggle('click-menu-act');
        personalMenuEl.classList.toggle('menu-opened');
    });
}


const themeToggle = document.getElementById('theme-toggle');
const lightBtn = document.querySelector('.click-light');
const darkBtn = document.querySelector('.click-dark');
const root = document.documentElement;

function applyTheme(theme) {
    root.setAttribute('data-bs-theme', theme);
    if (darkBtn) darkBtn.classList.toggle('dark-active', theme === 'dark');
    if (lightBtn) lightBtn.classList.toggle('light-active', theme === 'light');
    localStorage.setItem('theme', theme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        applyTheme(root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark');
    });
}

applyTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');


document.querySelectorAll('.all-contracts-menu').forEach(function (menu) {
    menu.addEventListener('click', function (e) {
        const item = e.target.closest('li');
        if (!item) return;

        const wrapper = item.closest('.all-contracts');
        const toggle = wrapper.querySelector('.btn-contracts');
        toggle.textContent = item.textContent.trim();

        bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const openBtn = document.getElementById("openCalendar");
    const popup = document.getElementById("calendarPopup");
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const selectedText = document.getElementById("selectedDateText");

    if (!openBtn || !popup || !startDate || !endDate || !selectedText) return;

    let viewYear = new Date().getFullYear();
    let viewMonth = new Date().getMonth();
    let selectingStart = true;

    function renderCalendars() {
        let nextMonth = viewMonth + 1;
        let nextYear = viewYear;
        if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
        }
        document.getElementById("month1Label").textContent = getMonthName(viewMonth) + " " + viewYear;
        document.getElementById("month2Label").textContent = getMonthName(nextMonth) + " " + nextYear;

        document.getElementById("month1").innerHTML = createCalendar(viewYear, viewMonth);
        document.getElementById("month2").innerHTML = createCalendar(nextYear, nextMonth);
        highlightSelection();
    }

    function parseDMY(str) {
        if (!str) return null;
        const [d, m, y] = str.split(".").map(Number);
        return new Date(y, m - 1, d);
    }

    function highlightSelection() {
        const from = parseDMY(startDate.value);
        const to = parseDMY(endDate.value || startDate.value);
        if (!from) return;
        const lo = from <= to ? from : to;
        const hi = from <= to ? to : from;
        document.querySelectorAll("#calendarPopup .day").forEach((cell) => {
            const cellDate = parseDMY(cell.dataset.date);
            cell.classList.toggle("selected", cellDate >= lo && cellDate <= hi);
        });
    }

    function createCalendar(year, month) {
        const monthNames = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
        const days = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
        let date = new Date(year, month, 1);
        let table = `<table><tr>${days.map(d => `<th>${d}</th>`).join("")}</tr><tr>`;

        let skip = (date.getDay() + 6) % 7;
        for (let i = 0; i < skip; i++) table += "<td></td>";

        while (date.getMonth() === month) {
            let d = date.getDate();
            table += `<td class="day" data-date="${d}.${month+1}.${year}">${d}</td>`;
            if ((date.getDay() + 6) % 7 === 6) table += "</tr><tr>";
            date.setDate(d + 1);
        }
        table += "</tr></table>";
        return table;
    }

    function getMonthName(month) {
        return ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"][month];
    }

    function formatDate(d) {
        return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    }

    function setRange(from, to) {
        startDate.value = formatDate(from);
        endDate.value = formatDate(to);
        selectingStart = true;
        viewYear = from.getFullYear();
        viewMonth = from.getMonth();
        renderCalendars();
    }


    const RANGE_PRESETS = {
        "Сегодня": () => {
            const t = new Date();
            return [t, t];
        },
        "Вчера": () => {
            const y = new Date();
            y.setDate(y.getDate() - 1);
            return [y, y];
        },
        "Текущая неделя": () => {
            const t = new Date();
            const monday = new Date(t);
            monday.setDate(t.getDate() - ((t.getDay() + 6) % 7));
            return [monday, t];
        },
        "Прошлая неделя": () => {
            const t = new Date();
            const thisMonday = new Date(t);
            thisMonday.setDate(t.getDate() - ((t.getDay() + 6) % 7));
            const lastMonday = new Date(thisMonday);
            lastMonday.setDate(thisMonday.getDate() - 7);
            const lastSunday = new Date(thisMonday);
            lastSunday.setDate(thisMonday.getDate() - 1);
            return [lastMonday, lastSunday];
        },
        "Текущий месяц": () => {
            const t = new Date();
            return [new Date(t.getFullYear(), t.getMonth(), 1), t];
        },
        "Прошлый месяц": () => {
            const t = new Date();
            return [new Date(t.getFullYear(), t.getMonth() - 1, 1), new Date(t.getFullYear(), t.getMonth(), 0)];
        },
        "Текущий год": () => {
            const t = new Date();
            return [new Date(t.getFullYear(), 0, 1), t];
        },
        "Прошлый год": () => {
            const t = new Date();
            return [new Date(t.getFullYear() - 1, 0, 1), new Date(t.getFullYear() - 1, 11, 31)];
        },
        "За всё время": () => [new Date(2000, 0, 1), new Date()],
    };

    document.querySelectorAll(".calendar-left li").forEach(function (li) {
        const preset = RANGE_PRESETS[li.textContent.trim()];
        if (!preset) return;
        li.addEventListener("click", () => {
            const [from, to] = preset();
            setRange(from, to);
            selectedText.textContent = `${startDate.value} - ${endDate.value}`;
            popup.style.display = "none";
        });
    });

    openBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        popup.style.display = popup.style.display === "flex" ? "none" : "flex";
        renderCalendars();
    });

    popup.addEventListener("click", (e) => e.stopPropagation());

    // Clicking anywhere outside the popup closes it without applying the in-progress pick.
    document.addEventListener("click", () => {
        popup.style.display = "none";
    });

    document.getElementById("cancelBtn").addEventListener("click", () => {
        startDate.value = "";
        endDate.value = "";
        selectingStart = true;
        popup.style.display = "none";
    });

    document.getElementById("applyBtn").addEventListener("click", () => {
        if (startDate.value && endDate.value) {
            selectedText.textContent = `${startDate.value} - ${endDate.value}`;
        }
        popup.style.display = "none";
    });

    document.getElementById("prevMonth").addEventListener("click", () => {
        viewMonth--;
        if (viewMonth < 0) {
            viewMonth = 11;
            viewYear--;
        }
        renderCalendars();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        viewMonth++;
        if (viewMonth > 11) {
            viewMonth = 0;
            viewYear++;
        }
        renderCalendars();
    });

    popup.addEventListener("click", function(e) {
        if (e.target.classList.contains("day")) {
            if (selectingStart) {
                startDate.value = e.target.dataset.date;
                endDate.value = "";
                selectingStart = false;
            } else {
                endDate.value = e.target.dataset.date;
                selectingStart = true;
            }
            highlightSelection();
        }
    });
});




if (document.querySelector('.review-slider')) {
    let usersSwiper = new Swiper(".review-slider", {
        loop: true,
        slidesPerView: 4,
        spaceBetween: 16,
        breakpoints: {
            '1450': {
                slidesPerView: 4,
                spaceBetween: 16,
            },
            '1199': {
                slidesPerView: 3,
                spaceBetween: 16,
            },
            '570': {
                slidesPerView: 3,
                spaceBetween: 16,
            },
            '320': {
                slidesPerView: 2,
                spaceBetween: 16,
            },
        }

    });
}
