import pandas as pd
import os

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
SAVE_PATH = os.path.join(BASE_DIR, "saved", "dataset_clean.pkl")

df = pd.read_pickle(SAVE_PATH)

print("✓ Dataset loaded")
print("Shape  :", df.shape)
print("Labels :")
print(df['label'].value_counts())