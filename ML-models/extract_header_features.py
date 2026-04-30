# import pandas as pd
# import numpy as np
# import re
# import os

# # ── Load clean dataset ─────────────────────────────────────────
# BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
# SAVE_DIR  = os.path.join(BASE_DIR, "saved")

# df = pd.read_pickle(os.path.join(SAVE_DIR, "dataset_clean.pkl"))
# print(f"✓ Dataset loaded : {df.shape}")

# # ══════════════════════════════════════════════════════════════
# #  HELPER LISTS
# # ══════════════════════════════════════════════════════════════

# FREE_PROVIDERS = [
#     "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
#     "aol.com", "mail.com", "protonmail.com", "web.de",
#     "yandex.com", "icloud.com", "gmx.com", "zoho.com"
# ]

# SUSPICIOUS_TLDS = [
#     ".xyz", ".top", ".tk", ".ml", ".ga", ".cf",
#     ".click", ".link", ".work", ".party", ".gq", ".zip",
#     ".ru", ".cn", ".pw", ".ws"
# ]

# URGENT_WORDS = [
#     "urgent", "verify", "suspended", "action required",
#     "confirm", "immediately", "limited", "warning", "alert",
#     "unusual", "unauthorized", "blocked", "expire",
#     "update your", "winner", "prize", "congratulations",
#     "free", "offer", "discount", "security", "password"
# ]

# # ══════════════════════════════════════════════════════════════
# #  HELPER FUNCTIONS
# # ══════════════════════════════════════════════════════════════

# def get_domain(email_address):
#     """Extract domain from an email address string."""
#     if not email_address or not isinstance(email_address, str):
#         return ""
#     match = re.findall(r'@([\w.\-]+)', email_address)
#     return match[0].lower().strip() if match else ""


# def get_tld(domain):
#     """Extract TLD from domain e.g. 'mail.evil.xyz' → '.xyz' """
#     if not domain:
#         return ""
#     parts = domain.split(".")
#     return "." + parts[-1] if len(parts) >= 2 else ""


# # ══════════════════════════════════════════════════════════════
# #  HEADER FEATURE EXTRACTION
# # ══════════════════════════════════════════════════════════════

# def extract_header_features(row):
#     features = {}

#     sender        = str(row['sender'])  if pd.notna(row['sender'])  else ''
#     subject       = str(row['subject']) if pd.notna(row['subject']) else ''
#     subject_lower = subject.lower()
#     from_domain   = get_domain(sender)
#     tld           = get_tld(from_domain)

#     # ──────────────────────────────────────────────────────────
#     #  BASIC BINARY FEATURES (0 or 1)
#     # ──────────────────────────────────────────────────────────

#     # 1. sender uses a free email provider
#     #    banks/companies never use gmail/yahoo for official emails
#     features['free_email'] = int(
#         any(p in from_domain for p in FREE_PROVIDERS)
#     )

#     # 2. sender domain has a suspicious TLD
#     #    .tk .xyz .ru are heavily abused by phishers
#     features['suspicious_tld'] = int(
#         tld in SUSPICIOUS_TLDS
#     )

#     # 3. sender address is an IP instead of a real domain
#     #    e.g. From: user@192.168.1.1  → almost always malicious
#     features['sender_is_ip'] = int(
#         bool(re.match(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}',
#                       from_domain))
#     )

#     # 4. sender field is completely missing or empty
#     #    legitimate emails always have a sender
#     features['missing_sender'] = int(
#         from_domain == ''
#     )

#     # 5. subject line contains urgent/alarm words
#     #    "verify your account", "urgent action required" etc.
#     features['subject_urgent'] = int(
#         any(w in subject_lower for w in URGENT_WORDS)
#     )

#     # 6. subject is written in ALL CAPS
#     #    shouting is a classic spam/phishing trick
#     alpha_chars = [c for c in subject if c.isalpha()]
#     features['subject_all_caps'] = int(
#         len(alpha_chars) > 3 and
#         all(c.isupper() for c in alpha_chars)
#     )

#     # 7. subject has excessive punctuation !!! or ???
#     #    "YOU WON!!!" "Act NOW???" are strong spam signals
#     features['subject_excess_punct'] = int(
#         len(re.findall(r'[!?]{2,}', subject)) > 0
#     )

#     # 8. subject contains numbers (often used in phishing)
#     #    "Account #4829 suspended" "Win $1000"
#     features['subject_has_numbers'] = int(
#         bool(re.search(r'\d+', subject))
#     )

#     # 9. sender name and domain look mismatched
#     #    e.g. "PayPal Support" <noreply@evil123.com>
#     #    we check if a known brand name appears in the
#     #    display name but the domain is not that brand
#     KNOWN_BRANDS = [
#         "paypal", "amazon", "apple", "microsoft", "google",
#         "facebook", "netflix", "bank", "ebay", "dhl"
#     ]
#     display_name = sender.lower().split('<')[0]
#     actual_domain = from_domain.lower()
#     features['name_domain_mismatch'] = int(
#         any(
#             brand in display_name and brand not in actual_domain
#             for brand in KNOWN_BRANDS
#         )
#     )

#     # 10. subject length — very short or empty subjects
#     #     are often used in phishing to avoid filters
#     features['subject_length'] = len(subject)

#     # 11. sender domain length — phishers use very long
#     #     or very short random domains like "xj2k.com"
#     features['sender_domain_length'] = len(from_domain)

#     # ──────────────────────────────────────────────────────────
#     #  ENGINEERED SCORE FEATURES
#     # ──────────────────────────────────────────────────────────

