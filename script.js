// Sloow Website - JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // ===== Form Handling =====
    const forms = document.querySelectorAll('.waitlist-form');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const button = form.querySelector('button');
            const input = form.querySelector('input');
            const email = input.value;

            button.disabled = true;
            button.textContent = 'Envoi...';

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
                    form.innerHTML = '<p class="form-success">Tu es sur la liste ! On te contacte bientôt.</p>';
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
            if (audioLabel) audioLabel.textContent = 'Essaie 30 secondes';
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

    // ===== Expandable Science Sections =====
    const expandButtons = document.querySelectorAll('.expand-button');

    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const content = document.getElementById(targetId);

            if (content) {
                const isExpanded = content.classList.contains('expanded');

                if (isExpanded) {
                    content.classList.remove('expanded');
                    button.classList.remove('expanded');
                } else {
                    content.classList.add('expanded');
                    button.classList.add('expanded');
                }
            }
        });
    });

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

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.style.background = 'rgba(232, 239, 233, 0.98)';
        } else {
            nav.style.background = 'rgba(232, 239, 233, 0.9)';
        }
    });
});
