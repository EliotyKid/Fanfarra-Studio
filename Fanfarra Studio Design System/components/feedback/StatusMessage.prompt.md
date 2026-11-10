Status feedback row (success / warning / error) for confirmations, validation and playback problems.

```jsx
<StatusMessage tone="success" title="Sucesso" message="Operação realizada!" />
<StatusMessage tone="warning" title="Aviso" message="Atenção necessária." />
<StatusMessage tone="danger" title="Erro" message="Algo deu errado." onDismiss={close} variant="banner" />
```

- Tones map to tokens: success = Tarol green, warning = Bumbo amber, danger = Repique pink.
- Title stays white; only the message + glyphs take the tone color.
- Danger uses `role="alert"`; others `role="status"`.