#     # 12. auth_score — simulated authentication failure score
#     #     since our dataset has no raw SPF/DKIM/DMARC headers
#     #     we approximate from what we can observe:
#     #     missing sender + IP sender + urgent subject
#     #     each contributes 1 point (0 = clean, 3 = very suspicious)
#     features['auth_score'] = (
#         features['missing_sender'] +
#         features['sender_is_ip'] +
#         int(features['free_email'] == 1 and
#             features['subject_urgent'] == 1)
#     )

#     # 13. domain_mismatch_score — how many domain-level
#     #     red flags are triggered at once (0 = clean, 3 = bad)
#     features['domain_mismatch_score'] = (
#         features['free_email'] +
#         features['suspicious_tld'] +
#         features['sender_is_ip']
#     )

#     # 14. risk_score — overall header danger level
#     #     weighted sum of the most important signals
#     #     scale: 0 (safe) to 10 (very dangerous)
#     features['risk_score'] = (
#         features['subject_urgent']        * 2 +
#         features['name_domain_mismatch']  * 2 +
#         features['free_email']            * 1 +
#         features['suspicious_tld']        * 2 +
#         features['sender_is_ip']          * 2 +
#         features['subject_excess_punct']  * 1
#     )

#     return features


# # ══════════════════════════════════════════════════════════════
# #  RUN ON FULL DATASET
# # ══════════════════════════════════════════════════════════════

# print("\nExtracting header features...")

# header_rows = []
# for i, row in df.iterrows():
#     f = extract_header_features(row)
#     f['label'] = row['label']           # keep the label!
#     header_rows.append(f)

#     if (i + 1) % 500 == 0:
#         print(f"  Processed {i+1} / {len(df)}...")

# header_df = pd.DataFrame(header_rows)

# print(f"\n✓ Done!")
# print(f"  Shape   : {header_df.shape}")
# print(f"  Features: {[c for c in header_df.columns if c != 'label']}")

# # ── Quick sanity check ────────────────────────────────────────
# print(f"\n=== FEATURE AVERAGES (phishing vs legit) ===")
# print(header_df.groupby('label').mean().round(3).T.to_string())

# # ── Save ──────────────────────────────────────────────────────
# header_df.to_pickle(os.path.join(SAVE_DIR, "header_features.pkl"))
# header_df.to_csv(os.path.join(SAVE_DIR, "header_features.csv"), index=False)

# print(f"\n✓ Saved → saved/header_features.pkl")
# print(f"✓ Saved → saved/header_features.csv  ← open this to inspect")




##### Corrected version 

import pandas as pd
import re
import os

# ── Load dataset ─────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR  = os.path.join(BASE_DIR, "saved")

df = pd.read_pickle(os.path.join(SAVE_DIR, "dataset_clean.pkl"))
print(f"✓ Dataset loaded : {df.shape}")

# ─────────────────────────────────────────────────────────
# HELPER LISTS (kept but minimal)
# ─────────────────────────────────────────────────────────

FREE_PROVIDERS = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com"
]

SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".tk", ".ml", ".ga", ".cf",
    ".click", ".link", ".work", ".party", ".gq"
]

# ─────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ─────────────────────────────────────────────────────────

def get_domain(email_address):
    if not email_address or not isinstance(email_address, str):
        return ""
    match = re.findall(r'@([\w\.-]+)', email_address)
    return match[0].lower().strip() if match else ""


def get_tld(domain):
    if not domain:
        return ""
    parts = domain.split(".")
    return "." + parts[-1] if len(parts) >= 2 else ""


def extract_words(text):
    return re.findall(r"[a-z]+", text.lower())


def name_domain_mismatch(sender):
    """
    Automatic similarity check between sender name and domain
    No hardcoded brand list
    """
    if not sender:
        return 0

    sender = sender.lower()

    # Extract display name and domain
    parts = sender.split('<')
    display_name = parts[0] if len(parts) > 1 else sender

    domain_match = re.findall(r'@([\w\.-]+)', sender)
    domain = domain_match[0] if domain_match else ""

    domain_words = extract_words(domain)
    name_words   = extract_words(display_name)

    # Overlap between words
    overlap = set(name_words) & set(domain_words)

    return int(len(overlap) == 0 and len(name_words) > 0)


# ─────────────────────────────────────────────────────────
# FEATURE EXTRACTION
# ─────────────────────────────────────────────────────────

def extract_header_features(row):
    features = {}

    sender = str(row['sender']) if pd.notna(row['sender']) else ''
    domain = get_domain(sender)
    tld    = get_tld(domain)

    # Basic features
    # features['free_email'] = int(any(p in domain for p in FREE_PROVIDERS))
    ## this is the corrected version 
    features['free_email'] = int(
    any(domain.endswith(p) for p in FREE_PROVIDERS)
)
    features['suspicious_tld'] = int(tld in SUSPICIOUS_TLDS)
    features['sender_is_ip'] = int(bool(re.match(r'\d{1,3}(\.\d{1,3}){3}', domain)))
    features['missing_sender'] = int(domain == '')
    features['name_domain_mismatch'] = name_domain_mismatch(sender)
    features['sender_domain_length'] = len(domain)

    return features


# ─────────────────────────────────────────────────────────
# APPLY TO DATASET
# ─────────────────────────────────────────────────────────

print("\nExtracting header features...")

rows = []
for i, row in df.iterrows():
    f = extract_header_features(row)
    f['label'] = row['label']
    rows.append(f)

    if (i + 1) % 500 == 0:
        print(f"Processed {i+1}/{len(df)}")

header_df = pd.DataFrame(rows)

print("\n✓ Done!")
print(header_df.head())

# ── Save ─────────────────────────────────────────
os.makedirs(SAVE_DIR, exist_ok=True)

header_df.to_pickle(os.path.join(SAVE_DIR, "header_features.pkl"))
header_df.to_csv(os.path.join(SAVE_DIR, "header_features.csv"), index=False)

print("\n✓ Saved header features")