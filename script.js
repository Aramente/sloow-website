// Sloow Website - JavaScript

document.addEventListener('DOMContentLoaded', () => {

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
                    description = 'Ton score indique une anxiété sévère. Ton système nerveux est en surchauffe. Il est important d\'agir maintenant. Sloow peut t\'aider, mais nous te recommandons aussi de consulter un professionnel de santé.';
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
                            source: 'quiz-gad7',
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
    function getWaitlistPosition() {
        let position = localStorage.getItem('sloow_waitlist_position');
        if (!position) {
            // Generate a position between 74 and 95 (feels real, creates urgency)
            position = Math.floor(Math.random() * 22) + 74;
            localStorage.setItem('sloow_waitlist_position', position);
        }
        return parseInt(position);
    }

    function incrementWaitlistCount() {
        let count = parseInt(localStorage.getItem('sloow_waitlist_count') || '73');
        count++;
        localStorage.setItem('sloow_waitlist_count', count);
        return count;
    }

    function updateSpotsLeft() {
        const spotsEl = document.getElementById('spots-left');
        if (spotsEl) {
            const count = parseInt(localStorage.getItem('sloow_waitlist_count') || '73');
            const spotsLeft = Math.max(100 - count, 7); // Never show less than 7
            spotsEl.textContent = spotsLeft;
        }
    }

    // Update spots on page load
    updateSpotsLeft();

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
                            source: 'inline-signup',
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
                updateSpotsLeft();
            });

            emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                }
            });
        }
    });
});
