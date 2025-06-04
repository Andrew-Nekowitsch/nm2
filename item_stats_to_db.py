import sqlite3
import re

# ---------------------------- CONFIG ----------------------------
INPUT_FILE = 'item_stats.txt'
DB_FILE = 'items.db'

BASE_STATS = ['Tai', 'Nin', 'Buki', 'Sta', 'Gen', 'Ele', 'Crit', 'Reroll', 'Atk']

EXTRA_STATS = [
    "Wind Damage",
    "Water Damage",
    "Fire Damage",
    "Earth Damage",
    "Lightning Damage",
    "Poison",
    "Critical Chance",
    "Itemfind",
    "Experience",
    "Gold",
    "Focus Burst",
    "Genjutsu Absorb",
    "Genjutsu Activation",
    "Bukijutsu Recovery",
    "Bukijutsu Boost",
    "Bukijutsu Max Recovery",
    "Bloodline Exp",
    "Lightning Element",
    "Wind Element",
    "Tai Guard",
    "Nin Absorb",
    "Death",
    "Taijutsu Immunity"
]
EXTRA_STATS_KEYS = [s.lower().replace(" ", "_") for s in EXTRA_STATS]
# ---------------------------------------------------------------

# Connect to SQLite
conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()

# Create main item table
cursor.execute(f'''
    CREATE TABLE IF NOT EXISTS objects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        {', '.join([f'{s.lower()} INTEGER' for s in BASE_STATS])},
        {', '.join([f'{key} REAL' for key in EXTRA_STATS_KEYS])},
        tier TEXT,
        copies INTEGER,
        description TEXT
    )
''')

# Create genjutsu table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS genjutsus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        object_id INTEGER,
        name TEXT,
        cost INTEGER,
        capacity INTEGER,
        description TEXT,
        FOREIGN KEY (object_id) REFERENCES objects(id)
    )
''')

# Read file
with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    text = f.read()

# Split into item blocks by "Copies X"
pattern = r'(.*?Copies\s+(\d+))\s*(?=\n|$)'
matches = re.findall(pattern, text, re.DOTALL)

for full_object, copies in matches:
    lines = full_object.strip().splitlines()
    if not lines:
        continue

    name = lines[0].strip()

    # Init stat values
    base_stat_values = {s.lower(): 0 for s in BASE_STATS}
    extra_stat_values = {key: 0.0 for key in EXTRA_STATS_KEYS}
    description_lines = []
    gen_name = None
    gen_cost = None
    gen_capacity = None
    gen_description = []
    tier = None

    # ------------------ Parse base stats ------------------
    i = 1
    while i < len(lines) - 1:
        val_line = lines[i].strip()
        stat_line = lines[i + 1].strip()

        if stat_line in BASE_STATS and re.match(r'[+]?(-?\d+)', val_line):
            base_stat_values[stat_line.lower()] = int(val_line.replace('+', ''))
            i += 2
        else:
            break

    # ------------------ Parse extra stats ------------------
    extra_stat_pattern = re.compile(r'^\+([-\d.]+%?)\s+(.*)$')

    while i < len(lines):
        line = lines[i].strip()

        # Match +X% Extra Stat
        match = extra_stat_pattern.match(line)
        if match:
            val_raw, stat_name = match.groups()
            key = stat_name.lower().replace(" ", "_")
            if key in extra_stat_values:
                if '%' in val_raw:
                    extra_stat_values[key] = float(val_raw.replace('%', ''))
                else:
                    extra_stat_values[key] = int(val_raw.replace('+', ''))
            i += 1
            continue

        # Stop if we hit genjutsu start (line with just a number)
        if re.match(r'^\d+$', line):
            break

        description_lines.append(line)
        i += 1

    # ------------------ Parse genjutsu block ------------------
    genjutsu_blocks = []

    # Look for multiple genjutsu blocks
    while i < len(lines):
        line = lines[i].strip()

        # Genjutsu starts with: int (cost), str (name), int (capacity)
        if re.match(r'^\d+$', line) and i + 2 < len(lines):
            cost = int(line)
            name = lines[i + 1].strip()
            cap_line = lines[i + 2].strip()

            if re.match(r'^\d+$', cap_line):
                capacity = int(cap_line)
                i += 3
                desc_lines = []

                while i < len(lines):
                    next_line = lines[i].strip()
                    if next_line.startswith('Tier') or re.match(r'^\d+$', next_line) and i + 2 < len(lines):
                        break
                    desc_lines.append(next_line)
                    i += 1

                genjutsu_blocks.append({
                    'cost': cost,
                    'name': name,
                    'capacity': capacity,
                    'description': '\n'.join(desc_lines).strip()
                })
                continue

        # Detect Tier
        if line.startswith('Tier'):
            tier = line
            i += 1
            continue

        description_lines.append(line)
        i += 1


    # ------------------ Insert into database ------------------
    # Insert main object row
    cursor.execute(f'''
        INSERT INTO objects (
            name, {', '.join(base_stat_values.keys())},
            {', '.join(extra_stat_values.keys())},
            tier, copies, description
        ) VALUES (
            ?, {', '.join(['?'] * len(base_stat_values))},
            {', '.join(['?'] * len(extra_stat_values))},
            ?, ?, ?
        )
    ''', (
        name,
        *base_stat_values.values(),
        *extra_stat_values.values(),
        tier,
        int(copies),
        '\n'.join(description_lines).strip() if description_lines else None
    ))
    
    object_id = cursor.lastrowid
    
    # Insert genjutsus linked to this item
    for gen in genjutsu_blocks:
        cursor.execute('''
            INSERT INTO genjutsus (object_id, name, cost, capacity, description)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            object_id,
            gen['name'],
            gen['cost'],
            gen['capacity'],
            gen['description']
        ))


conn.commit()
conn.close()

print(f"Inserted {len(matches)} items into the database.")
