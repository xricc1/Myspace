import urllib.request
import json
import os

headers = {'User-Agent': 'MySpaceMando/1.0 (contact: info@example.com)'}

def get_wiki_image_url(title):
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=pageimages&format=json&pithumbsize=300"
    req = urllib.request.Request(api_url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data['query']['pages']
            for k, v in pages.items():
                if 'thumbnail' in v:
                    return v['thumbnail']['source']
    except Exception as e:
        print(f"API error for {title}: {e}")
    return None

targets = {
    "mandalorian.jpg": "The_Mandalorian_(character)",
    "grogu.jpg": "Grogu",
    "boba_fett.jpg": "Boba_Fett",
    "bokatan.jpg": "Bo-Katan_Kryze",
    "ahsoka.jpg": "Ahsoka_Tano",
    "greef_karga.jpg": "Greef_Karga",
    "cara_dune.jpg": "Cara_Dune",
    "kuiil.jpg": "Kuiil",
    "ig11.jpg": "IG-11"
}

os.makedirs("assets", exist_ok=True)

for filename, title in targets.items():
    img_url = get_wiki_image_url(title)
    if img_url:
        try:
            req = urllib.request.Request(img_url, headers=headers)
            with urllib.request.urlopen(req) as resp, open(f"assets/{filename}", "wb") as f:
                f.write(resp.read())
            print(f"Successfully saved assets/{filename} from {img_url}")
        except Exception as e:
            print(f"Failed download {filename}: {e}")
    else:
        print(f"Could not find thumbnail for {title}")
