document.addEventListener('DOMContentLoaded', function () {
    loadOffers();

    const form = document.getElementById('offer-form');
    if (form) {
        form.addEventListener('submit', handleOfferSubmit);
    }
});

function handleOfferSubmit(e) {
    e.preventDefault();

    clearErrors();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = document.getElementById('price').value.trim();
    const image = document.getElementById('image').value.trim();

    let isValid = true;

    if (!title) {
        showError('title', 'Offer title is required');
        isValid = false;
    }

    if (!description) {
        showError('description', 'Description is required');
        isValid = false;
    }

    if (!price) {
        showError('price', 'Price is required');
        isValid = false;
    } else if (isNaN(price) || parseFloat(price) <= 0) {
        showError('price', 'Please enter a valid price greater than 0');
        isValid = false;
    }

    if (!image) {
        showError('image', 'Image URL is required');
        isValid = false;
    }

    // ✅ If form is valid, save the offer
    if (isValid) {
        const offer = {
            id: Date.now(), 
            title: title,
            description: description,
            price: parseFloat(price),
            image: image
        };

        saveOffer(offer);
        loadOffers();
        document.getElementById('offer-form').reset();
    }
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

function saveOffer(offer) {
    let offers = JSON.parse(localStorage.getItem('villaRossa_offers')) || [];
    offers.push(offer);
    localStorage.setItem('villaRossa_offers', JSON.stringify(offers));
}

function loadOffers() {
    const container = document.getElementById('offers-list');
    if (!container) return;

    let offers = JSON.parse(localStorage.getItem('villaRossa_offers')) || [];

    if (offers.length === 0) {
        container.innerHTML = '<p class="no-offers">No offers added yet. Add your first offer above.</p>';
        return;
    }

    let html = '';
    offers.forEach(offer => {
        html += `
            <div class="admin-offer-card" data-id="${offer.id}">
                <img src="${offer.image}" alt="${offer.title}">
                <button class="delete-btn" onclick="deleteOffer(${offer.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <div class="admin-offer-content">
                    <h3>${offer.title}</h3>
                    <p class="price">$${offer.price}</p>
                    <p>${offer.description}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Delete function 
window.deleteOffer = function (id) {
    let offers = JSON.parse(localStorage.getItem('villaRossa_offers')) || [];
    offers = offers.filter(offer => offer.id !== id);
    localStorage.setItem('villaRossa_offers', JSON.stringify(offers));
    loadOffers();
};
