#Formulation

>*What are you really paying for?*
>
>Formulation is an interactive data visualisation that decodes skincare ingredient lists and asks whether the price tag is justified. It scores each product using a custom two-part methodology, then renders the results as a living, rotating 3D visualisation - the better the formula, the more structured and luminous the sphere; the worse the formula, the more chaotic and distorted.
>
>## What it does
>Each product is scored across two dimensions:
>**Ingredient Quality Score (IQS)** - evaluate the formula itself: how many superstar actives, beneficial goodies, and harmful/questionable icky ingredients it contains, weighted by type and position in the list
>**Price Fairness Multiplier (PFM)** - adjusts the score based on price per ml, rewarding great forumlas at accessible prices and penalising poor forumals sold at luxury premiums
>
>The combined **Final Score** is normalised to 0-100 acrss the dataset and mapped to a grade band (S/A/B/C/D), which drives the visual character of the 3D sphere.
>
>## Scoring Methodology
>
>### Ingredient Quality Score
>
>Cosmetic ingredient lists are legally ordered by descending concentration. An icky ingredient near the top is far more concerning than the one buried near the bottom. Each icky ingredient is weighted by its position:
>
>```
weight = max( 1 − position_index / ingredient_count,  0.25 )
```
The floor of **0.25** ensures late-listed icky ingredients still carry a meaningful penalty - skin reactions dont require high concentration to be relevant

## Price Fairness Multiplier
```
IQS_norm = max( IQS - IQS_min)/ (IQS_max - IQS_min) x 2 - 1
PFM = 1 + (IQS_norm x price_sensitivity)

```
Price / ml | Tier | Sensitivity |
|--|--|--|
| ≤ 0.20 | budget | +0.15 |
| $0.21 - $0.60 | Mid-range | 0.00 |
| $0.61 - $1.50 | Premium | -0.20 |
| > $1.50 | Luxury | -0.35 |


### Final Score
```
Final Score = IQS x PFM

```
Normalised to 0 -100 across the dataset. Grades reflect relative performance within the dataset, not an absolute standard.

| Score | Grade | Visual Character |
|--|--|--|
| 80-100 | S | Pristine, perfectly symmetrical, luminous |
| 60-79 | A | Clean, smooth, organic edges, soft glam |
| 40-79 | B | soft irregularities, slightly uneven, muted glow |
| 60-59 | C | Asymmetric, dull coloring, visible distortion |
| 0-19 | D | Distorted, spiky, chaotic - poinson-like |

---
### Visualisation

Each product is rendered as a **3D shard sphere** built with Three.js. Shards are distributed using a Fibonacci sphere algorithm and colored by ingredient category. The bloom post-processing pass makes high-scoring products glow; low-scoring ones are dark, jagged, and loose.

**Score → visual mapping:**

| Score | Sphere character |
|--|--|
| High | Tight, uniform, slow rotation, luminous bloom |
| Low | Scattered, spiky, faster chaotic rotation, dim |

**Ingredient colour coding **

| Category | Colour |
|--|--|
| Superstar | Neon pink `#FF10F0` |
| Goodie | Neon green `#39FF14` |
| Icky | Red `#FF0000` |
| Neutral | Baby blue `#89CFF0` |

---
 
## Product Pairs
 
The compare page shows 8 head-to-head pairs across moisturisers, essences, and serums:
 
| Pair | Products |
|---|---|
| 1 | Tatcha The Dewy Skin Cream vs e.l.f. Hello Hydration Face Cream |
| 2 | Sol de Janeiro Brazilian Bum Bum Cream vs Trader Joe's Brazil Nut Body Butter |
| 3 | La Mer The New Moisturizing Soft Cream vs CeraVe Moisturizing Cream |
| 4 | SK-II Facial Treatment Essence vs Missha Time Revolution First Treatment Essence |
| 5 | Charlotte Tilbury Magic Cream vs Olay Regenerist Micro-Sculpting Cream |
| 6 | SkinCeuticals Triple Lipid Restore vs The Ordinary Natural Moisturizing Factors |
| 7 | SkinCeuticals C E Ferulic vs TruSkin Vitamin C Super Serum+ |
| 8 | La Prairie Skin Caviar Liquid Lift vs The Ordinary Argireline Solution 10% |
 
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| 3D visualisation | [Three.js](https://threejs.org/) r158 with UnrealBloomPass post-processing |
| Charts | [Chart.js](https://www.chartjs.org/) |
| Typography | [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) via Google Fonts |
| Data | Ingredient lists sourced from [INCIDecoder](https://incidecoder.com/), classified manually |
| Hosting | Static HTML/CSS/JS — no build step required |
 
---
 
## File Structure
 
```
├── index.html        — Landing page
├── compare.html      — Main comparison view with 3D visualisations
├── about.html        — Methodology documentation
├── style.css         — All styling
├── script.js         — Three.js visualisation, Chart.js charts, product data & scoring
└── ingredientspreadsheet.csv  — Raw ingredient classification data
```
 
---
 
## Running Locally
 
No build step or package manager required. Because `script.js` uses ES modules and `importmap`, it needs to be served over HTTP rather than opened directly as a file.
 
```bash
# Python
python3 -m http.server 5500
 
# Node (if you have npx)
npx serve .
```
 
Then open `http://localhost:5500` in your browser.
 
---
 
## Data Sources & Limitations
 
- Ingredient classifications are sourced from **INCIDecoder** and mapped manually to the superstar / goodie / icky / neutral system. Classification involves judgment calls and may not reflect every dermatologist's perspective.
- The **1% rule** means the lower portion of ingredient lists doesn't reliably reflect concentration order — this is accounted for by the position weight floor of 0.25.
- The dataset covers **16 products across 8 category pairs**. Scores are relative within this dataset, not absolute benchmarks.
- Price data reflects retail prices at time of data collection and may have changed.
---







 
