// Sloow Website - JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // ===== Form Handling =====
    const forms = document.querySelectorAll('form[action*="formspree"]');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const button = form.querySelector('button');
            const input = form.querySelector('input[type="email"]');
            const email = input.value;
            const source = form.querySelector('input[name="source"]')?.value || 'website';

            button.disabled = true;
            button.textContent = 'Envoi...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email, source })
                });

                if (response.ok) {
                    form.innerHTML = '<p class="form-success">C\'est noté ! On te contacte très vite pour ton bilan.</p>';
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                button.textContent = 'Réessayer';
                button.disabled = false;
                console.error('Form error:', error);
            }
        });
    });

    // ===== Audio Player =====
    const playButton = document.getElementById('play-button');
    const audioSample = document.getElementById('audio-sample');
    const audioPlayer = document.getElementById('audio-player');
    const audioLabel = audioPlayer?.querySelector('.audio-label');

    if (playButton && audioSample && audioPlayer) {
        const playIcon = playButton.querySelector('.play-icon');
        const pauseIcon = playButton.querySelector('.pause-icon');

        // Check if audio file exists
        audioSample.addEventListener('canplaythrough', () => {
            audioPlayer.classList.add('has-audio');
            if (audioLabel) audioLabel.textContent = 'Écoute un extrait';
        });

        audioSample.addEventListener('error', () => {
            // No audio file available - keep disabled state
            playButton.disabled = true;
        });

        playButton.addEventListener('click', () => {
            if (!audioPlayer.classList.contains('has-audio')) return;

            if (audioSample.paused) {
                audioSample.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                audioPlayer.classList.add('playing');
            } else {
                audioSample.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                audioPlayer.classList.remove('playing');
            }
        });

        audioSample.addEventListener('ended', () => {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            audioPlayer.classList.remove('playing');
        });
    }

    // ===== Mobile Sticky CTA =====
    const mobileCta = document.getElementById('mobile-cta');
    const bilanSection = document.getElementById('bilan');

    if (mobileCta && bilanSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mobileCta.classList.add('hidden');
                } else {
                    mobileCta.classList.remove('hidden');
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(bilanSection);
    }

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== Nav Background on Scroll =====
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Enhance nav background on scroll
        if (currentScroll > 50) {
            nav.style.background = 'rgba(232, 239, 233, 0.98)';
        } else {
            nav.style.background = 'rgba(232, 239, 233, 0.95)';
        }

        lastScroll = currentScroll;
    });
});
