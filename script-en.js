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
                progressText.textContent = 'Final step';
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
                submitBtn.textContent = 'Calculating...';

                // Calculate score
                let score = 0;
                for (let i = 1; i <= 7; i++) {
                    score += answers[i] || 0;
                }

                // Determine level and description (English)
                let level, levelClass, description;
                if (score <= 4) {
                    level = 'Minimal anxiety';
                    levelClass = 'minimal';
                    description = 'Your score indicates minimal anxiety. That\'s good news! That said, taking care of your nervous system is still important to maintain this balance.';
                } else if (score <= 9) {
                    level = 'Mild anxiety';
                    levelClass = 'light';
                    description = 'Your score indicates mild anxiety. You probably feel stressed from time to time, but it remains manageable. Regulation tools can help prevent it from building up.';
                } else if (score <= 14) {
                    level = 'Moderate anxiety';
                    levelClass = 'moderate';
                    description = 'Your score indicates moderate anxiety. Stress is starting to impact your daily life. This is a good time to act and give your nervous system the tools to regulate.';
                } else {
                    level = 'Severe anxiety';
                    levelClass = 'severe';
                    description = 'Your score indicates severe anxiety. Your nervous system is overheating. It\'s important to act now. Retuned can help, but we also recommend consulting a healthcare professional.';
                }

                // Send to Formspree
                try {
                    await fetch('https://formspree.io/f/mgolowov', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            source: 'quiz-gad7-en',
                            score: score,
                            level: level,
                            answers: Object.values(answers).join(','),
                            q1: answers[1] || 0,
                            q2: answers[2] || 0,
                            q3: answers[3] || 0,
                            q4: answers[4] || 0,
                            q5: answers[5] || 0,
                            q6: answers[6] || 0,
                            q7: answers[7] || 0
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
                    await fetch('https://formspree.io/f/mgolowov', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            source: 'inline-signup-en',
                            position: position
                        })
                    });
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
    const startBreathingBtn = document.getElementById('start-breathing');
    const stopBreathingBtn = document.getElementById('stop-breathing');
    const pauseBreathingBtn = document.getElementById('pause-breathing');
    const restartBreathingBtn = document.getElementById('restart-breathing');
    const backToIntroBtn = document.getElementById('back-to-intro');
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingInstruction = document.getElementById('breathing-instruction');
    const breathingTimer = document.getElementById('breathing-timer');
    const breathingCount = document.getElementById('breathing-count');
    const completedBreaths = document.getElementById('completed-breaths');

    if (breathingIntro && breathingApp) {
        // Breathing parameters (cardiac coherence: 6 breaths/min = 10s cycle)
        const INHALE_DURATION = 5000; // 5 seconds
        const EXHALE_DURATION = 5000; // 5 seconds
        const SESSION_DURATION = 5 * 60; // 5 minutes in seconds
        const TOTAL_BREATHS = 30; // 6 breaths/min × 5 min

        let isRunning = false;
        let isPaused = false;
        let currentPhase = 'idle'; // 'idle', 'inhale', 'exhale'
        let timeRemaining = SESSION_DURATION;
        let breathCount = 0;
        let breathTimer = null;
        let countdownTimer = null;
        let phaseTimer = null;

        // Audio context for ambient sound
        let audioContext = null;
        let ambientOscillator = null;
        let ambientOscillator2 = null;
        let ambientOscillator3 = null;
        let ambientGain = null;
        let isAudioInitialized = false;

        // Initialize Web Audio for lounge ambient + breath sounds
        function initAudio() {
            if (isAudioInitialized) return;

            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();

                // === LOUNGE PAD (higher, softer frequencies) ===
                const osc1 = audioContext.createOscillator();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(220, audioContext.currentTime); // A3

                const osc2 = audioContext.createOscillator();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(277, audioContext.currentTime); // C#4

                const osc3 = audioContext.createOscillator();
                osc3.type = 'sine';
                osc3.frequency.setValueAtTime(330, audioContext.currentTime); // E4

                // Individual gains for each oscillator
                const gain1 = audioContext.createGain();
                gain1.gain.setValueAtTime(0, audioContext.currentTime);

                const gain2 = audioContext.createGain();
                gain2.gain.setValueAtTime(0, audioContext.currentTime);

                const gain3 = audioContext.createGain();
                gain3.gain.setValueAtTime(0, audioContext.currentTime);

                // Low-pass filter to soften the sound (lounge style)
                const padFilter = audioContext.createBiquadFilter();
                padFilter.type = 'lowpass';
                padFilter.frequency.setValueAtTime(600, audioContext.currentTime);
                padFilter.Q.setValueAtTime(1, audioContext.currentTime);

                // Master gain for pad
                const padMaster = audioContext.createGain();
                padMaster.gain.setValueAtTime(0.4, audioContext.currentTime);

                // Connect pad chain
                osc1.connect(gain1);
                osc2.connect(gain2);
                osc3.connect(gain3);
                gain1.connect(padFilter);
                gain2.connect(padFilter);
                gain3.connect(padFilter);
                padFilter.connect(padMaster);
                padMaster.connect(audioContext.destination);

                osc1.start();
                osc2.start();
                osc3.start();

                // === BREATH NOISE BUFFER (for whoosh sounds) ===
                const bufferSize = audioContext.sampleRate * 6; // 6 seconds buffer
                const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
                const noiseData = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    noiseData[i] = Math.random() * 2 - 1;
                }

                // Store everything for phase modulation
                window.breathingAudio = {
                    audioContext,
                    padGains: { gain1, gain2, gain3 },
                    noiseBuffer,
                    activeBreathSound: null
                };

                isAudioInitialized = true;
            } catch (e) {
                console.log('Audio not available:', e);
            }
        }

        // Play breath whoosh sound
        function playBreathSound(type) {
            if (!isAudioInitialized || !window.breathingAudio) return;

            const { audioContext, noiseBuffer } = window.breathingAudio;

            // Stop previous breath sound if any
            if (window.breathingAudio.activeBreathSound) {
                try {
                    window.breathingAudio.activeBreathSound.stop();
                } catch (e) {}
            }

            // Create noise source
            const noise = audioContext.createBufferSource();
            noise.buffer = noiseBuffer;

            // Bandpass filter for breath-like sound
            const breathFilter = audioContext.createBiquadFilter();
            breathFilter.type = 'bandpass';
            breathFilter.frequency.setValueAtTime(800, audioContext.currentTime);
            breathFilter.Q.setValueAtTime(0.8, audioContext.currentTime);

            // Gain envelope for whoosh effect
            const breathGain = audioContext.createGain();
            const now = audioContext.currentTime;
            const duration = 5; // 5 seconds

            if (type === 'inhale') {
                // Inhale: volume rises then plateaus
                breathGain.gain.setValueAtTime(0.02, now);
                breathGain.gain.linearRampToValueAtTime(0.15, now + duration * 0.6);
                breathGain.gain.linearRampToValueAtTime(0.08, now + duration);
            } else {
                // Exhale: volume starts higher then fades
                breathGain.gain.setValueAtTime(0.12, now);
                breathGain.gain.linearRampToValueAtTime(0.06, now + duration * 0.5);
                breathGain.gain.linearRampToValueAtTime(0.01, now + duration);
            }

            // Connect breath chain
            noise.connect(breathFilter);
            breathFilter.connect(breathGain);
            breathGain.connect(audioContext.destination);

            noise.start();
            noise.stop(now + duration);

            window.breathingAudio.activeBreathSound = noise;
        }

        // Update pad audio based on phase
        function updateAudioForPhase(phase) {
            if (!isAudioInitialized || !window.breathingAudio) return;

            const { audioContext, padGains } = window.breathingAudio;
            const { gain1, gain2, gain3 } = padGains;
            const now = audioContext.currentTime;
            const duration = 5; // 5 seconds

            // Play breath whoosh
            playBreathSound(phase);

            if (phase === 'inhale') {
                // Pad swells up on inhale
                gain1.gain.linearRampToValueAtTime(0.35, now + duration);
                gain2.gain.linearRampToValueAtTime(0.25, now + duration);
                gain3.gain.linearRampToValueAtTime(0.2, now + duration);
            } else {
                // Pad fades down on exhale
                gain1.gain.linearRampToValueAtTime(0.15, now + duration);
                gain2.gain.linearRampToValueAtTime(0.1, now + duration);
                gain3.gain.linearRampToValueAtTime(0.08, now + duration);
            }
        }

        // Format time as MM:SS
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Update display
        function updateDisplay() {
            breathingTimer.textContent = formatTime(timeRemaining);
            breathingCount.textContent = `Breath ${breathCount}/${TOTAL_BREATHS}`;
        }

        // Run one breath cycle
        function runBreathCycle() {
            if (!isRunning || isPaused) return;

            // Inhale phase
            currentPhase = 'inhale';
            breathingCircle.classList.remove('exhale');
            breathingCircle.classList.add('inhale');
            breathingInstruction.textContent = 'Breathe in through your nose...';
            updateAudioForPhase('inhale');

            phaseTimer = setTimeout(() => {
                if (!isRunning || isPaused) return;

                // Exhale phase
                currentPhase = 'exhale';
                breathingCircle.classList.remove('inhale');
                breathingCircle.classList.add('exhale');
                breathingInstruction.textContent = 'Breathe out gently...';
                updateAudioForPhase('exhale');

                phaseTimer = setTimeout(() => {
                    if (!isRunning || isPaused) return;

                    breathCount++;
                    updateDisplay();

                    // Check if session complete
                    if (breathCount >= TOTAL_BREATHS || timeRemaining <= 0) {
                        completeSession();
                    } else {
                        runBreathCycle();
                    }
                }, EXHALE_DURATION);
            }, INHALE_DURATION);
        }

        // Start session
        function startSession() {
            initAudio();

            isRunning = true;
            isPaused = false;
            timeRemaining = SESSION_DURATION;
            breathCount = 0;

            breathingIntro.style.display = 'none';
            breathingApp.style.display = 'block';
            breathingComplete.style.display = 'none';

            pauseBreathingBtn.textContent = 'Pause';

            updateDisplay();

            // Start countdown timer
            countdownTimer = setInterval(() => {
                if (!isPaused) {
                    timeRemaining--;
                    updateDisplay();

                    if (timeRemaining <= 0) {
                        completeSession();
                    }
                }
            }, 1000);

            // Start breathing cycles
            breathingInstruction.textContent = 'Get ready...';
            setTimeout(() => {
                runBreathCycle();
            }, 1500);
        }

        // Pause/resume session
        function togglePause() {
            if (isPaused) {
                // Resume
                isPaused = false;
                pauseBreathingBtn.textContent = 'Pause';
                breathingInstruction.textContent = 'Resuming...';
                setTimeout(() => {
                    runBreathCycle();
                }, 1000);
            } else {
                // Pause
                isPaused = true;
                pauseBreathingBtn.textContent = 'Continue';
                breathingInstruction.textContent = 'Paused...';
                breathingCircle.classList.remove('inhale', 'exhale');
                clearTimeout(phaseTimer);

                // Fade out audio
                if (window.breathingAudio) {
                    const { audioContext, padGains } = window.breathingAudio;
                    const now = audioContext.currentTime;
                    padGains.gain1.gain.linearRampToValueAtTime(0, now + 0.5);
                    padGains.gain2.gain.linearRampToValueAtTime(0, now + 0.5);
                    padGains.gain3.gain.linearRampToValueAtTime(0, now + 0.5);
                }
            }
        }

        // Stop session
        function stopSession() {
            isRunning = false;
            isPaused = false;
            currentPhase = 'idle';

            clearTimeout(phaseTimer);
            clearInterval(countdownTimer);

            breathingCircle.classList.remove('inhale', 'exhale');

            // Fade out audio
            if (window.breathingAudio) {
                const { audioContext, padGains } = window.breathingAudio;
                const now = audioContext.currentTime;
                padGains.gain1.gain.linearRampToValueAtTime(0, now + 0.5);
                padGains.gain2.gain.linearRampToValueAtTime(0, now + 0.5);
                padGains.gain3.gain.linearRampToValueAtTime(0, now + 0.5);
                if (window.breathingAudio.activeBreathSound) {
                    try { window.breathingAudio.activeBreathSound.stop(); } catch (e) {}
                }
            }

            breathingApp.style.display = 'none';
            breathingIntro.style.display = 'block';
        }

        // Complete session
        function completeSession() {
            isRunning = false;
            clearTimeout(phaseTimer);
            clearInterval(countdownTimer);

            breathingCircle.classList.remove('inhale', 'exhale');

            // Fade out audio
            if (window.breathingAudio) {
                const { audioContext, padGains } = window.breathingAudio;
                const now = audioContext.currentTime;
                padGains.gain1.gain.linearRampToValueAtTime(0, now + 1);
                padGains.gain2.gain.linearRampToValueAtTime(0, now + 1);
                padGains.gain3.gain.linearRampToValueAtTime(0, now + 1);
                if (window.breathingAudio.activeBreathSound) {
                    try { window.breathingAudio.activeBreathSound.stop(); } catch (e) {}
                }
            }

            // Show completion screen
            completedBreaths.textContent = breathCount;
            breathingApp.style.display = 'none';
            breathingComplete.style.display = 'block';
        }

        // Event listeners
        startBreathingBtn.addEventListener('click', startSession);
        stopBreathingBtn.addEventListener('click', stopSession);
        pauseBreathingBtn.addEventListener('click', togglePause);
        restartBreathingBtn.addEventListener('click', startSession);
        backToIntroBtn.addEventListener('click', () => {
            breathingComplete.style.display = 'none';
            breathingIntro.style.display = 'block';
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only if breathing section is visible
            const breathingSection = document.getElementById('breathe');
            if (!breathingSection) return;

            const rect = breathingSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (!isVisible) return;

            if (e.code === 'Space' && isRunning) {
                e.preventDefault();
                togglePause();
            } else if (e.code === 'Escape' && isRunning) {
                e.preventDefault();
                stopSession();
            }
        });
    }
});
