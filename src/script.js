const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
];

function renderCalendar(month, year) {
    calendarDates.innerHTML = '';
    monthYear.textContent = `${months[month]} ${year}`;
    monthPretty = monthPrettier(month);

    const today = new Date();

    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();

    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create blanks for days of the week before the first day
    for (let i = 1; i < firstDay; i++) {
        const blank = document.createElement('div');
        calendarDates.appendChild(blank);
    }

    const notifications = fetchNotifications();


    notifications.then(notificationsData => {
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            day.textContent = i < 10 ? `0${i}` : i;
            const date = dateFormat(day.textContent, monthPretty, year);

            if (notificationsData.some(item => item.date === date)) {
                day.classList.add('selected');
            }

            if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                day.classList.add('current-date');
            }

            day.addEventListener('click', () => {
                if (day.classList.contains('selected')) {
                    deleteNotification(`${year}-${monthPretty}-${day.textContent}`);
                } else {
                    addNotification(`${year}-${monthPretty}-${day.textContent}`);
                }
                day.classList.toggle('selected');
            });

            calendarDates.appendChild(day);
        }
    }).catch(error => {
        console.error('Error rendering calendar:', error);
    });
}

function monthPrettier(month) {
    if (month + 1 < 10) {
        return `0${month + 1}`;
    } else {
        return month + 1;
    }
}

function dateFormat(day, month, year) {
    return `${year}-${month}-${day}`;
}

async function fetchNotifications() {
    try {
        const response = await axios.get('/notifications');
        const notifications = response.data.notifications;
        console.log(notifications);
        return notifications || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications : ', error);
        return [];
    }
}

async function addNotification(date) {
    try {
        const response = await axios.post('/notifications', { date });
        console.log(response.data);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la notification : ', error);
    }
}

async function deleteNotification(date) {
    try {
        const response = await axios.delete(`/notifications/${date}`);
        console.log(response.data);
    } catch (error) {
        console.error('Erreur lors de la suppression de la notification : ', error);
    }
}

async function cleanupNotifications() {
    try {
        const response = await axios.delete('/notifications');
        console.log(response.data);
    } catch (error) {
        console.error('Erreur lors du nettoyage des notifications : ', error);
    }

    renderCalendar(currentMonth, currentYear);
}


renderCalendar(currentMonth, currentYear);

prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});

document.getElementById("clean-up").addEventListener("click", cleanupNotifications);
