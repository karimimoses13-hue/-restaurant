document.addEventListener('DOMContentLoaded', function() {
    loadReservations();
    
    const form = document.getElementById('reservation-form');
    form.addEventListener('submit', handleReservationSubmit);
});

function handleReservationSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = document.getElementById('guests').value;
    
    // Validate
    let isValid = true;
    
    if (!name) {
        showError('name', 'Full name is required');
        isValid = false;
    }
    
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email');
        isValid = false;
    }
    
    if (!date) {
        showError('date', 'Date is required');
        isValid = false;
    } else {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selectedDate < today) {
            showError('date', 'Date cannot be in the past');
            isValid = false;
        }
    }
    
    if (!time) {
        showError('time', 'Time is required');
        isValid = false;
    }
    
    if (!guests) {
        showError('guests', 'Number of guests is required');
        isValid = false;
    } else if (guests < 1 || guests > 20) {
        showError('guests', 'Guests must be between 1 and 20');
        isValid = false;
    }
    
    if (!isValid) return;
    
    //  reservation object
    const reservation = {
        id: Date.now(),
        name,
        email,
        date,
        time,
        guests
    };
    
    // Save to localStorage
    saveReservation(reservation);
    
    // Reset form
    form.reset();
    
    // Reload reservations list
    loadReservations();
}

function showError(fieldId, message) {
    const errorDiv = document.getElementById(`${fieldId}-error`);
    if (errorDiv) {
        errorDiv.textContent = message;
    }
}

function clearErrors() {
    const errorDivs = document.querySelectorAll('.error');
    errorDivs.forEach(div => div.textContent = '');
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function saveReservation(reservation) {
    let reservations = JSON.parse(localStorage.getItem('villaRossa_reservations')) || [];
    reservations.push(reservation);
    localStorage.setItem('villaRossa_reservations', JSON.stringify(reservations));
}

function loadReservations() {
    const container = document.getElementById('reservations-list');
    let reservations = JSON.parse(localStorage.getItem('villaRossa_reservations')) || [];
    
    if (reservations.length === 0) {
        container.innerHTML = '<p class="no-reservations">No reservations yet. Book your table now!</p>';
        return;
    }
    
    // Sort by date, most recent first
    reservations.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    reservations.forEach(res => {
        html += `
            <div class="reservation-card">
                <h3>${res.name}</h3>
                <p><i class="fas fa-calendar"></i> ${formatDate(res.date)}</p>
                <p><i class="fas fa-clock"></i> ${res.time}</p>
                <p><i class="fas fa-users"></i> ${res.guests} guest${res.guests > 1 ? 's' : ''}</p>
                <p><i class="fas fa-envelope"></i> ${res.email}</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}