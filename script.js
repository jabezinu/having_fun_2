document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Testimonial slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    
    if (dots.length > 0) {
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                
                // Remove active class from all testimonials and dots
                testimonials.forEach(testimonial => testimonial.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                // Add active class to selected testimonial and dot
                testimonials[index].classList.add('active');
                this.classList.add('active');
            });
        });
    }
    
    // Booking form handling
    const appointmentForm = document.getElementById('appointment-form');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const message = document.getElementById('message').value;
            
            // In a real application, you would send this data to a server
            // For now, we'll just show a confirmation message
            
            // Create booking confirmation
            showBookingConfirmation(name, service, date, time);
            
            // Reset form
            appointmentForm.reset();
        });
    }
    
    // Function to show booking confirmation
    function showBookingConfirmation(name, service, date, time) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        // Format date for display
        const formattedDate = new Date(date);
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const displayDate = formattedDate.toLocaleDateString('en-US', dateOptions);
        
        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'booking-confirmation';
        modal.innerHTML = `
            <div class="confirmation-header">
                <h2>Booking Confirmed!</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="confirmation-content">
                <p>Thank you, <strong>${name}</strong>!</p>
                <p>Your appointment for <strong>${service}</strong> has been scheduled for:</p>
                <p class="booking-time"><strong>${displayDate} at ${time}</strong></p>
                <p>We've sent a confirmation email with these details.</p>
                <p>Looking forward to seeing you!</p>
            </div>
            <button class="btn confirm-btn">OK</button>
        `;
        
        // Add modal to page
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Add event listeners to close modal
        const closeBtn = modal.querySelector('.close-modal');
        const confirmBtn = modal.querySelector('.confirm-btn');
        
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        confirmBtn.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
    }
});
