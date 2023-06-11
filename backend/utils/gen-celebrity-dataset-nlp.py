import spacy
import numpy as np
import pandas as pd

nlp = spacy.load("en_core_web_sm")

feeds = pd.read_json("datasets/celebrity-test/feeds.ndjson", lines=True)
labels = pd.read_json("datasets/celebrity-test/labels.ndjson", lines=True)
df = pd.DataFrame(
    columns=["adjectives", "nouns", "verbs", "sentences", "birthyear", "post"]
)

all_adjectives = np.array([]).astype(np.int32)
all_nouns = np.array([]).astype(np.int32)
all_verbs = np.array([]).astype(np.int32)
all_sentences = np.array([]).astype(np.int32)
all_birthyears = np.array([]).astype(np.int32)
all_posts = np.array([]).astype(str)

num_feeds = len(feeds)
for feed_idx, feed in feeds.iterrows():
    print(f"{feed_idx+1}/{num_feeds}")

    celebrity_id, posts = feed
    num_posts = len(posts)
    adjectives = np.zeros(num_posts).astype(np.int32)
    nouns = np.zeros(num_posts).astype(np.int32)
    verbs = np.zeros(num_posts).astype(np.int32)
    sentences = np.zeros(num_posts).astype(np.int32)

    birthyear = labels[labels["id"] == celebrity_id].birthyear
    birthyears = np.full(num_posts, birthyear)

    for idx, post in enumerate(posts):
        # print(f"{idx+1}/{num_posts}")1
        doc = nlp(post)
        adjectives[idx] = len([token for token in doc if token.pos_ == "ADJ"])
        nouns[idx] = len([chunk for chunk in doc.noun_chunks])
        verbs[idx] = len([token for token in doc if token.pos_ == "VERB"])
        sentences[idx] = len(list(doc.sents))

    all_adjectives = np.append(all_adjectives, adjectives)
    all_nouns = np.append(all_nouns, nouns)
    all_verbs = np.append(all_verbs, verbs)
    all_sentences = np.append(all_sentences, sentences)
    all_birthyears = np.append(all_birthyears, birthyears)
    all_posts = np.append(all_posts, np.array(posts).astype(str))

df["adjectives"] = all_adjectives
df["nouns"] = all_nouns
df["verbs"] = all_verbs
df["sentences"] = all_sentences
df["birthyear"] = all_birthyears
df["post"] = all_posts

df.to_csv("celebrity-dataset.csv", index=False)
