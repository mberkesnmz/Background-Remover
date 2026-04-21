from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import Response, HTMLResponse
from fastapi.staticfiles import StaticFiles
from rembg import remove
from PIL import Image, ImageColor
import io

app = FastAPI(title="BG Remover")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
async def root():
    with open("static/index.html", encoding="utf-8") as f:
        return f.read()


@app.post("/remove-bg")
async def remove_background(
    file: UploadFile = File(...),
    bg_color: str = Form(default=""),
):
    contents = await file.read()
    output_bytes = remove(contents)

    if bg_color:
        fg = Image.open(io.BytesIO(output_bytes)).convert("RGBA")
        try:
            color = ImageColor.getrgb(bg_color)
        except ValueError:
            color = (255, 255, 255)
        bg = Image.new("RGBA", fg.size, color + (255,))
        bg.paste(fg, mask=fg.split()[3])
        buf = io.BytesIO()
        bg.convert("RGB").save(buf, format="JPEG", quality=95)
        return Response(content=buf.getvalue(), media_type="image/jpeg")

    return Response(content=output_bytes, media_type="image/png")
