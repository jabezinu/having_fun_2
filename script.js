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
    const timeSlotsContainer = document.getElementById('time-slots-container'); // Get time slots container
    const selectedTimeSlotInput = document.getElementById('selected-time-slot'); // Hidden input for selected slot
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
        // Generate Time Slot Buttons (e.g., for the next 3 days, 9 AM - 5 PM)
        if (timeSlotsContainer) {
            timeSlotsContainer.innerHTML = ''; // Clear existing slots
            const today = new Date();
            const startHour = 9;
            const endHour = 17; // 5 PM

            for (let dayOffset = 0; dayOffset < 3; dayOffset++) { // Generate slots for next 3 days
                const currentDate = new Date(today);
                currentDate.setDate(today.getDate() + dayOffset);
                const dateString = currentDate.toISOString().split('T')[0];
                const dayLabel = currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                const dayHeader = document.createElement('h4');
                dayHeader.textContent = dayLabel;
                dayHeader.style.gridColumn = '1 / -1'; // Span across all columns
                timeSlotsContainer.appendChild(dayHeader);

                for (let hour = startHour; hour <= endHour; hour++) {
                    const timeString = `${hour.toString().padStart(2, '0')}:00`;
                    const dateTimeString = `${dateString} ${timeString}`;
                    const displayTime = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 || hour === 24 ? 'AM' : 'PM'}`;

                    const button = document.createElement('button');
                    button.type = 'button'; // Prevent form submission
                    button.classList.add('time-slot-btn');
                    button.textContent = displayTime;
                    button.setAttribute('data-timeslot', dateTimeString);

                    button.addEventListener('click', function() {
                        // Remove selected class from all buttons
                        timeSlotsContainer.querySelectorAll('.time-slot-btn').forEach(btn => btn.classList.remove('selected'));
                        // Add selected class to the clicked button
                        this.classList.add('selected');
                        // Update the hidden input value
                        selectedTimeSlotInput.value = this.getAttribute('data-timeslot');
                    });

                    timeSlotsContainer.appendChild(button);
                }
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
            const selectedTimeSlot = selectedTimeSlotInput.value; // Get value from hidden input

            // Basic validation for step 2 (time slot selection)
            if (currentStep === 2 && !selectedTimeSlotInput.value) {
                alert('Please select a time slot.');
                return;
            }

            // Hide form and show confirmation
            modernForm.style.display = 'none';
            bookingConfirmationDiv.style.display = 'block';
            bookingConfirmationDiv.innerHTML = `
                <h3>Thank You, ${name}!</h3>
                <p>Your appointment for <strong>${service}</strong> on <strong>${selectedTimeSlot}</strong> is booked.</p>
                <p>We look forward to seeing you!</p>
            `;

            // In a real app, you'd send data to the server here.
            console.log('Form Submitted:', { name, email: document.getElementById('email').value, phone: document.getElementById('phone').value, service, timeSlot: selectedTimeSlot, message: document.getElementById('message').value });
        });
    }

    // Keep the old booking confirmation logic for potential fallback or other forms
    const oldAppointmentForm = document.getElementById('appointment-form'); // Check if old form still exists elsewhere
    if (oldAppointmentForm) {
        oldAppointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const service = document.getElementById('service').value;
            const selectedTimeSlot = selectedTimeSlotInput.value; // Get value from hidden input
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
