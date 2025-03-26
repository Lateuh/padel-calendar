const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let user;
document.addEventListener('DOMContentLoaded', () => {
    user = getUser();
    if (user) {
        console.log('Utilisateur connecté:', user);
        document.getElementById('logoutBtn').style.display = 'flex';
        document.getElementById('openPopupBtn').style.display = 'none';
    } else {
        console.log('Aucun utilisateur connecté');
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('openPopupBtn').style.display = 'flex';
    }
});

const axiosInstance = axios.create({
    // baseURL seulement utilisé pour le dev en local
    // baseURL: 'http://localhost:5000',
    withCredentials: true
});

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

            day.addEventListener('click', async () => {
                try {
                    if (day.classList.contains('selected')) {
                        await deleteNotification(`${year}-${monthPretty}-${day.textContent}`);
                        day.classList.toggle('selected');
                    } else {
                        await addNotification(`${year}-${monthPretty}-${day.textContent}`);
                        day.classList.toggle('selected');
                    }
                } catch (error) {
                    console.error('Erreur lors de la mise à jour de la notification : ', error);
                    alert('Connexion requise pour modifier les notifications')
                }
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
        const response = await axiosInstance.get('/notifications');
        const notifications = response.data.notifications;
        return notifications || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications : ', error);
        return [];
    }
}

async function addNotification(date) {
    try {
        await axiosInstance.post('/notifications', { date });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la notification : ', error);
        throw error;
    }
}

async function deleteNotification(date) {
    try {
        await axiosInstance.delete(`/notifications/${date}`);
    } catch (error) {
        console.error('Erreur lors de la suppression de la notification : ', error);
        throw error;
    }
}

async function cleanupNotifications() {
    try {
        await axiosInstance.delete('/notifications');
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








document.getElementById('openPopupBtn').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'flex';
});

document.getElementById('logoutBtn').addEventListener('click', function () {
    console.log('Déconnexion en cours...');
    axiosInstance.post('/logout')
        .then(() => {
            document.getElementById('logoutBtn').style.display = 'none';
            document.getElementById('openPopupBtn').style.display = 'flex';
            clearUser();
            location.reload();
            console.log('Déconnexion réussie.');
        })
        .catch(error => {
            console.error('Erreur lors de la déconnexion : ', error);
        });
});

document.getElementById('closePopupBtn').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'none';
});

document.getElementById('showRegisterForm').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
});

document.getElementById('showLoginForm').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

document.getElementById('login').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Connexion en cours...');
    const username = document.getElementById('loginUsername').value;
    const pwd = document.getElementById('loginPassword').value;
    const data = { username: username, password: pwd };
    axiosInstance.post('/login', data)
        .then(response => {
            document.getElementById('popup').style.display = 'none';
            document.getElementById('openPopupBtn').style.display = 'none';
            document.getElementById('logoutBtn').style.display = 'flex';
            setUser({ user: response.data.user});
            console.log('Connexion réussie.');
        })
        .catch(error => {
            console.error('Erreur lors de la connexion : ', error);
        });
});

document.getElementById('register').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Inscription en cours...');
});





function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}

function clearUser() {
    localStorage.removeItem('user');
}
