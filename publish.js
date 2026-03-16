document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop page from reloading

        // Grab input values
        const name = document.getElementById('product-name').value.trim();
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value.trim();
        const ingredients = document.getElementById('ingredients').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const imageInput = document.getElementById('product-image');

        // Validate Contact
        if (contact.length < 10) {
            alert('Error: Please enter a valid phone number with at least 10 digits.');
            return;
        }

        // Process Image and Save
        const file = imageInput.files[0];
        if (file) {
            if (file.size > 1048576) { 
                alert("Error: Image is too large! Please upload an image smaller than 1MB.");
                return;
            }

            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imageData = e.target.result;
                
                const newProduct = {
                    id: Date.now(),
                    name: name,
                    category: category,
                    description: description,
                    ingredients: ingredients,
                    contact: contact,
                    image: imageData 
                };

                try {
                    // Save to localStorage
                    let products = JSON.parse(localStorage.getItem('naturalProducts')) || [];
                    products.push(newProduct);
                    localStorage.setItem('naturalProducts', JSON.stringify(products));

                    // Alert the user
                    alert(`Success! ${name} has been published. Redirecting to Browse Products...`);
                    
                    // --- THE NEW REDIRECT LINE ---
                    window.location.href = 'product.html'; 
                    
                } catch (error) {
                    console.error("Save failed:", error);
                    alert("Error: Could not save the product. The image might still be too large.");
                }
            };
            
            reader.readAsDataURL(file);
        } else {
            alert("Please select an image.");
        }
    });
});