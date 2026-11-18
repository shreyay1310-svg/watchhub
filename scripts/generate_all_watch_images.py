import os
import io
import json
import urllib.request
from PIL import Image, ImageOps, ImageFilter

OUTPUT_DIR = "client/public/images/products"
os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'WatchHubCatalog/1.0 (https://watchhub.luxury; contact@watchhub.luxury)'
}

# The 60 products mapped to high-res source images
SOURCES = {
    # 1. Chronoswiss Open Gear Flying Tourbillon Paraiba
    "chronoswiss-tourbillon": "local:client/public/images/hero/chronoswiss_tourbillon.jpg",
    # 2. Chronoswiss Opus Chronograph Titanium
    "chronoswiss-opus-chronograph": "local:client/public/images/hero/chronograph_black.jpg",
    # 3. Rolex Submariner Date 41mm
    "rolex-submariner": "local:client/public/images/products/bestseller_rolex.png",
    # 4. Rolex Cosmograph Daytona Gold
    "rolex-daytona": "local:client/public/images/products/featured_rolex_daytona.jpg",
    # 5. Rolex Lady-Datejust 28 Diamond Bezel
    "rolex-lady-datejust-diamond": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Rolex_Datejust_126234.jpg/960px-Rolex_Datejust_126234.jpg",
    # 6. Rolex Submariner 16610 (Pre-Owned Certified)
    "rolex-submariner-vintage-preowned": "local:client/public/images/products/rolex_submariner.jpg",
    # 7. Omega Speedmaster Professional Moonwatch
    "omega-speedmaster": "local:client/public/images/products/bestseller_omega.png",
    # 8. Omega Seamaster Diver 300M Co-Axial
    "omega-seamaster": "local:client/public/images/products/featured_omega_seamaster.jpg",
    # 9. Omega Constellation Co-Axial Master 29mm
    "omega-constellation-diamond": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Omega_Seamaster_Co-Axial.jpg/960px-Omega_Seamaster_Co-Axial.jpg",
    # 10. Patek Philippe Nautilus 5711/1A Blue Dial
    "patek-nautilus": "local:client/public/images/products/featured_patek_nautilus.jpg",
    # 11. Audemars Piguet Royal Oak Selfwinding 41mm
    "ap-royal-oak": "local:client/public/images/products/featured_ap_royal_oak.jpg",
    # 12. Audemars Piguet Royal Oak Frosted Gold 37mm
    "ap-royal-oak-frosted-gold": "local:client/public/images/products/audemars_piguet.jpg",
    # 13. Cartier Tank Must Large Model
    "cartier-tank": "local:client/public/images/products/featured_cartier_tank.jpg",
    # 14. Cartier Tank Française Rose Gold & Steel
    "cartier-tank-francaise": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Cartier_Tank.jpg/960px-Cartier_Tank.jpg",
    # 15. Cartier Panthère de Cartier Medium Model
    "cartier-panthere-medium": "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=700&q=85",
    # 16. TAG Heuer Carrera Chronograph Automatic 44mm
    "tag-heuer-carrera": "local:client/public/images/products/bestseller_tag.png",
    # 17. TAG Heuer Monaco Calibre 11 Steve McQueen Edition
    "tag-heuer-monaco-racing": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/TAG_Heuer_Monaco_40th_Anniversary_re-edition.JPG/960px-TAG_Heuer_Monaco_40th_Anniversary_re-edition.JPG",
    # 18. Tissot PRX Powermatic 80 Blue Dial
    "tissot-prx": "local:client/public/images/products/bestseller_tissot.png",
    # 19. Tissot Le Locle Automatic Roman Dial
    "tissot-le-locle-automatic": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85",
    # 20. Breitling Navitimer B01 Chronograph 43
    "breitling-navitimer": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Breitling_Navitimer_slide_rule.jpg/960px-Breitling_Navitimer_slide_rule.jpg",
    # 21. Seiko Prospex Automatic Diver 200M Turtle
    "seiko-prospex-diver": "local:client/public/images/products/bestseller_seiko.png",
    # 22. Casio G-Shock Carbon Core 200M Diver
    "casio-gshock-diver": "local:client/public/images/products/gshock_digital.jpg",
    # 23. Casio G-Shock GA-2100 Octagon CasiOak
    "g-shock-ga2100": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=85",
    # 24. Casio Vintage Digital Gold A168WG
    "casio-vintage-gold": "local:client/public/images/products/casio_vintage_digital.jpg",
    # 25. Titan Raga Viva Mother of Pearl Rose Gold
    "titan-raga-viva": "local:client/public/images/products/titan_raga.jpg",
    # 26. Fossil Jacqueline Minimalist Blush Leather
    "fossil-jacqueline-blush": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=85",
    # 27. Michael Kors Parker Chronograph Pave Gold
    "michael-kors-parker-gold": "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=700&q=85",
    # 28. Longines DolceVita 18K Yellow Gold & Steel
    "longines-dolcevita-steel-gold": "local:client/public/images/products/cartier_santos.jpg",
    # 29. Chopard Happy Diamonds Icons 18K Rose Gold
    "chopard-happy-diamonds": "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=700&q=85",
    # 30. Casio Youth Digital Illuminator 10-Year Battery
    "casio-youth-digital-kids": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Casio_F-91W_5051.jpg/960px-Casio_F-91W_5051.jpg",
    # 31. Zoop by Titan Marvel Spider-Man Digital Edition
    "zoop-marvel-spiderman": "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=85",
    # 32. Zoop by Titan Disney Frozen Elsa Snowflake Analog
    "zoop-disney-frozen-elsa": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
    # 33. Timex Time Factory Educational Analog Watch
    "timex-kids-time-factory-analog": "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=700&q=85",
    # 34. Q&Q Kids 100M Water Resistant Sports Watch
    "qq-kids-sport-waterproof": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=700&q=85",
    # 35. Apple Watch Series 10 Jet Black 46mm GPS+Cellular
    "apple-watch-s10": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Apple_Watch_Series_10.jpg/960px-Apple_Watch_Series_10.jpg",
    # 36. Apple Watch Ultra 2 Titanium 49mm Ocean Band
    "apple-watch-ultra-2": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Apple_Watch_Ultra_-_2.jpg/960px-Apple_Watch_Ultra_-_2.jpg",
    # 37. Samsung Galaxy Watch 6 Classic 47mm LTE
    "samsung-galaxy-watch-6": "local:client/public/images/products/samsung_galaxy_watch.jpg",
    # 38. Samsung Galaxy Watch 7 BioActive Sensor 44mm
    "samsung-galaxy-watch-7": "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=700&q=85",
    # 39. Garmin Fenix 7 Pro Sapphire Solar Edition
    "garmin-fenix-7-pro": "https://images.unsplash.com/photo-1518131672697-613becd4fab5?auto=format&fit=crop&w=700&q=85",
    # 40. Titan Smart Pro AMOLED BT Calling Watch
    "titan-smart-pro-calling": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=700&q=85",
    # 41. TAG Heuer Carrera x Porsche Special Chronograph Edition
    "tag-heuer-porsche-carrera": "local:client/public/images/hero/new_arrival_chrono.png",
    # 42. Swatch x Omega Bioceramic MoonSwatch Mission to the Moon
    "swatch-omega-moonswatch-moon": "local:client/public/images/hero/hero_omega_speedmaster.jpg",
    # 43. Longines Spirit Heritage Pioneer Chronometer
    "longines-spirit-heritage-pioneer": "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=700&q=85",
    # 44. Tissot Heritage 1973 Navigator Limited Edition
    "tissot-heritage-1973-navigator": "local:client/public/images/products/tissot_prx.jpg",
    # 45. WatchHub Atelier Winter Frost Ice-Blue Limited Edition
    "watchhub-winter-frost-atelier": "local:client/public/images/footer_newsletter_watch.png",
    # 46. Flik Flak Swiss Made Rainbow Time Teaching Analog
    "flik-flak-swiss-color": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
    # 47. Fastrack Reflex Play Junior Smartwatch for Kids
    "fastrack-reflex-play-jr": "local:client/public/images/products/smartwatch_apple.jpg",
    # 48. Zoop Adventure Rugged Shock-Resistant Camo Edition
    "zoop-adventure-camo-sport": "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=700&q=85",
    # 49. Garmin Forerunner 965 Premium AMOLED GPS Running Watch
    "garmin-forerunner-965": "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=700&q=85",
    # 50. Fitbit Charge 6 Advanced Health & Fitness Tracker
    "fitbit-charge-6-fitness": "local:client/public/images/products/featured_apple_watch.jpg",
    # 51. Fossil Gen 6 Touchscreen Smartwatch with Alexa
    "fossil-gen-6-wellness": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=85",
    # 52. Breitling Superocean Automatic 44 Yellow Dial
    "breitling-superocean-automatic": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Breitling_steelfish.jpg/960px-Breitling_steelfish.jpg",
    # 53. Citizen Promaster Marine Eco-Drive 200M ISO Diver
    "citizen-promaster-diver": "local:client/public/images/products/seiko_diver_waterproof.jpg",
    # 54. Tudor Pelagos Titanium 500M Diver with Helium Valve
    "tudor-pelagos-titanium": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Tudor_Pelagos_for_Carolina_Watch_Club_Limited_Edition.jpg/960px-Tudor_Pelagos_for_Carolina_Watch_Club_Limited_Edition.jpg",
    # 55. Vacheron Constantin Overseas Automatic Blue Dial
    "vacheron-overseas-blue": "local:client/public/images/hero/hero_patek_nautilus.jpg",
    # 56. Jaeger-LeCoultre Reverso Tribute Duoface Small Seconds
    "jlc-reverso-tribute": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Casa_Fagliano_Leather_Strap_%28Jaeger-LeCoultre_Reverso%29.jpg/960px-Casa_Fagliano_Leather_Strap_%28Jaeger-LeCoultre_Reverso%29.jpg",
    # 57. Nomos Glashütte Tangente 33 Champagne Dial
    "nomos-tangente-33": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85",
    # 58. Tissot Bellissima Small Lady Rose Gold PVD
    "tissot-bellissima-small": "local:client/public/images/hero/new_arrival_gold.png",
    # 59. Titan Bandhan His & Hers Gold Pair
    "titan-bandhan-pair": "local:client/public/images/products/couple_pair.jpg",
    # 60. Fossil His & Hers Leather Twin Set
    "fossil-couple-classic": "local:client/public/images/hero/new_arrivals_trio.png",
}

