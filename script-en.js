// Sloow — English config
window.SLOOW_CONFIG = {
  lang: 'en',
  ids: { ctaTarget: 'assessment', breathingSection: 'exercise' },
  api: { inlineSignupSource: 'inline-signup-en', breathingBetaSource: 'breathing-beta-en' },
  strings: {
    breathCount: (n, total) => `Breath ${n}/${total}`,
    inhaleInstruction: 'Breathe in through your nose...',
    exhaleInstruction: 'Breathe out gently...',
    pausedLabel: 'Paused',
    activeTitle: 'Breathe — Sloow',
    defaultTitle: 'Sloow — Your nervous system needs a break',
  }
};
