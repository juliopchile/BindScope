# Config import samples (PD6)

Client-side parsers for Source CFG, simple INI, and BindScope XML. See
[`app/tests/fixtures/README.md`](../app/tests/fixtures/README.md) for the format table and target-game
UX. Canonical test fixtures:

- [`app/tests/fixtures/sample-cs2.cfg`](../app/tests/fixtures/sample-cs2.cfg)
- [`app/tests/fixtures/sample-binds.ini`](../app/tests/fixtures/sample-binds.ini)
- [`app/tests/fixtures/sample-binds.xml`](../app/tests/fixtures/sample-binds.xml)

## BindScope XML schema

```xml
<binds>
  <bind key="W" action="Forward" />
  <bind key="E" action="Use" modifiers="ctrl,shift" />
  <bind key="R">Reload</bind>
</binds>
```

`modifiers` is comma- or space-separated. Keys are normalized via the shared alias map; unknown keys
are skipped and counted.