def load_image(src):
    if src.startswith("local:"):
        path = src.replace("local:", "")
        if os.path.exists(path):
            return Image.open(path)
        else:
            print(f"Local file not found: {path}")
            return None
    elif src.startswith("http"):
        try:
            req = urllib.request.Request(src, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                return Image.open(io.BytesIO(data))
        except Exception as e:
            print(f"Failed to fetch {src}: {e}")
            return None
    return None

def process_and_save(img, out_path, target_size=(700, 700), bg_color=(8, 13, 25)):
    # Convert image to RGBA
    img = img.convert("RGBA")
    
    # Trim near-black borders or transparent borders if needed, or take full image
    w, h = img.size
    
    # Calculate scale so that the entire watch fits within 84% of canvas
    max_w = int(target_size[0] * 0.84)
    max_h = int(target_size[1] * 0.84)
    
    scale = min(max_w / w, max_h / h)
    new_w = int(w * scale)
    new_h = int(h * scale)
    
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create target canvas with exact WatchHub dark navy background #080d19
    canvas = Image.new("RGBA", target_size, (*bg_color, 255))
    
    # Center position
    paste_x = (target_size[0] - new_w) // 2
    paste_y = (target_size[1] - new_h) // 2
    
    # Paste with alpha mask
    canvas.paste(resized, (paste_x, paste_y), resized)
    
    # Save as PNG
    final = canvas.convert("RGB")
    final.save(out_path, format="PNG", optimize=True)
    print(f"Saved: {out_path} ({new_w}x{new_h} in {target_size[0]}x{target_size[1]})")

def main():
    with open("scratch_products.json", "r") as f:
        products = json.load(f)
        
    print(f"Processing {len(products)} products...")
    
    processed = 0
    fallback_img = None
    
    for p in products:
        pid = p["id"]
        out_file = os.path.join(OUTPUT_DIR, f"{pid}.png")
        
        src = SOURCES.get(pid)
        img = None
        if src:
            img = load_image(src)
            
        if img is None:
            # Fallback to local featured or generic watch
            print(f"Warning: Using fallback for {pid}")
            fallback_path = "client/public/images/products/featured_rolex_submariner.jpg"
            if os.path.exists(fallback_path):
                img = Image.open(fallback_path)
                
        if img:
            process_and_save(img, out_file)
            processed += 1
            if fallback_img is None:
                fallback_img = img

    # Also generate a luxury watch placeholder image
    if fallback_img:
        placeholder_path = os.path.join(OUTPUT_DIR, "watch_placeholder.png")
        process_and_save(fallback_img, placeholder_path)
        print(f"Created luxury placeholder at {placeholder_path}")
        
    print(f"Completed! {processed}/{len(products)} images generated.")

if __name__ == "__main__":
    main()
