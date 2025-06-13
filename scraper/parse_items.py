import sqlite3
from bs4 import BeautifulSoup

# --- Use these as the only columns for stats ---
BASE_STATS = ['Tai', 'Nin', 'Buki', 'Sta', 'Gen', 'Ele', 'Crit', 'Reroll', 'Atk']
EXTRA_STATS = [
    "Wind Damage", "Water Damage", "Fire Damage", "Earth Damage", "Lightning Damage", "Poison",
    "Critical Chance", "Itemfind", "Experience", "Gold", "Focus Burst", "Genjutsu Absorb",
    "Genjutsu Activation", "Bukijutsu Recovery", "Bukijutsu Boost", "Bukijutsu Max Recovery",
    "Bloodline Exp", "Lightning Element", "Wind Element", "Tai Guard", "Nin Absorb", "Death", "Taijutsu Immunity"
]
EXTRA_STATS_KEYS = [s.lower().replace(" ", "_") for s in EXTRA_STATS]

with open("all_items.html", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

items_raw = []

for tooltip in soup.select(".m-tooltip"):
    name = tooltip.select_one(".a-item-name").text.strip()
    # Stats
    stats_dict = {stat: 0 for stat in BASE_STATS}
    for stat in tooltip.select(".m-tooltip-stats__stat"):
        stat_name = stat.select_one("span").text.strip()
        value = stat.select_one("b").text.strip().replace("+", "")
        if stat_name in BASE_STATS:
            try:
                stats_dict[stat_name] = int(value)
            except ValueError:
                stats_dict[stat_name] = 0
    # Extra stats
    extra_stats_dict = {key: 0 for key in EXTRA_STATS_KEYS}
    for span in tooltip.select(".m-tooltip__stats-additional span"):
        text = span.text.strip()
        # Try to match "+8% Experience" or "+20% Genjutsu Absorb"
        import re
        m = re.match(r"^\+?([-\d.]+)%?\s*(.*)$", text)
        if m:
            val, stat = m.groups()
            key = stat.lower().replace(" ", "_")
            if key in extra_stats_dict:
                try:
                    extra_stats_dict[key] = float(val)
                except ValueError:
                    extra_stats_dict[key] = 0
    # Genjutsu
    genjutsu_objs = []
    for gj_wrap in tooltip.select(".m-tooltip-genjutsu"):
        main_gj_inner = gj_wrap.select_one(".m-tooltip-genjutsu__inner")
        if not main_gj_inner:
            continue
        gj_name = main_gj_inner.select_one(".m-tooltip-genjutsu__name").text.strip()
        gj_cost = main_gj_inner.select_one(".m-tooltip-genjutsu__cost").text.strip() if main_gj_inner.select_one(".m-tooltip-genjutsu__cost") else ""
        gj_capacity = main_gj_inner.select_one(".m-tooltip-genjutsu__socket b").text.strip() if main_gj_inner.select_one(".m-tooltip-genjutsu__socket b") else ""
        desc_lines = []
        for d in main_gj_inner.select(".m-tooltip-effect > *"):
            desc_lines.append(d.text.strip())
        description = "\n".join(desc_lines)
        genjutsu_obj = {
            "name": gj_name,
            "cost": gj_cost,
            "capacity": gj_capacity,
            "description": description,
            "sub_genjutsu": []
        }
        # Check for sub-genjutsu (e.g., .m-tooltip-genjutsu.-type-pass)
        for sub_gj_inner in gj_wrap.select(".m-tooltip-genjutsu.-type-pass .m-tooltip-genjutsu__inner"):
            sub_name = sub_gj_inner.select_one(".m-tooltip-genjutsu__name").text.strip()
            sub_cost = sub_gj_inner.select_one(".m-tooltip-genjutsu__cost").text.strip() if sub_gj_inner.select_one(".m-tooltip-genjutsu__cost") else ""
            sub_capacity = sub_gj_inner.select_one(".m-tooltip-genjutsu__socket b").text.strip() if sub_gj_inner.select_one(".m-tooltip-genjutsu__socket b") else ""
            sub_desc_lines = []
            for d in sub_gj_inner.select(".m-tooltip-effect > *"):
                sub_desc_lines.append(d.text.strip())
            sub_description = "\n".join(sub_desc_lines)
            genjutsu_obj["sub_genjutsu"].append({
                "name": sub_name,
                "cost": sub_cost,
                "capacity": sub_capacity,
                "description": sub_description
            })
        genjutsu_objs.append(genjutsu_obj)
    # Tier and copies
    tier = tooltip.select_one(".m-tooltip__bottom span:contains('Tier') b").text.strip()
    copies = tooltip.select_one(".m-tooltip__bottom span:contains('Copies') b").text.strip()
    items_raw.append({
        "name": name,
        "stats": stats_dict,
        "extra_stats": extra_stats_dict,
        "genjutsu": genjutsu_objs,
        "tier": tier,
        "copies": copies
    })

# 2. Insert into SQLite
conn = sqlite3.connect("all_items.db")
c = conn.cursor()

# Create items table with only the provided columns
columns = [
    "id INTEGER PRIMARY KEY AUTOINCREMENT",
    "name TEXT",
]
columns += [f'"{s.lower()}" INTEGER' for s in BASE_STATS]
columns += [f'"{key}" REAL' for key in EXTRA_STATS_KEYS]
columns += [
    "tier INTEGER",
    "copies INTEGER"
]
c.execute(f"CREATE TABLE IF NOT EXISTS items ({', '.join(columns)})")

# Create genjutsu table
c.execute("""
CREATE TABLE IF NOT EXISTS genjutsu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER,
    parent_id INTEGER,
    name TEXT,
    cost TEXT,
    capacity TEXT,
    description TEXT,
    FOREIGN KEY(item_id) REFERENCES items(id),
    FOREIGN KEY(parent_id) REFERENCES genjutsu(id)
)
""")

# Insert items and genjutsu
for item in items_raw:
    values = [
        item["name"]
    ]
    for stat in BASE_STATS:
        values.append(item["stats"].get(stat, 0))
    for key in EXTRA_STATS_KEYS:
        values.append(item["extra_stats"].get(key, 0))
    values += [
        item["tier"],
        item["copies"]
    ]
    placeholders = ", ".join(["?"] * len(values))
    base_stats_cols = ', '.join([f'"{s.lower()}"' for s in BASE_STATS])
    extra_stats_cols = ', '.join([f'"{k}"' for k in EXTRA_STATS_KEYS])
    sql = f'INSERT INTO items (name, {base_stats_cols}, {extra_stats_cols}, tier, copies) VALUES ({placeholders})'
    c.execute(sql, values)
    item_id = c.lastrowid

    # Insert genjutsu and sub-genjutsu
    def insert_genjutsu(gj, item_id, parent_id=None):
        c.execute(
            "INSERT INTO genjutsu (item_id, parent_id, name, cost, capacity, description) VALUES (?, ?, ?, ?, ?, ?)",
            (
                item_id,
                parent_id,
                gj["name"],
                gj["cost"],
                gj["capacity"],
                gj["description"]
            )
        )
        gj_id = c.lastrowid
        # Insert sub-genjutsu if present
        for sub_gj in gj.get("sub_genjutsu", []):
            insert_genjutsu(sub_gj, item_id, gj_id)

    for gj in item["genjutsu"]:
        insert_genjutsu(gj, item_id)

conn.commit()
conn.close()
print("Done.")