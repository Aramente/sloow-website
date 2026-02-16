// Sloow Website - JavaScript

document.addEventListener('DOMContentLoaded', () => {

    // ===== GAD-7 Quiz =====
    const quizForm = document.getElementById('quiz-form');
    const quizResults = document.getElementById('quiz-results');

    if (quizForm) {
        quizForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = quizForm.querySelector('.quiz-submit');
            submitButton.disabled = true;
            submitButton.textContent = 'Calcul en cours...';

            // Get all answers
            const answers = [];
            for (let i = 1; i <= 7; i++) {
                const selected = quizForm.querySelector(`input[name="q${i}"]:checked`);
                if (selected) {
                    answers.push(parseInt(selected.value));
                }
            }

            // Check all questions are answered
            if (answers.length < 7) {
                alert('Merci de répondre à toutes les questions.');
                submitButton.disabled = false;
                submitButton.textContent = 'Voir mes résultats';
                return;
            }

            // Calculate score
            const score = answers.reduce((sum, val) => sum + val, 0);
            const email = document.getElementById('quiz-email').value;

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
                        answers: answers.join(','),
                        q1: answers[0],
                        q2: answers[1],
                        q3: answers[2],
                        q4: answers[3],
                        q5: answers[4],
                        q6: answers[5],
                        q7: answers[6]
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

            // Hide form, show results
            quizForm.style.display = 'none';
            quizResults.style.display = 'block';

            // Scroll to results
            quizResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // ===== Other Form Handling (if any remain) =====
    const otherForms = document.querySelectorAll('form[action*="formspree"]:not(#quiz-form)');

    otherForms.forEach(form => {
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
                    form.innerHTML = '<p class="form-success">C\'est noté ! On te contacte très vite.</p>';
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
});
