// Sloow Website - JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Handle form submissions
    const forms = document.querySelectorAll('.waitlist-form');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const button = form.querySelector('button');
            const input = form.querySelector('input');
            const email = input.value;

            // Disable form during submission
            button.disabled = true;
            button.textContent = 'Joining...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                if (response.ok) {
                    // Show success message
                    form.innerHTML = '<p class="form-success">You\'re on the list! We\'ll be in touch soon.</p>';
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Show error and reset form
                button.textContent = 'Try Again';
                button.disabled = false;
                console.error('Form error:', error);
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Add scroll-based nav background
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 10, 15, 0.8)';
        }

        lastScroll = currentScroll;
    });
});
