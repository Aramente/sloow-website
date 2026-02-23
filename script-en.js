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
        let audioContext = null;
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

        // Initialize Web Audio - Ocean waves + ethereal elfic pad
        function initAudio() {
            if (audioContext) return;

            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // === OCEAN WAVES (continuous, soothing) ===
            // Create pink noise buffer (softer than white noise)
            const waveBufferSize = audioContext.sampleRate * 10;
            const waveBuffer = audioContext.createBuffer(1, waveBufferSize, audioContext.sampleRate);
            const waveData = waveBuffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < waveBufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                waveData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
                b6 = white * 0.115926;
            }

            // Ocean wave source (looping)
            const oceanNoise = audioContext.createBufferSource();
            oceanNoise.buffer = waveBuffer;
            oceanNoise.loop = true;

            // Very low-pass filter for deep ocean rumble
            const oceanFilter = audioContext.createBiquadFilter();
            oceanFilter.type = 'lowpass';
            oceanFilter.frequency.setValueAtTime(400, audioContext.currentTime);
            oceanFilter.Q.setValueAtTime(0.5, audioContext.currentTime);

            // Ocean gain (modulated for wave effect)
            const oceanGain = audioContext.createGain();
            oceanGain.gain.setValueAtTime(0.25, audioContext.currentTime);

            oceanNoise.connect(oceanFilter);
            oceanFilter.connect(oceanGain);
            oceanGain.connect(audioContext.destination);
            oceanNoise.start();

            // === ETHEREAL ELFIC PAD (very soft, high, dreamy) ===
            // Use triangle waves for softer sound
            const elfPad1 = audioContext.createOscillator();
            elfPad1.type = 'triangle';
            elfPad1.frequency.setValueAtTime(523, audioContext.currentTime); // C5

            const elfPad2 = audioContext.createOscillator();
            elfPad2.type = 'triangle';
            elfPad2.frequency.setValueAtTime(659, audioContext.currentTime); // E5

            const elfPad3 = audioContext.createOscillator();
            elfPad3.type = 'triangle';
            elfPad3.frequency.setValueAtTime(784, audioContext.currentTime); // G5

            // Individual gains
            const elfGain1 = audioContext.createGain();
            elfGain1.gain.setValueAtTime(0, audioContext.currentTime);

            const elfGain2 = audioContext.createGain();
            elfGain2.gain.setValueAtTime(0, audioContext.currentTime);

            const elfGain3 = audioContext.createGain();
            elfGain3.gain.setValueAtTime(0, audioContext.currentTime);

            // Very soft low-pass for dreamy effect
            const elfFilter = audioContext.createBiquadFilter();
            elfFilter.type = 'lowpass';
            elfFilter.frequency.setValueAtTime(1200, audioContext.currentTime);
            elfFilter.Q.setValueAtTime(0.3, audioContext.currentTime);

            // Connect elf pad
            elfPad1.connect(elfGain1);
            elfPad2.connect(elfGain2);
            elfPad3.connect(elfGain3);
            elfGain1.connect(elfFilter);
            elfGain2.connect(elfFilter);
            elfGain3.connect(elfFilter);
            elfFilter.connect(audioContext.destination);

            elfPad1.start();
            elfPad2.start();
            elfPad3.start();

            // Store for phase modulation
            window.breathingAudio = {
                audioContext,
                oceanGain,
                elfGains: { elfGain1, elfGain2, elfGain3 }
            };
        }

        // Update audio based on phase - gentle wave-like modulation
        function updateAudioForPhase(phase) {
            if (!isAudioEnabled || !window.breathingAudio) return;

            const { audioContext, oceanGain, elfGains } = window.breathingAudio;
            const { elfGain1, elfGain2, elfGain3 } = elfGains;
            const now = audioContext.currentTime;
            const duration = phase === 'inhale' ? INHALE_DURATION / 1000 : EXHALE_DURATION / 1000;

            if (phase === 'inhale') {
                // Inhale: ocean swells, elf pad rises gently
                oceanGain.gain.linearRampToValueAtTime(0.35, now + duration);
                elfGain1.gain.linearRampToValueAtTime(0.08, now + duration);
                elfGain2.gain.linearRampToValueAtTime(0.06, now + duration);
                elfGain3.gain.linearRampToValueAtTime(0.05, now + duration);
            } else {
                // Exhale: ocean recedes, elf pad fades
                oceanGain.gain.linearRampToValueAtTime(0.18, now + duration);
                elfGain1.gain.linearRampToValueAtTime(0.03, now + duration);
                elfGain2.gain.linearRampToValueAtTime(0.02, now + duration);
                elfGain3.gain.linearRampToValueAtTime(0.015, now + duration);
            }
        }

        // Stop audio
        function stopAudio() {
            if (window.breathingAudio) {
                const { audioContext, oceanGain, elfGains } = window.breathingAudio;
                const { elfGain1, elfGain2, elfGain3 } = elfGains;
                const now = audioContext.currentTime;
                oceanGain.gain.linearRampToValueAtTime(0, now + 0.5);
                elfGain1.gain.linearRampToValueAtTime(0, now + 0.5);
                elfGain2.gain.linearRampToValueAtTime(0, now + 0.5);
                elfGain3.gain.linearRampToValueAtTime(0, now + 0.5);
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

            if (isAudioEnabled) {
                initAudio();
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
                stopAudio();
            } else {
                pauseIcon.style.display = 'inline';
                playIcon.style.display = 'none';
                if (isAudioEnabled) {
                    initAudio();
                }
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
                stopAudio();
            } else if (isRunning && !isPaused) {
                initAudio();
                updateAudioForPhase(currentPhase);
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
