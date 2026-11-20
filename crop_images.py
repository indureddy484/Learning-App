
from PIL import Image, ImageChops, ImageOps
from pathlib import Path

folder = Path(r"C:\Users\shruthi\Desktop\Learning-App\src\assets\images\ascending-order")

for file in folder.glob("*.png"):
    image = Image.open(file).convert("RGB")

    # Find the object by detecting pixels that differ from white.
    background = Image.new("RGB", image.size, "white")
    difference = ImageChops.difference(image, background)

    # Ignore very faint background variations.
    difference = difference.point(
        lambda pixel: 255 if pixel > 35 else 0
    )

    bbox = difference.getbbox()

    if bbox:
        # Add a little white space around the complete object.
        cropped = image.crop(bbox)
        cropped = ImageOps.expand(cropped, border=12, fill="white")
        cropped.save(file)

        print("Cropped:", file.name)
    else:
        print("No object detected:", file.name)

print("Image cropping completed!")
