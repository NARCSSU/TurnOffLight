import os
from PIL import Image, ImageDraw

def create_icon(size, is_on):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    radius = size // 3
    
    if is_on:
        draw.ellipse([center - radius, center - radius, 
                      center + radius, center + radius], 
                     fill=(34, 197, 94, 255))
        draw.ellipse([center - radius//2, center - radius//2, 
                      center + radius//2, center + radius//2], 
                     fill=(255, 255, 255, 150))
    else:
        draw.ellipse([center - radius, center - radius, 
                      center + radius, center + radius], 
                     fill=(100, 100, 150, 255))
    
    return img

output_dir = os.path.dirname(os.path.abspath(__file__))

sizes = [16, 32, 48, 128]

for size in sizes:
    icon_off = create_icon(size, False)
    icon_off.save(os.path.join(output_dir, f'icon-off-{size}.png'), optimize=True)
    
    icon_on = create_icon(size, True)
    icon_on.save(os.path.join(output_dir, f'icon-on-{size}.png'), optimize=True)

print('Icons generated successfully!')
