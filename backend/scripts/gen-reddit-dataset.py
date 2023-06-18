import spacy
import numpy as np
import pandas

nlp = spacy.load("en_core_web_sm")

posts = pandas.read_csv("reddit-posts.csv")
df = pandas.DataFrame(
    columns=["num_adjectives", "num_noun_chunks", "num_verbs", "num_sentences"]
)

num_rows = len(posts)
adjectives = np.zeros(num_rows)
noun_chunks = np.zeros(num_rows)
verbs = np.zeros(num_rows)
sentences = np.zeros(num_rows)

for idx, post in posts.iterrows():
    if idx > 1000:
        break
    print(f"{idx}/{num_rows}")
    post_text = post.text
    doc = nlp(post_text)
    adjectives[idx] = len([token for token in doc if token.pos_ == "ADJ"])
    noun_chunks[idx] = len([chunk for chunk in doc.noun_chunks])
    verbs[idx] = len([token for token in doc if token.pos_ == "VERB"])
    sentences[idx] = len(list(doc.sents))

df["num_adjectives"] = adjectives
df["num_noun_chunks"] = noun_chunks
df["num_verbs"] = verbs
df["num_sentences"] = sentences
df.to_csv("reddit-posts-features.csv", index=False)
