import urllib.request
import os

images = {
    'bush-camp-cave-ensuite.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2020/12/Bush-Camp-Cave-Ensuite-1.jpg',
    'bush-camp-interior.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2020/12/Bush-Camp-Interior-2.jpg',
    'bush-camp-exterior.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2020/12/Bush-Camp-Exterior-2.jpg',
    'valley-camp-suite.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2025/03/DSC_0472-1024x683.jpg',
    'valley-camp-deck.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2020/12/IMG_6925.jpg',
    'sunset-lapa-restaurant.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2025/03/WhatsApp-Image-2024-09-05-at-16.20.41_9f747be2.jpg',
    'sunset-lapa-aerial.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2019/03/Lapa-Aerial-Photo.jpg',
    'emthombeni-restaurant.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2025/03/DEV_0008-1024x683.jpg',
    'wedding-fig-tree-chapel.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2025/03/1276865_166544373546924_99896279_o-1024x683.jpg',
    'safari-game-drive.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2019/03/IMG-20190205-WA0003.jpg',
    'white-lions.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2019/03/IMG-20171123-WA0013-1.jpg',
    'umtiza-tree.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2019/03/Umtiza-listeriana-1.jpg',
    'canoeing-estuary.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2018/04/IMG-20181215-WA0009-327x201.jpg',
    'nyala-wildlife.jpg': 'https://inkwenkwezi.co.za/wp-content/uploads/2020/09/nyala-ewe.jpg'
}

dest_dir = os.path.join('public', 'images', 'facilities')
os.makedirs(dest_dir, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for filename, url in images.items():
    dest_path = os.path.join(dest_dir, filename)
    print(f"Downloading {filename}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response, open(dest_path, 'wb') as out_file:
            out_file.write(response.read())
        size = os.path.getsize(dest_path)
        print(f"Saved {filename} ({size} bytes)")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

print("Download complete.")
