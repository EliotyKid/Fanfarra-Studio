Text button for committing or secondary actions; use `primary` once per view for the main action.

```jsx
<Button variant="primary">Botão Primário</Button>
<Button variant="secondary">Botão Secundário</Button>
<Button variant="ghost" size="sm" icon="plus">Novo toque</Button>
```

- `variant`: primary (violet fill + soft glow), secondary (1.5px outline), ghost (no chrome, muted text).
- `size`: sm 34px / md 42px / lg 46px (default — matches reference).
- `icon` / `iconRight`: any name from `Icon`.
- Copy: short verbs in Portuguese, sentence case ("Salvar toque", not "SALVAR TOQUE").
