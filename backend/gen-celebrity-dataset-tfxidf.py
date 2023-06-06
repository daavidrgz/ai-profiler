import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import pandas as pd
import spacy

en = spacy.load("en_core_web_sm")
stopwords = en.Defaults.stop_words


def preprocess_text(text):
    # Remove all retweets
    text = re.sub(r"RT @\w+: ", "", text)

    # Replace all mentions by "<user>"
    text = re.sub(r"@\w+", "<user>", text)

    # Replace all hashtags by "<hashtag>"
    text = re.sub(r"#\w+", "<hashtag>", text)

    # Substitute multiple spaces by a single space
    text = re.sub(r"\s+", " ", text)

    # Replace urls by "<url>"
    text = re.sub(r"http\S+", "<url>", text)

    # remove punctuation
    text = text.translate(dict.fromkeys(map(ord, "\"',./:;?[\]^_`{|}~")))

    # lowercase
    text = text.lower()

    # Remove stopwords
    text = " ".join([word for word in text.split() if word not in stopwords])

    return text


feeds = pd.read_json("datasets/celebrity-test/feeds.ndjson", lines=True)
labels = pd.read_json("datasets/celebrity-test/labels.ndjson", lines=True)

all_posts = []

num_feeds = len(feeds)
for feed_idx, feed in feeds.iterrows():
    if feed_idx > 10:
        break

    celebrity_id, posts = feed
    num_posts = len(posts)

    birthyear = labels[labels["id"] == celebrity_id].birthyear

    for idx, post in enumerate(posts):
        if idx > 200:
            break

        all_posts.append(post)


tfidf_vectorizer = TfidfVectorizer(
    preprocessor=preprocess_text,
    ngram_range=(2, 2),
    max_features=1000,
    lowercase=True,
    analyzer="word",
    token_pattern=r"(?u)\b\w\w+\b",
)
doc_vec = tfidf_vectorizer.fit_transform(all_posts)
df2 = pd.DataFrame(doc_vec.toarray())
df2.columns = tfidf_vectorizer.get_feature_names_out()


df2.to_csv("datasets/celebrity-dataset-tfxidf.csv", index=False)
