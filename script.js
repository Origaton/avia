// Глобальная переменная для хранения таймера
let reservationTimer;
let departureDate;
let passengers;

// База данных городов и аэропортов
const cities = [
    "Москва",
    "Минск",
    "Мурманск",
    "Магадан",
    "Минеральные воды",
    "Махачкала",
    "Санкт-Петербург",
    "Екатеринбург",
    "Мостар",
    "Казань",
    "Новосибирск",
    "Сочи",
    "Владивосток",
    "Париж",
    "Лондон",
    "Нью-Йорк",
    "Стамбул",
    "Дубай",
    "Токио",
    "Усть-Байкальск",
    "Улан-Удэ",
    "Усть-Каменогорск",
    "Усинск",
    "Усть-Кут"
];

// База данных билетов
const tickets = [
    {
        airline: "S7 Airlines",
        price: "13 750 ₽",
        departureTime: "00:35",
        arrivalTime: "02:40",
        duration: "2ч 05м"
    },
    {
        airline: "Аэрофлот",
        price: "12 450 ₽",
        departureTime: "08:30",
        arrivalTime: "10:45",
        duration: "2ч 15м"
    },
    {
        airline: "S7 Airlines",
        price: "10 900 ₽",
        departureTime: "14:20",
        arrivalTime: "17:05",
        duration: "2ч 45м"
    },
    {
        airline: "Победа",
        price: "8 500 ₽",
        departureTime: "19:45",
        arrivalTime: "22:50",
        duration: "3ч 05м"
    }
];

// Функция для отображения подсказок
function showSuggestions(input, suggestionsContainer) {
    const inputValue = input.value.toLowerCase();
    if (inputValue.length < 1) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(inputValue)
    );

    if (filteredCities.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    suggestionsContainer.innerHTML = filteredCities.map(city =>
        `<div class="autocomplete-suggestion">${city}</div>`
    ).join('');

    suggestionsContainer.style.display = 'block';
}

// Обработчики событий
const fromInput = document.getElementById('from-input');
const fromSuggestions = document.getElementById('from-suggestions');
const toInput = document.getElementById('to-input');
const toSuggestions = document.getElementById('to-suggestions');

fromInput.addEventListener('input', () => {
    showSuggestions(fromInput, fromSuggestions);
});

toInput.addEventListener('input', () => {
    showSuggestions(toInput, toSuggestions);
});

// Клик по подсказке
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('autocomplete-suggestion')) {
        const input = e.target.closest('.search-group').querySelector('.search-input');
        input.value = e.target.textContent;
        input.focus();
        document.querySelectorAll('.autocomplete-suggestions').forEach(el => {
            el.style.display = 'none';
        });
    }
});

// Скрытие подсказок при клике вне
document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('search-input')) {
        document.querySelectorAll('.autocomplete-suggestions').forEach(el => {
            el.style.display = 'none';
        });
    }
});

// Обработчик для счётчика пассажиров
document.addEventListener('DOMContentLoaded', function () {
    const minusBtn = document.querySelector('.counter-btn.minus');
    const plusBtn = document.querySelector('.counter-btn.plus');
    const counterValue = document.querySelector('.counter-value');

    passengers = 1;

    function updateCounter() {
        counterValue.textContent = passengers + (passengers === 1 ? ' человек' : ' человека');
    }

    minusBtn.addEventListener('click', function () {
        if (passengers > 1) {
            passengers--;
            updateCounter();
        }
    });

    plusBtn.addEventListener('click', function () {
        passengers++;
        updateCounter();
    });
});

// Обработчик формы поиска
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Получаем данные из формы
    const from = document.getElementById('from-input').value;
    const to = document.getElementById('to-input').value;
    departureDate = document.getElementById('departure-date').value;

    // Показываем параметры поиска
    document.getElementById('searchParams').innerHTML = `
                <p><strong>Маршрут:</strong> ${from} → ${to}</p>
                <p><strong>Дата вылета:</strong> ${departureDate || 'Не указана'}</p>
            `;

    // Генерируем тестовые билеты
    generateTickets(from, to);

    // Показываем модальное окно
    document.getElementById('resultsModal').classList.add('active');
    document.getElementById('resultsModal').style.display = 'flex';
});

// Закрытие модального окна
document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('resultsModal').classList.remove;
    document.getElementById('resultsModal').style.display = 'none';
});

// Закрытие при клике вне окна
window.addEventListener('click', function (e) {
    if (e.target === document.getElementById('resultsModal')) {
        document.getElementById('resultsModal').classList.remove;
        document.getElementById('resultsModal').style.display = 'none';
    }
});

// Функция генерации тестовых билетов
function generateTickets(from, to) {
    const ticketList = document.getElementById('ticketList');
    ticketList.innerHTML = '';

    // Добавляем билеты в список
    tickets.forEach(ticket => {
        const ticketItem = document.createElement('div');
        ticketItem.className = 'ticket-item';
        ticketItem.innerHTML = `
                    <div class="ticket-info">
                        <h3 id="flight">${from} → ${to}</h3>
                        <p id="airline">${ticket.airline}</p>
                        <p id="time">${ticket.departureTime} - ${ticket.arrivalTime} (${ticket.duration})</p>
                    </div>
                    <div id="prise" class="ticket-price">${ticket.price}</div>
                    <button class="buy-button">Забронировать</button>
                `;
        ticketList.appendChild(ticketItem);
    });
}

// Обработчик кнопок "Купить"
document.body.addEventListener('click', function (e) {
    if (e.target.classList.contains('buy-button') && e.target.id !== 'proceedToPayment') {

        const ticket = e.target.closest('.ticket-item');
        // Заполняем информацию о брони
        document.getElementById('bookedFlight').textContent = ticket.querySelector('#flight').textContent;
        document.getElementById('bookedAirline').textContent = ticket.querySelector('#airline').textContent;
        document.getElementById('bookedDate').textContent = departureDate.toString();
        document.getElementById('bookedTime').textContent = ticket.querySelector('#time').textContent;
        document.getElementById('bookedTicketsCount').textContent = passengers.toString();
        document.getElementById('bookingNumber').textContent = generateBookingNumber();

        //const flight = e.target.getAttribute('data-flight');
        startCountdown(30);

        // Закрываем окно результатов и открываем окно оплаты
        document.getElementById('resultsModal').style.display = 'none';
        document.getElementById('paymentModal').style.display = 'flex';
    }
});

// Закрытие окна оплаты
document.getElementById('closePaymentModal').addEventListener('click', () => {
    document.getElementById('paymentModal').style.display = 'none';
    clearInterval(reservationTimer);
});

// Закрытие при клике вне окна
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('paymentModal')) {
        document.getElementById('paymentModal').style.display = 'none';
        clearInterval(reservationTimer);
    }
});

// Функция запуска таймера
function startCountdown(durationInMinutes) {
    const countdownElement = document.getElementById('countdown');
    let timeLeft = durationInMinutes * 60; // Переводим в секунды

    // Обновляем таймер каждую секунду
    reservationTimer = setInterval(function () {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        // Форматируем вывод (добавляем ведущий ноль)
        countdownElement.textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Если время вышло
        if (timeLeft <= 0) {
            clearInterval(reservationTimer);
            countdownElement.textContent = "00:00";
            countdownElement.style.color = "#888";
            document.getElementById('proceedToPayment').disabled = true;
        } else {
            timeLeft--;
        }
    }, 1000);
}

// Генератор номера брони
function generateBookingNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}
