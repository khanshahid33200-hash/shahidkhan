import os
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib import colors

# Absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
SRC_ASSETS_DIR = os.path.join(BASE_DIR, "src", "assets")
os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(SRC_ASSETS_DIR, exist_ok=True)

pdf_path = os.path.join(PUBLIC_DIR, "udemy_digital_marketing_certificate.pdf")
png_public_path = os.path.join(PUBLIC_DIR, "udemy_digital_marketing_certificate.png")
png_assets_path = os.path.join(SRC_ASSETS_DIR, "udemy_digital_marketing_certificate.png")

# 1. GENERATE PNG USING PIL
width, height = 1600, 1131  # Aspect ratio ~1.41 (A4/landscape landscape)
image = Image.new("RGB", (width, height), "#ffffff")
draw = ImageDraw.Draw(image)

# Load fonts
try:
    font_bold_lg = ImageFont.truetype("arialbd.ttf", 64)
    font_bold_md = ImageFont.truetype("arialbd.ttf", 44)
    font_bold_sm = ImageFont.truetype("arialbd.ttf", 26)
    font_regular_sm = ImageFont.truetype("arial.ttf", 22)
    font_regular_xs = ImageFont.truetype("arial.ttf", 18)
    font_mono_xs = ImageFont.truetype("cour.ttf", 18)
except Exception:
    font_bold_lg = font_bold_md = font_bold_sm = font_regular_sm = font_regular_xs = font_mono_xs = ImageFont.load_default()

# Background & Border
padding = 80
draw.rectangle([padding, padding, width - padding, height - padding], fill="#ffffff", outline="#e0e0e0", width=2)

# Top Left: Udemy Logo with purple chevron
# Chevron
draw.polygon([(padding + 50, padding + 75), (padding + 70, padding + 55), (padding + 90, padding + 75)], fill="#a435f0")
# "udemy"
draw.text((padding + 50, padding + 80), "udemy", fill="#1c1d1f", font=font_bold_lg)

# Top Right: Metadata
meta_text_x = width - padding - 50
meta_y = padding + 60
draw.text((meta_text_x, meta_y), "Certificate no: UC-95eaf934-2a3e-452a-b9e1-ec1406b220a1", fill="#6a6f73", font=font_regular_xs, anchor="ra")
draw.text((meta_text_x, meta_y + 30), "Certificate url: ude.my/UC-95eaf934-2a3e-452a-b9e1-ec1406b220a1", fill="#6a6f73", font=font_regular_xs, anchor="ra")
draw.text((meta_text_x, meta_y + 60), "Reference Number: 0004", fill="#6a6f73", font=font_regular_xs, anchor="ra")

# Body Content
content_x = padding + 50

# Subtitle
draw.text((content_x, padding + 260), "CERTIFICATE OF COMPLETION", fill="#6a6f73", font=font_bold_sm)

# Title
course_title = "Mega Digital Marketing\nCourse A-Z: 32 Courses in 1\n+ Updates"
draw.text((content_x, padding + 320), course_title, fill="#1c1d1f", font=font_bold_lg, spacing=20)

# Instructors
draw.text((content_x, padding + 620), "Instructors ", fill="#6a6f73", font=font_regular_sm)
# measure Instructors label offset
inst_offset = draw.textlength("Instructors ", font=font_regular_sm)
draw.text((content_x + inst_offset, padding + 620), "Pouya Eti • Digital Marketing Expert", fill="#1c1d1f", font=font_bold_sm)

# Recipient Name
draw.text((content_x, padding + 750), "Shahid Khan", fill="#1c1d1f", font=font_bold_lg)

# Date & Length
draw.text((content_x, padding + 860), "Date ", fill="#6a6f73", font=font_regular_sm)
date_offset = draw.textlength("Date ", font=font_regular_sm)
draw.text((content_x + date_offset, padding + 860), "Aug. 4, 2026", fill="#1c1d1f", font=font_bold_sm)

draw.text((content_x, padding + 905), "Length ", fill="#6a6f73", font=font_regular_sm)
len_offset = draw.textlength("Length ", font=font_regular_sm)
draw.text((content_x + len_offset, padding + 905), "83.5 total hours", fill="#1c1d1f", font=font_bold_sm)

# Save PNG
image.save(png_public_path, "PNG")
image.save(png_assets_path, "PNG")
print(f"Saved PNG to {png_public_path} and {png_assets_path}")


# 2. GENERATE PDF USING REPORTLAB
c = canvas.Canvas(pdf_path, pagesize=landscape(letter))
w, h = landscape(letter)

# Draw PDF Elements
# Top Left Logo
c.setFillColor(colors.HexColor("#a435f0"))
path = c.beginPath()
path.moveTo(54, h - 50)
path.lineTo(64, h - 40)
path.lineTo(74, h - 50)
path.close()
c.drawPath(path, fill=1, stroke=0)

c.setFillColor(colors.HexColor("#1c1d1f"))
c.setFont("Helvetica-Bold", 36)
c.drawString(54, h - 85, "udemy")

# Top Right Meta
c.setFillColor(colors.HexColor("#6a6f73"))
c.setFont("Helvetica", 9)
c.drawRightString(w - 54, h - 55, "Certificate no: UC-95eaf934-2a3e-452a-b9e1-ec1406b220a1")
c.drawRightString(w - 54, h - 70, "Certificate url: ude.my/UC-95eaf934-2a3e-452a-b9e1-ec1406b220a1")
c.drawRightString(w - 54, h - 85, "Reference Number: 0004")

# Certificate of Completion
c.setFillColor(colors.HexColor("#6a6f73"))
c.setFont("Helvetica-Bold", 12)
c.drawString(54, h - 160, "CERTIFICATE OF COMPLETION")

# Course Title
c.setFillColor(colors.HexColor("#1c1d1f"))
c.setFont("Helvetica-Bold", 34)
c.drawString(54, h - 215, "Mega Digital Marketing")
c.drawString(54, h - 255, "Course A-Z: 32 Courses in 1")
c.drawString(54, h - 295, "+ Updates")

# Instructors
c.setFillColor(colors.HexColor("#6a6f73"))
c.setFont("Helvetica", 13)
c.drawString(54, h - 350, "Instructors  ")
offset_inst = c.stringWidth("Instructors  ", "Helvetica", 13)
c.setFillColor(colors.HexColor("#1c1d1f"))
c.setFont("Helvetica-Bold", 13)
c.drawString(54 + offset_inst, h - 350, "Pouya Eti • Digital Marketing Expert")

# Recipient Name
c.setFillColor(colors.HexColor("#1c1d1f"))
c.setFont("Helvetica-Bold", 38)
c.drawString(54, h - 450, "Shahid Khan")

# Date & Length
c.setFillColor(colors.HexColor("#6a6f73"))
c.setFont("Helvetica", 12)
c.drawString(54, h - 490, "Date ")
offset_date = c.stringWidth("Date ", "Helvetica", 12)
c.setFillColor(colors.HexColor("#1c1d1f"))
c.setFont("Helvetica-Bold", 12)
c.drawString(54 + offset_date, h - 490, "Aug. 4, 2026")

c.setFillColor(colors.HexColor("#6a6f73"))
c.setFont("Helvetica", 12)
c.drawString(54, h - 515, "Length ")
offset_len = c.stringWidth("Length ", "Helvetica", 12)
c.setFillColor(colors.HexColor("#1c1d1f"))
c.setFont("Helvetica-Bold", 12)
c.drawString(54 + offset_len, h - 515, "83.5 total hours")

c.save()
print(f"Saved PDF to {pdf_path}")
