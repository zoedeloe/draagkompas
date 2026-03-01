# Draagkompas – Prototype (Schermen 2–5)

Dit pakket bevat de schermen en logica zoals afgesproken:
- **Scherm 2**: Disclaimer (visueel) + **VERDER**
- **Scherm 3**: Keuze **IK ZOEK** / **IK VERGELIJK** (logo linksboven, niet klikbaar, **VERDER** disabled tot keuze)
- **Scherm 4A**: Filters – **IK ZOEK** (BASIS actief; UITGEBREID/EXPERT zichtbaar maar grijs/disabled)
- **Scherm 4B**: Filters – **IK VERGELIJK** (BASIS + UITGEBREID actief; EXPERT zichtbaar maar grijs/disabled)
- **Scherm 5**: Resultaten (placeholder met samenvatting)

## Snel starten
1. Kopieer alle bestanden naar je repository (GitHub Pages branch – meestal `main`).
2. Plaats je disclaimer-afbeelding hier:
   ```
   assets/img/draagkompas-disclaimer.png
   ```
   > Tip: hernoem je bestand **“DRAAGKOMPAS (1).png”** naar `draagkompas-disclaimer.png` en zet het in `assets/img/`.
3. (Optioneel) Vervang het tekstlogo in `index.html` header door jouw echte logo:
   ```html
   <img src="assets/img/logo.svg" alt="Draagkompas logo" />
   ```
4. Commit & push. Open daarna je site: `https://<jouw-gebruikersnaam>.github.io/<repo>/`.
   - Force refresh met **Ctrl/Cmd+Shift+R** bij updates.

## Filters configureren
- Alle filters staan in **`data/filters.json`** met:
  - `groups`: secties en titels
  - `fields`: velden met `layer` = `basis` | `uitgebreid` | `expert`
  - `overrides`: per veld extra regels (bv. **MATERIAALSAMENSTELLING** altijd disabled)
- Logica per pad:
  - **IK ZOEK** → `basis` actief; `uitgebreid` & `expert` grijs/disabled
  - **IK VERGELIJK** → `basis` + `uitgebreid` actief; `expert` grijs/disabled

## Wat is *niet* inbegrepen (bewust)
- Back-end / data-opslag
- Echte zoekresultaten (Scherm 5 is nu een placeholder)
- Detailpagina’s (hier komt o.a. **MATERIAALSAMENSTELLING** als samengevoegde tekstregel)

## Toegankelijkheid
- Disabled elementen zijn gemarkeerd met `aria-disabled="true"` en niet focusbaar.
- Infoknop (ⓘ) bevat een `title`/tooltip met uitleg.

## Aanpassen
- Kleuren/typografie staan in `:root` in **`styles.css`**.
- Iconen op Scherm 3 zijn nu emoji (🔍 / ⚖️). Je kunt deze vervangen door SVG’s.

Veel succes!

