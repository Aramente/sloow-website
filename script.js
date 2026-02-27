// Sloow Landing Page - JavaScript
// Minimal: form handling, scroll animations

document.addEventListener('DOMContentLoaded', () => {

    // ===== Email Form Handling =====
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mgolowov';

    document.querySelectorAll('.email-form').forEach(form => {
        const input = form.querySelector('.email-input');
        const button = form.querySelector('.btn');
        const caption = form.nextElementSibling;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = input.value.trim();

            // Validate email
            if (!isValidEmail(email)) {
                input.classList.add('error');
                setTimeout(() => input.classList.remove('error'), 500);
                return;
            }

            // Disable button during submission
            button.disabled = true;
            button.textContent = '...';

            try {
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        source: form.dataset.formId || 'landing'
                    })
                });

                if (response.ok) {
                    // Replace form with success message
                    form.innerHTML = `
                        <div class="form-success">
                            <span class="checkmark">✓</span>
                            <span>You're in. We'll be in touch.</span>
                        </div>
                    `;
                    if (caption) {
                        caption.style.display = 'none';
                    }
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                button.disabled = false;
                button.textContent = 'Try again';
                input.classList.add('error');
                console.error('Form submission error:', error);
            }
        });

        // Clear error state on input
        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ===== Scroll Animations (Intersection Observer) =====
    const fadeElements = document.querySelectorAll('.fade-in');
    const staggerElements = document.querySelectorAll('.stagger-children');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => fadeObserver.observe(el));
        staggerElements.forEach(el => fadeObserver.observe(el));
    } else {
        // Fallback: show all elements immediately
        fadeElements.forEach(el => el.classList.add('visible'));
        staggerElements.forEach(el => el.classList.add('visible'));
    }

    // ===== Reduced Motion Support =====
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.fade-in, .stagger-children').forEach(el => {
            el.style.transition = 'none';
            el.classList.add('visible');
        });
    }

});
