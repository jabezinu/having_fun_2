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
    
    // Modern Multi-step Booking Form Handling
    const modernForm = document.getElementById('modern-appointment-form');
    const formSteps = modernForm ? modernForm.querySelectorAll('.form-step') : [];
    const nextButtons = modernForm ? modernForm.querySelectorAll('.next-step') : [];
    const prevButtons = modernForm ? modernForm.querySelectorAll('.prev-step') : [];
    const serviceOptions = modernForm ? modernForm.querySelectorAll('.service-option') : [];
    const selectedServiceInput = document.getElementById('selected-service');
    const bookingConfirmationDiv = document.getElementById('booking-confirmation');
    const dateInput = document.getElementById('date'); // Get date input
    const timeSelect = document.getElementById('time'); // Get time select
    let currentStep = 1;

    function showStep(stepNumber) {
        formSteps.forEach(step => step.classList.remove('active'));
        const nextStep = modernForm.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (nextStep) {
            nextStep.classList.add('active');
        }
        currentStep = stepNumber;
    }

    if (modernForm) {
        // Set Date Input Restrictions (3 weeks from today)
        if (dateInput) {
            const today = new Date();
            const minDate = today.toISOString().split('T')[0];
            today.setDate(today.getDate() + 21); // Add 3 weeks (21 days)
            const maxDate = today.toISOString().split('T')[0];
            dateInput.setAttribute('min', minDate);
            dateInput.setAttribute('max', maxDate);
        }

        // Populate Time Slots (1-hour increments, e.g., 9 AM - 5 PM)
        if (timeSelect) {
            timeSelect.innerHTML = '<option value="" disabled selected>Select a time</option>'; // Clear existing options first
            const startHour = 9;
            const endHour = 17; // 5 PM
            for (let hour = startHour; hour <= endHour; hour++) {
                const timeString = `${hour.toString().padStart(2, '0')}:00`;
                const option = document.createElement('option');
                option.value = timeString;
                option.textContent = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 || hour === 24 ? 'AM' : 'PM'}`;
                timeSelect.appendChild(option);
            }
        }

        // Service Selection Logic
        serviceOptions.forEach(option => {
            option.addEventListener('click', function() {
                serviceOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectedServiceInput.value = this.getAttribute('data-service');
            });
        });

        // Next Button Logic
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Basic validation for step 1 (service selection)
                if (currentStep === 1 && !selectedServiceInput.value) {
                    alert('Please select a service.');
                    return;
                }
                // Add more validation for other steps if needed
                if (currentStep < formSteps.length) {
                    showStep(currentStep + 1);
                }
            });
        });

        // Previous Button Logic
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep > 1) {
                    showStep(currentStep - 1);
                }
            });
        });

        // Form Submission
        modernForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add validation for the last step if needed
            const name = document.getElementById('name').value;
            const service = selectedServiceInput.value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;

            // Basic validation for step 2 (date/time)
            if (currentStep === 2) {
                if (!dateInput.value) {
                    alert('Please select a date.');
                    return;
                }
                if (!timeSelect.value) {
                    alert('Please select a time.');
                    return;
                }
            }

            // Hide form and show confirmation
            modernForm.style.display = 'none';
            bookingConfirmationDiv.style.display = 'block';
            bookingConfirmationDiv.innerHTML = `
                <h3>Thank You, ${name}!</h3>
                <p>Your appointment for <strong>${service}</strong> on <strong>${date} at ${time}</strong> is booked.</p>
                <p>We look forward to seeing you!</p>
            `;

            // In a real app, you'd send data to the server here.
            console.log('Form Submitted:', { name, email: document.getElementById('email').value, phone: document.getElementById('phone').value, service, date, time, message: document.getElementById('message').value });
        });
    }

    // Keep the old booking confirmation logic for potential fallback or other forms
    const oldAppointmentForm = document.getElementById('appointment-form'); // Check if old form still exists elsewhere
    if (oldAppointmentForm) {
        oldAppointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            showBookingConfirmation(name, service, date, time); // Use the existing modal function
            oldAppointmentForm.reset();
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
