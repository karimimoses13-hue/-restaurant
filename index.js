// DOM 
document.addEventListener('DOMContentLoaded', function() {
    loadOffers();
});

// Function to load offers from localStorage and display
function loadOffers() {
    const offersContainer = document.getElementById('offers-container');
    
    // Get offers from localStorage or initialize empty array
    let offers = JSON.parse(localStorage.getItem('villaRossa_offers')) || [];
    
    if (offers.length === 0) {
        offersContainer.innerHTML = '<p class="no-offers">No special offers at the moment. Check back soon!</p>';
        return;
    }
    
    // Build HTML for each offer
    let html = '';
    offers.forEach(offer => {
        html += `
            <div class="offer-card">
                <img src="${offer.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}" alt="${offer.title}">
                <div class="offer-content">
                    <h3>${offer.title}</h3>
                    <p class="price">$${offer.price}</p>
                    <p>${offer.description}</p>
                </div>
            </div>
        `;
    });
    
    offersContainer.innerHTML = html;
}