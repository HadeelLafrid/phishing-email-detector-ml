import pandas as pd
import pickle
import ast
import os

# ── Folders ───────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
SAVE_DIR = os.path.join(BASE_DIR, "saved")
os.makedirs(SAVE_DIR, exist_ok=True)

SAVE_PATH = os.path.join(SAVE_DIR, "dataset_clean.pkl")

# ── Check if already saved ────────────────────────────────────
if os.path.exists(SAVE_PATH):
    print("✓ dataset_clean.pkl already exists — no need to run again")
    print("  Just use: df = pd.read_pickle('saved/dataset_clean.pkl')")

else:
    print("Loading CSVs...")

    # ── Load raw CSVs ──────────────────────────────────────────
    nazario      = pd.read_csv(os.path.join(DATA_DIR, "Nazario_5.csv"))
    spamassassin = pd.read_csv(os.path.join(DATA_DIR, "SpamAssasin.csv"))

    print(f"Nazario raw      : {nazario.shape}")
    print(f"SpamAssassin raw : {spamassassin.shape}")

    # ── Fix urls column type mismatch ─────────────────────────
    # Nazario  urls = stringified list e.g. "['http://...', ...]"
    # SpamAssassin urls = already 0 or 1 integer
    # we convert both to a simple integer count
    def parse_url_count(val):
        try:
            lst = ast.literal_eval(str(val))
            return len(lst) if isinstance(lst, list) else int(val)
        except:
            return 0

    nazario['urls']      = nazario['urls'].apply(parse_url_count)
    spamassassin['urls'] = (pd.to_numeric(spamassassin['urls'],
                            errors='coerce')
                            .fillna(0).astype(int))

    # ── Add source BEFORE selecting columns ───────────────────
    nazario['source']      = 'nazario'
    spamassassin['source'] = 'spamassassin'

    # ── Keep only needed columns (source included now) ─────────
    KEEP_COLS = ['sender', 'subject', 'body', 'urls', 'label', 'source']
    nazario      = nazario[KEEP_COLS].copy()
    spamassassin = spamassassin[KEEP_COLS].copy()

    # ── Drop rows with missing body ────────────────────────────
    nazario      = nazario.dropna(subset=['body'])
    spamassassin = spamassassin.dropna(subset=['body'])

    # ── Fill missing values with empty string ──────────────────
    for col in ['sender', 'subject']:
        nazario[col]      = nazario[col].fillna('')
        spamassassin[col] = spamassassin[col].fillna('')

    # ── Combine and shuffle ────────────────────────────────────
    df = pd.concat([nazario, spamassassin], ignore_index=True)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    # ── Summary ────────────────────────────────────────────────
    print(f"\n=== LABEL DISTRIBUTION ===")
    print(df['label'].value_counts())
    print(f"\n=== SOURCE DISTRIBUTION ===")
    print(df['source'].value_counts())
    print(f"\n=== LABEL PER SOURCE ===")
    print(df.groupby(['source', 'label']).size().unstack())
    print(f"\nFinal shape : {df.shape}")
    print(f"Columns     : {df.columns.tolist()}")

    # ── Save ───────────────────────────────────────────────────
    df.to_pickle(SAVE_PATH)
    print(f"\n✓ Saved to saved/dataset_clean.pkl")
    print("  Next time just load with pd.read_pickle()")