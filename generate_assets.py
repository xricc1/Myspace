import urllib.request
import json
import os

os.makedirs("assets", exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

# Unsplash source images for avatars & background
unsplash_images = {
    "assets/mandalorian.jpg": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80", # Armor / sci-fi figure
    "assets/grogu.jpg": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&auto=format&fit=crop&q=80", # Cute green creature/character vibes
    "assets/boba_fett.jpg": "https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80", # Neon helmet / sci-fi warrior
    "assets/bokatan.jpg": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80", # Sci-fi warrior blue tone
    "assets/ahsoka.jpg": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80", # Mystical alien style
    "assets/greef_karga.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80", # Leader / bounty guild boss
    "assets/cara_dune.jpg": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80", # Warrior woman
    "assets/kuiil.jpg": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80", # Wise elder Ugnaught
    "assets/ig11.jpg": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&auto=format&fit=crop&q=80", # Droid / robot
    "assets/blackhole_space.jpg": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&auto=format&fit=crop&q=80" # Deep cosmic space galaxy blackhole
}

for filepath, url in unsplash_images.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(filepath, "wb") as f:
            f.write(resp.read())
        print(f"Downloaded {filepath}")
    except Exception as e:
        print(f"Error downloading {filepath}: {e}")
