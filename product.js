document.addEventListener('DOMContentLoaded', () => {
    const storedProducts = JSON.parse(localStorage.getItem('naturalProducts')) || [];

    const categoryMap = {
        'functional': 'functional-foods',
        'plant-based': 'plant-based',
        'nutraceuticals': 'nutraceuticals',
        'beauty': 'clean-beauty'
    };

    // Helper function to draw the stars based on the saved rating
    function renderStars(currentRating) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= currentRating) {
                starsHtml += `<span class="star active" data-value="${i}">★</span>`;
            } else {
                starsHtml += `<span class="star" data-value="${i}">★</span>`;
            }
        }
        return starsHtml;
    }

    // Render Products
    storedProducts.forEach(product => {
        const sectionId = categoryMap[product.category];
        const section = document.getElementById(sectionId);

        if (section) {
            let scrollContainer = section.querySelector('.scroll-container');
            if (!scrollContainer) {
                scrollContainer = document.createElement('div');
                scrollContainer.className = 'scroll-container';
                section.appendChild(scrollContainer);
            }

            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            let imageHTML = '';
            if (product.image) {
                imageHTML = `<img src="${product.image}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">`;
            }
            
            // We use the product's saved rating, or default to 0 if it hasn't been rated yet
            const savedRating = product.userRating || 0;

            productCard.innerHTML = `
                ${imageHTML}
                <h3 style="margin-top: 5px; margin-bottom: 5px;">${product.name}</h3>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 0.8rem; color: white; background: #2e7d32; padding: 3px 8px; border-radius: 12px;">New Startup</span>
                    
                    <div class="rating-container" data-product-id="${product.id}">
                        ${renderStars(savedRating)}
                    </div>
                </div>
                
                <p style="font-size: 0.9rem; margin-bottom: 2px;"><strong>Description:</strong></p>
                <div class="text-clamp" style="font-size: 0.9rem;">${product.description}</div>
                <button class="read-more-btn" onclick="toggleText(this)">Read More</button>
                
                <p style="font-size: 0.9rem; margin-top: 5px; margin-bottom: 2px;"><strong>Ingredients:</strong></p>
                <div class="text-clamp" style="font-size: 0.9rem;">${product.ingredients}</div>
                <button class="read-more-btn" onclick="toggleText(this)">Read More</button>

                <p style="font-size: 0.9rem; margin-bottom: 10px; margin-top: 5px;"><strong>Contact:</strong> ${product.contact}</p>
                
                <button class="delete-btn" data-id="${product.id}">Remove Product</button>
            `;
            
            scrollContainer.appendChild(productCard);
        }
    });

    // Live Search
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('keyup', function(event) {
            const searchQuery = event.target.value.toLowerCase();
            const allProductCards = document.querySelectorAll('.product-card');

            allProductCards.forEach(card => {
                const cardText = card.innerText.toLowerCase();
                if (cardText.includes(searchQuery)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Click Event Listener for Deleting AND Rating
    document.addEventListener('click', function(event) {
        
        // 1. If they clicked the Remove Button
        if (event.target.classList.contains('delete-btn')) {
            const confirmDelete = confirm("Are you sure you want to completely remove this product?");
            if (confirmDelete) {
                const productIdToDelete = event.target.getAttribute('data-id');
                let products = JSON.parse(localStorage.getItem('naturalProducts')) || [];
                products = products.filter(product => product.id != productIdToDelete);
                localStorage.setItem('naturalProducts', JSON.stringify(products));
                event.target.closest('.product-card').remove();
            }
        }

        // 2. If they clicked a Star Rating
        if (event.target.classList.contains('star')) {
            const clickedStar = event.target;
            const ratingValue = parseInt(clickedStar.getAttribute('data-value'));
            const container = clickedStar.closest('.rating-container');
            const productId = container.getAttribute('data-product-id');

            // Update the database
            let products = JSON.parse(localStorage.getItem('naturalProducts')) || [];
            const productIndex = products.findIndex(p => p.id == productId);
            
            if (productIndex !== -1) {
                products[productIndex].userRating = ratingValue;
                localStorage.setItem('naturalProducts', JSON.stringify(products));
            }

            // Update the stars on the screen instantly
            container.innerHTML = renderStars(ratingValue);
        }
    });
});

// Global Function to Expand/Collapse the text
window.toggleText = function(button) {
    const textElement = button.previousElementSibling;
    if (textElement.classList.contains('text-clamp')) {
        textElement.classList.remove('text-clamp');
        button.innerText = "Show Less";
    } else {
        textElement.classList.add('text-clamp');
        button.innerText = "Read More";
    }
};