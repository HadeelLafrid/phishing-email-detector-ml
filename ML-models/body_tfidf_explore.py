from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
from scipy.sparse import load_npz

X = load_npz("saved/body_tfidf.npz")

print(X.shape)

## output: (8873, 5000)
print(X[0])

X = load_npz("saved/body_tfidf.npz")
print(X.shape)

# Load vectorizer
with open("saved/tfidf_vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

vectorizer.get_feature_names_out()
features = vectorizer.get_feature_names_out()

print(features[123])
print(repr(features[200]))