// Retuned Website - JavaScript (English version)

document.addEventListener('DOMContentLoaded', () => {

    // ===== Cookie Banner =====
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && !localStorage.getItem('cookieAccepted')) {
        cookieBanner.classList.add('visible');
        document.body.classList.add('cookie-visible');
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('visible');
            document.body.classList.remove('cookie-visible');
        });
    }

    // ===== Mobile Sticky CTA =====
    const mobileCta = document.getElementById('mobile-cta');
    const assessmentSection = document.getElementById('assessment');

    if (mobileCta && assessmentSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mobileCta.classList.add('hidden');
                } else {
                    mobileCta.classList.remove('hidden');
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(assessmentSection);
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

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.style.background = 'rgba(240, 247, 244, 0.98)';
        } else {
            nav.style.background = 'rgba(240, 247, 244, 0.95)';
        }
    });

    // ===== Scroll Animations =====
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-children');

    if (animatedElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => animationObserver.observe(el));
    }

    // ===== Waitlist Position =====
    function getWaitlistPosition() {
        const spotsEl = document.getElementById('spots-left');
        const spotsLeft = spotsEl ? parseInt(spotsEl.textContent) || 28 : 28;
        const currentCount = 100 - spotsLeft;
        return currentCount + 1;
    }

    function incrementWaitlistCount() {
        if (window.incrementSignupCount) {
            window.incrementSignupCount();
        }
    }

    // ===== Inline Signup Forms =====
    document.querySelectorAll('.inline-signup').forEach(container => {
        const btn = container.querySelector('.inline-signup-btn');
        const form = container.querySelector('.inline-signup-form');
        const emailInput = container.querySelector('.inline-email');
        const submitBtn = container.querySelector('.inline-submit');
        const success = container.querySelector('.inline-success');
        const positionEl = container.querySelector('.waitlist-position');

        if (btn && form) {
            btn.addEventListener('click', () => {
                btn.style.display = 'none';
                form.style.display = 'flex';
                emailInput.focus();
            });

            submitBtn.addEventListener('click', async () => {
                const email = emailInput.value.trim();
                if (!email || !email.includes('@')) {
                    emailInput.style.borderColor = '#e74c3c';
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.textContent = '...';

                // Get position before submitting
                const position = getWaitlistPosition();
                incrementWaitlistCount();

                try {
                    const response = await fetch('https://sloow-api.vercel.app/api/subscribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            source: 'inline-signup-en',
                            lang: 'en'
                        })
                    });
                    const data = await response.json();
                    if (data.position) {
                        position = data.position;
                    }
                } catch (error) {
                    console.error('Signup error:', error);
                }

                // Update position display
                if (positionEl) {
                    positionEl.textContent = '#' + position;
                }

                form.style.display = 'none';
                success.style.display = 'inline';
            });

            emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                }
            });
        }
    });

    // ===== Breathing Exercise =====
    const breathingIntro = document.getElementById('breathing-intro');
    const breathingApp = document.getElementById('breathing-app');
    const breathingComplete = document.getElementById('breathing-complete');
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingInstruction = document.getElementById('breathing-instruction');
    const breathingTime = document.getElementById('breathing-time');
    const breathCount = document.getElementById('breath-count');

    if (breathingIntro && breathingApp) {
        // State
        let isRunning = false;
        let isPaused = false;
        let currentPhase = 'inhale'; // 'inhale' or 'exhale'
        let sessionDuration = 300; // 5 minutes in seconds (default)
        let timeRemaining = sessionDuration;
        let breathNumber = 0;
        let totalBreaths = 30; // 6 breaths/min * 5 min (default)
        let phaseTimer = null;
        let countdownTimer = null;
        let isAudioEnabled = true;

        const INHALE_DURATION = 5000; // 5 seconds
        const EXHALE_DURATION = 5000; // 5 seconds

        // Get duration from selector
        function getSelectedDuration() {
            const selector = document.getElementById('session-duration');
            return selector ? parseInt(selector.value) : 5;
        }

        // Format time as M:SS
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Update display
        function updateDisplay() {
            breathingTime.textContent = formatTime(timeRemaining);
            breathCount.textContent = `Breath ${breathNumber}/${totalBreaths}`;
        }

        // Audio element for ambient music
        let ambientAudio = null;
        let audioReady = false;

        // Initialize audio - use MP3 file
        function initAudio() {
            if (ambientAudio) return;

            ambientAudio = new Audio('/assets/ambient-meditation.mp3');
            ambientAudio.loop = true;
            ambientAudio.volume = 0.5;

            ambientAudio.addEventListener('canplaythrough', () => {
                audioReady = true;
                console.log('Audio ready to play');
            });

            ambientAudio.addEventListener('error', (e) => {
                console.error('Audio loading error:', e);
            });

            // Preload
            ambientAudio.load();
        }

        // Start audio playback
        function startAudio() {
            if (!isAudioEnabled || !ambientAudio) return;

            const playPromise = ambientAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log('Audio play error:', e);
                });
            }
        }

        // Update audio based on phase - gentle volume swell
        function updateAudioForPhase(phase) {
            if (!isAudioEnabled || !ambientAudio) return;
            // Subtle volume modulation with breathing
            const targetVolume = phase === 'inhale' ? 0.6 : 0.4;
            // Smooth transition
            const currentVolume = ambientAudio.volume;
            const steps = 50;
            const stepSize = (targetVolume - currentVolume) / steps;
            let step = 0;
            const interval = setInterval(() => {
                step++;
                ambientAudio.volume = Math.max(0, Math.min(1, currentVolume + stepSize * step));
                if (step >= steps) clearInterval(interval);
            }, 100);
        }

        // Stop audio
        function stopAudio() {
            if (ambientAudio) {
                ambientAudio.pause();
                ambientAudio.currentTime = 0;
            }
        }

        // Pause audio
        function pauseAudio() {
            if (ambientAudio) {
                ambientAudio.pause();
            }
        }

        // Resume audio
        function resumeAudio() {
            if (ambientAudio && isAudioEnabled) {
                ambientAudio.play().catch(e => console.log('Audio resume blocked'));
            }
        }

        // Run one breath cycle
        function runBreathCycle() {
            if (!isRunning || isPaused) return;

            // Inhale phase
            currentPhase = 'inhale';
            breathNumber++;
            breathingCircle.classList.remove('exhale');
            breathingCircle.classList.add('inhale');
            breathingInstruction.textContent = 'Breathe in through your nose...';
            updateDisplay();
            updateAudioForPhase('inhale');

            // After inhale duration, switch to exhale
            phaseTimer = setTimeout(() => {
                if (!isRunning || isPaused) return;

                currentPhase = 'exhale';
                breathingCircle.classList.remove('inhale');
                breathingCircle.classList.add('exhale');
                breathingInstruction.textContent = 'Breathe out gently...';
                updateAudioForPhase('exhale');

                // After exhale duration, start next cycle or end
                phaseTimer = setTimeout(() => {
                    if (timeRemaining > 0 && isRunning && !isPaused) {
                        runBreathCycle();
                    }
                }, EXHALE_DURATION);

            }, INHALE_DURATION);
        }

        // Start countdown timer
        function startCountdown() {
            countdownTimer = setInterval(() => {
                if (!isPaused && timeRemaining > 0) {
                    timeRemaining--;
                    updateDisplay();

                    if (timeRemaining <= 0) {
                        endSession();
                    }
                }
            }, 1000);
        }

        // Start session
        function startSession() {
            // Get selected duration
            const minutes = getSelectedDuration();
            sessionDuration = minutes * 60;
            totalBreaths = minutes * 6; // 6 breaths per minute

            isRunning = true;
            isPaused = false;
            timeRemaining = sessionDuration;
            breathNumber = 0;

            breathingIntro.style.display = 'none';
            breathingComplete.style.display = 'none';
            breathingApp.style.display = 'block';

            initAudio();
            if (isAudioEnabled) {
                startAudio();
            }

            updateDisplay();
            startCountdown();
            runBreathCycle();

            // Update page title
            document.title = 'Breathe — Retuned';
        }

        // Pause/Resume session
        function togglePause() {
            isPaused = !isPaused;

            const pauseIcon = document.querySelector('#breathing-pause .pause-icon');
            const playIcon = document.querySelector('#breathing-pause .play-icon');

            if (isPaused) {
                // Clear pending phase timer
                clearTimeout(phaseTimer);
                pauseIcon.style.display = 'none';
                playIcon.style.display = 'inline';
                breathingInstruction.textContent = 'Paused';
                breathingCircle.classList.remove('inhale', 'exhale');
                pauseAudio();
            } else {
                pauseIcon.style.display = 'inline';
                playIcon.style.display = 'none';
                resumeAudio();
                runBreathCycle();
            }
        }

        // End session
        function endSession() {
            isRunning = false;
            clearTimeout(phaseTimer);
            clearInterval(countdownTimer);
            stopAudio();

            breathingApp.style.display = 'none';
            breathingComplete.style.display = 'block';

            // Update completion stats
            document.getElementById('complete-breaths').textContent = breathNumber;
            document.getElementById('complete-duration').textContent = Math.round((sessionDuration - timeRemaining) / 60) || 5;

            // Reset page title
            document.title = 'Retuned — Your nervous system needs a break';
        }

        // Reset to intro
        function resetToIntro() {
            breathingComplete.style.display = 'none';
            breathingIntro.style.display = 'block';
            breathingCircle.classList.remove('inhale', 'exhale');
        }

        // Event listeners
        document.getElementById('breathing-start')?.addEventListener('click', startSession);
        document.getElementById('breathing-pause')?.addEventListener('click', togglePause);
        document.getElementById('breathing-stop')?.addEventListener('click', endSession);
        document.getElementById('breathing-restart')?.addEventListener('click', startSession);

        // Audio toggle
        document.getElementById('audio-toggle')?.addEventListener('change', (e) => {
            isAudioEnabled = e.target.checked;
            if (!isAudioEnabled) {
                pauseAudio();
            } else if (isRunning && !isPaused) {
                resumeAudio();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only if breathing section is visible
            const breathingSection = document.getElementById('exercise');
            const rect = breathingSection?.getBoundingClientRect();
            if (!rect || rect.top > window.innerHeight || rect.bottom < 0) return;

            if (e.code === 'Space' && isRunning) {
                e.preventDefault();
                togglePause();
            }
            if (e.code === 'Escape' && isRunning) {
                endSession();
            }
        });
    }
});
