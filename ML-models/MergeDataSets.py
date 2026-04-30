import pandas as pd
import numpy as np
import os
import pickle
from scipy.sparse import load_npz, hstack, csr_matrix, save_npz

# ── Paths ────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR = os.path.join(BASE_DIR, "saved")

# ── Load all feature files ───────────────────────────────
header_df  = pd.read_pickle(os.path.join(SAVE_DIR, "header_features.pkl"))
numeric_df = pd.read_pickle(os.path.join(SAVE_DIR, "numeric_features.pkl"))
tfidf      = load_npz(os.path.join(SAVE_DIR, "body_tfidf.npz"))
labels     = pd.read_csv(os.path.join(SAVE_DIR, "labels.csv"))

print(f"Header features  : {header_df.shape}")
print(f"Numeric features : {numeric_df.shape}")
print(f"TF-IDF matrix    : {tfidf.shape}")

# ── Drop label from header (VERY IMPORTANT) ──────────────
if "label" in header_df.columns:
    header_df = header_df.drop(columns=["label"])

# ── Safety check: ensure all datasets align ──────────────
assert tfidf.shape[0] == header_df.shape[0] == numeric_df.shape[0], \
    "Mismatch in number of rows between feature sets!"

# ── Convert header + numeric to sparse ───────────────────
header_sparse  = csr_matrix(header_df.values.astype(np.float32))
numeric_sparse = csr_matrix(numeric_df.values.astype(np.float32))

# ── Combine all features (RECOMMENDED ORDER) ─────────────
# TF-IDF first, then numeric, then header
X_combined = hstack([tfidf, numeric_sparse, header_sparse])

print(f"\n✓ Combined shape : {X_combined.shape}")
print(f"  TF-IDF cols    : {tfidf.shape[1]}")
print(f"  Numeric cols   : {numeric_df.shape[1]}")
print(f"  Header cols    : {header_df.shape[1]}")
print(f"  TOTAL cols     : {X_combined.shape[1]}")

# ── Save combined sparse matrix ──────────────────────────
save_npz(os.path.join(SAVE_DIR, "merged_with_tfidf.npz"), X_combined)

# ── Prepare labels for training ──────────────────────────
y = labels.values.ravel()

# ── Load correct TF-IDF vectorizer ───────────────────────
with open(os.path.join(SAVE_DIR, "tfidf_vectorizer.pkl"), "rb") as f:
    vectorizer = pickle.load(f)

# ── Save feature names (IMPORTANT for interpretation/UI) ─
all_feature_names = (
    list(vectorizer.get_feature_names_out()) +   # TF-IDF first
    list(numeric_df.columns) +                   # then numeric
    list(header_df.columns)                      # then header
)

with open(os.path.join(SAVE_DIR, "all_feature_names.pkl"), "wb") as f:
    pickle.dump(all_feature_names, f)

# ── Final confirmation ───────────────────────────────────
print(f"\n✓ Saved → saved/merged_with_tfidf.npz")
print(f"✓ Saved → saved/all_feature_names.pkl")
print(f"\nTotal features saved: {len(all_feature_names)}")
print(f"Total samples       : {X_combined.shape[0]}")

