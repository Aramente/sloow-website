// Retuned Website - JavaScript

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

    // ===== GAD-7 Step-by-Step Quiz =====
    const quizContainer = document.getElementById('quiz-container');

    if (quizContainer) {
        const slides = quizContainer.querySelectorAll('.quiz-slide');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const startBtn = document.getElementById('quiz-start');
        const submitBtn = document.getElementById('quiz-submit');
        const emailInput = document.getElementById('quiz-email');

        const answers = {};
        const slideOrder = ['intro', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'email', 'results'];
        let currentSlideIndex = 0;

        // Show a specific slide
        function showSlide(slideId) {
            slides.forEach(slide => {
                slide.classList.remove('active');
                if (slide.dataset.slide === slideId) {
                    slide.classList.add('active');
                }
            });

            // Update progress bar (only for questions 1-7)
            const questionNum = parseInt(slideId.replace('q', ''));
            if (questionNum >= 1 && questionNum <= 7) {
                const progress = (questionNum / 7) * 100;
                progressFill.style.width = progress + '%';
                progressText.textContent = `Question ${questionNum}/7`;
                quizContainer.querySelector('.quiz-progress').style.display = 'block';
            } else if (slideId === 'email') {
                progressFill.style.width = '100%';
                progressText.textContent = 'Dernière étape';
                quizContainer.querySelector('.quiz-progress').style.display = 'block';
            } else {
                quizContainer.querySelector('.quiz-progress').style.display = 'none';
            }
        }

        // Navigate to next slide
        function nextSlide() {
            currentSlideIndex++;
            if (currentSlideIndex < slideOrder.length) {
                showSlide(slideOrder[currentSlideIndex]);
            }
        }

        // Start button
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                currentSlideIndex = 0;
                nextSlide();
            });
        }

        // Option buttons
        quizContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                const value = parseInt(btn.dataset.value);

                // Store answer
                answers[question] = value;

                // Visual feedback
                const siblings = btn.parentElement.querySelectorAll('.option-btn');
                siblings.forEach(sib => sib.classList.remove('selected'));
                btn.classList.add('selected');

                // Small delay then advance
                setTimeout(() => {
                    nextSlide();
                }, 200);
            });
        });

        // Submit button (email slide)
        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {
                const email = emailInput.value.trim();

                if (!email || !email.includes('@')) {
                    emailInput.style.borderColor = '#e74c3c';
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.textContent = 'Calcul en cours...';

                // Calculate score
                let score = 0;
                for (let i = 1; i <= 7; i++) {
                    score += answers[i] || 0;
                }

                // Determine level and description
                let level, levelClass, description;
                if (score <= 4) {
                    level = 'Anxiété minimale';
                    levelClass = 'minimal';
                    description = 'Ton score indique un niveau d\'anxiété minimal. C\'est une bonne nouvelle ! Cela dit, prendre soin de ton système nerveux reste important pour maintenir cet équilibre.';
                } else if (score <= 9) {
                    level = 'Anxiété légère';
                    levelClass = 'light';
                    description = 'Ton score indique une anxiété légère. Tu ressens probablement du stress de temps en temps, mais il reste gérable. Des outils de régulation peuvent t\'aider à éviter que ça s\'accumule.';
                } else if (score <= 14) {
                    level = 'Anxiété modérée';
                    levelClass = 'moderate';
                    description = 'Ton score indique une anxiété modérée. Le stress commence à impacter ton quotidien. C\'est le bon moment pour agir et donner à ton système nerveux les outils pour se réguler.';
                } else {
                    level = 'Anxiété sévère';
                    levelClass = 'severe';
                    description = 'Ton score indique une anxiété sévère. Ton système nerveux est en surchauffe. Il est important d\'agir maintenant. Retuned peut t\'aider, mais nous te recommandons aussi de consulter un professionnel de santé.';
                }

                // Send to Sloow API
                try {
                    await fetch('https://sloow-api.vercel.app/api/subscribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            source: 'quiz',
                            lang: 'fr'
                        })
                    });
                } catch (error) {
                    console.error('Form submission error:', error);
                }

                // Show results
                document.getElementById('score-number').textContent = score;
                document.getElementById('result-level').textContent = level;
                document.getElementById('result-level').className = 'result-level ' + levelClass;
                document.getElementById('result-description').textContent = description;

                // Show crisis banner for severe anxiety (score >= 15)
                const crisisBanner = document.getElementById('crisis-banner');
                if (crisisBanner) {
                    crisisBanner.style.display = score >= 15 ? 'block' : 'none';
                }

                // Go to results slide
                nextSlide();

                // Setup beta request button
                const betaBtn = document.getElementById('request-beta-btn');
                const betaConfirmation = document.getElementById('beta-confirmation');
                if (betaBtn) {
                    betaBtn.addEventListener('click', () => {
                        betaBtn.style.display = 'none';
                        betaConfirmation.style.display = 'block';
                    });
                }
            });
        }
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
            threshold: 0.1
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
    // Position is now calculated from Firebase count
    function getWaitlistPosition() {
        // Get current count from displayed spots
        const spotsEl = document.getElementById('spots-left');
        const spotsLeft = spotsEl ? parseInt(spotsEl.textContent) || 28 : 28;
        const currentCount = 100 - spotsLeft;
        // Your position is the next number
        return currentCount + 1;
    }

    function incrementWaitlistCount() {
        // Increment via Firebase (defined in index.html)
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
                            source: 'inline-signup',
                            lang: 'fr'
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
            breathCount.textContent = `Respiration ${breathNumber}/${totalBreaths}`;
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

        // Placeholder for compatibility
        function playBreathSound(type) {
            // Wave sounds are now continuous, modulated by updateAudioForPhase
        }

        // Run one breath cycle
        function runBreathCycle() {
            if (!isRunning || isPaused) return;

            // Inhale phase
            currentPhase = 'inhale';
            breathNumber++;
            breathingCircle.classList.remove('exhale');
            breathingCircle.classList.add('inhale');
            breathingInstruction.textContent = 'Inspire par le nez...';
            updateDisplay();
            updateAudioForPhase('inhale');

            // After inhale duration, switch to exhale
            phaseTimer = setTimeout(() => {
                if (!isRunning || isPaused) return;

                currentPhase = 'exhale';
                breathingCircle.classList.remove('inhale');
                breathingCircle.classList.add('exhale');
                breathingInstruction.textContent = 'Expire doucement...';
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
            document.title = '🌬 Respire — Retuned';
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
                breathingInstruction.textContent = 'En pause';
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
            document.title = 'Retuned — Ton système nerveux a besoin de souffler';
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
            const breathingSection = document.getElementById('exercice');
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

    // ===== Breathing section signup =====
    const breathingSignup = document.getElementById('breathing-signup');
    if (breathingSignup) {
        const form = breathingSignup.querySelector('.inline-signup-form');
        const emailInput = breathingSignup.querySelector('.inline-email');
        const submitBtn = breathingSignup.querySelector('.inline-submit');
        const success = breathingSignup.querySelector('.inline-success');

        if (form && submitBtn) {
            submitBtn.addEventListener('click', async () => {
                const email = emailInput.value.trim();
                if (!email || !email.includes('@')) {
                    emailInput.style.borderColor = '#e74c3c';
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.textContent = '...';

                try {
                    await fetch('https://sloow-api.vercel.app/api/subscribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            source: 'breathing-beta',
                            lang: 'fr'
                        })
                    });
                } catch (error) {
                    console.error('Signup error:', error);
                }

                form.style.display = 'none';
                success.style.display = 'inline';
            });

            emailInput?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                }
            });
        }
    }
});
