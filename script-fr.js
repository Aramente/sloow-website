// Sloow — French config
window.SLOOW_CONFIG = {
  lang: 'fr',
  ids: { ctaTarget: 'bilan', breathingSection: 'exercice' },
  api: { inlineSignupSource: 'inline-signup', breathingBetaSource: 'breathing-beta' },
  strings: {
    breathCount: (n, total) => `Respiration ${n}/${total}`,
    inhaleInstruction: 'Inspire par le nez...',
    exhaleInstruction: 'Expire doucement...',
    pausedLabel: 'En pause',
    activeTitle: '🌬 Respire — Sloow',
    defaultTitle: 'Sloow — Ton système nerveux a besoin de souffler',
  }
};
