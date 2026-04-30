import pandas as pd
import os
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import save_npz, hstack

# ── Load dataset ─────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR  = os.path.join(BASE_DIR, "saved")

df = pd.read_pickle(os.path.join(SAVE_DIR, "dataset_clean.pkl"))
print(f"✓ Dataset loaded : {df.shape}")

# ─────────────────────────────────────────────────────────
# PREPARE TEXT (Body + Subject combined)
# ─────────────────────────────────────────────────────────

# Combine body AND subject for richer features
df['combined_text'] = df['subject'].fillna('') + " " + df['body'].fillna('')

texts = df['combined_text']

# Labels
labels = df['label']

print(f"\n✓ Text prepared for {len(texts)} emails")

# ─────────────────────────────────────────────────────────
# TF-IDF FEATURE EXTRACTION (FULLY AUTOMATIC)
# ─────────────────────────────────────────────────────────

vectorizer = TfidfVectorizer(
    stop_words='english',        # Remove common words automatically
    max_features=5000,           # Top 5000 most important words
    ngram_range=(1, 3),          # Unigrams, bigrams, AND trigrams
    min_df=3,                    # Ignore words appearing in <3 emails
    max_df=0.8,                  # Ignore words appearing in >80% of emails
    use_idf=True,                # Use IDF weighting
    smooth_idf=True,             # Smooth IDF weights
    sublinear_tf=True            # Use 1+log(tf)
)

print("\nExtracting TF-IDF features...")
X_text = vectorizer.fit_transform(texts)

print(f"\n✓ TF-IDF complete!")
print(f"  Shape: {X_text.shape}")
print(f"  Features: {len(vectorizer.get_feature_names_out())}")

# ─────────────────────────────────────────────────────────
# DISPLAY TOP FEATURES (to verify quality)
# ─────────────────────────────────────────────────────────

# Get feature names
feature_names = vectorizer.get_feature_names_out()

# Calculate mean TF-IDF per feature to see importance
mean_tfidf = X_text.mean(axis=0).A1
top_indices = mean_tfidf.argsort()[-30:][::-1]

print("\n=== TOP 30 MOST IMPORTANT WORDS (by avg TF-IDF) ===")
for i, idx in enumerate(top_indices, 1):
    print(f"  {i:2}. {feature_names[idx]}")

# ─────────────────────────────────────────────────────────
# SAVE FEATURES
# ─────────────────────────────────────────────────────────

# Save vectorizer for later use
with open(os.path.join(SAVE_DIR, "tfidf_vectorizer.pkl"), "wb") as f:
    pickle.dump(vectorizer, f)

# Save TF-IDF sparse matrix
save_npz(os.path.join(SAVE_DIR, "body_tfidf.npz"), X_text)

# Save labels
labels.to_csv(os.path.join(SAVE_DIR, "labels.csv"), index=False)

print("\n✓ Saved:")
print(f"  - tfidf_vectorizer.pkl")
print(f"  - body_tfidf.npz (sparse matrix)")
print(f"  - labels.csv")

# ─────────────────────────────────────────────────────────
# OPTIONAL: Extract additional RAW numeric features
# ─────────────────────────────────────────────────────────

print("\nExtracting additional raw features...")

def extract_numeric_features(row):
    """Extract raw numeric features from email (no engineered scores)"""
    body = str(row['body']) if pd.notna(row['body']) else ''
    subject = str(row['subject']) if pd.notna(row['subject']) else ''
    text = body + " " + subject
    
    features = {
        # Length features
        'body_length_chars': len(body),
        'body_length_words': len(body.split()),
        'subject_length_chars': len(subject),
        'subject_length_words': len(subject.split()),
        
        # Punctuation features
        'exclamation_count': text.count('!'),
        'question_mark_count': text.count('?'),
        'special_char_count': len([c for c in text if not c.isalnum() and not c.isspace()]),
        
        # Capitalization
        'capital_ratio': sum(1 for c in text if c.isupper()) / max(len(text), 1),
        
        # URL features
        'num_urls': len(re.findall(r'https?://', text)),
        'has_ip_url': 1 if re.search(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', text) else 0,
        
        # HTML features
        'has_html': 1 if '<' in text and '>' in text else 0,
        'has_form': 1 if '<form' in text.lower() else 0,
    }
    
    return features

import re
print("Extracting numeric features...")
numeric_features = df.apply(extract_numeric_features, axis=1).tolist()
numeric_df = pd.DataFrame(numeric_features)

print(f"✓ Numeric features shape: {numeric_df.shape}")
print(f"  Features: {list(numeric_df.columns)}")

# ─────────────────────────────────────────────────────────
# SAVE NUMERIC FEATURES
# ─────────────────────────────────────────────────────────

numeric_df.to_csv(os.path.join(SAVE_DIR, "numeric_features.csv"), index=False)
numeric_df.to_pickle(os.path.join(SAVE_DIR, "numeric_features.pkl"))

print("\n✓ Saved numeric features:")
print(f"  - numeric_features.csv")
print(f"  - numeric_features.pkl")

# ─────────────────────────────────────────────────────────
# FINAL SUMMARY
# ─────────────────────────────────────────────────────────

print("\n" + "="*50)
print("FINAL FEATURE SUMMARY")
print("="*50)
print(f"\nTOTAL FEATURES FOR MODEL:")
print(f"  - TF-IDF features: {X_text.shape[1]}")
print(f"  - Numeric features: {len(numeric_df.columns)}")
print(f"  - TOTAL: {X_text.shape[1] + len(numeric_df.columns)}")
print(f"\n  - Total samples: {len(df)}")
print(f"  - Phishing: {(labels==1).sum()}")
print(f"  - Legitimate: {(labels==0).sum()}")

print("\n✓ Ready for model training!")
print("  Load with:")
print("    from scipy.sparse import load_npz")
print("    X_text = load_npz('saved/body_tfidf.npz')")
print("    X_numeric = pd.read_pickle('saved/numeric_features.pkl')")
print("    y = pd.read_csv('saved/labels.csv').values.ravel()")