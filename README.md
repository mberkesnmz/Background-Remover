# BG Remover

Web-based background remover built with FastAPI and [rembg](https://github.com/danielgatis/rembg).

## Features

- Drag & drop or file picker upload
- Transparent PNG or custom background color output
- Side-by-side original / result preview
- One-click download

## Setup

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Then open `http://localhost:8000`.

## Stack

- **Backend:** FastAPI, rembg, Pillow
- **Frontend:** Vanilla JS, no dependencies
