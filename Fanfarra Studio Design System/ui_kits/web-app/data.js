// Fanfarra Studio — sample content for the web-app UI kit. Patterns are step indexes (0-based) over bars × (beats × 2) eighth-note steps.
window.FS_INSTRUMENTS = [
  { id: 'bumbo', name: 'Bumbo', color: 'var(--inst-bumbo)' },
  { id: 'prato', name: 'Prato', color: 'var(--inst-prato)' },
  { id: 'tarol', name: 'Tarol', color: 'var(--inst-tarol)' },
  { id: 'surdo', name: 'Surdo', color: 'var(--inst-surdo)' },
  { id: 'repique', name: 'Repique', color: 'var(--inst-repique)' }
];

window.FS_TOQUES = [
  { id: 'marcha-de-entrada', title: 'Marcha de Entrada', group: 'Fanfarra Municipal', bpm: 120, sig: '4/4', bars: 4,
    pattern: { bumbo: [0, 6, 8, 14, 20, 24, 28], prato: [2, 3, 10, 16, 22, 29], tarol: [0, 4, 6, 8, 10, 12, 14, 18, 20, 24, 26, 30], surdo: [2, 8, 16, 24], repique: [6, 12, 20, 22, 28, 30] } },
  { id: 'dobrado-de-desfile', title: 'Dobrado de Desfile', group: 'Banda Marcial', bpm: 110, sig: '4/4', bars: 4,
    pattern: { bumbo: [0, 4, 8, 12, 16, 20, 24, 28], prato: [0, 16, 30], tarol: [2, 3, 6, 10, 11, 14, 18, 19, 22, 26, 27, 28, 29, 30, 31], surdo: [4, 12, 20, 28], repique: [7, 15, 23, 31] } },
  { id: 'marcha-batida', title: 'Marcha Batida', group: 'Fanfarra Escolar', bpm: 130, sig: '4/4', bars: 4,
    pattern: { bumbo: [0, 3, 8, 11, 16, 19, 24, 27], prato: [4, 12, 20, 28], tarol: [0, 2, 4, 6, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 25, 26, 28, 29, 30, 31], surdo: [6, 14, 22, 30], repique: [5, 13, 21, 29, 30] } },
  { id: 'toque-de-avancar', title: 'Toque de Avançar', group: 'Fanfarra Municipal', bpm: 100, sig: '2/4', bars: 4,
    pattern: { bumbo: [0, 4, 8, 12], prato: [0, 8], tarol: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15], surdo: [2, 6, 10, 14], repique: [3, 7, 11, 15] } }
];
