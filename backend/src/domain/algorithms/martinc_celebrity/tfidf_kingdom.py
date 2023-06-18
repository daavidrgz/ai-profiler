from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer, TfidfTransformer
import pandas as pd
from nltk.corpus import stopwords
import re
import string

from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import FeatureUnion
from sklearn import pipeline
from sklearn.preprocessing import Normalizer
from sklearn import preprocessing
import numpy

numpy.random.seed()


def remove_punctuation(text):
    table = text.maketrans({key: None for key in string.punctuation})
    text = text.translate(table)
    return text


def remove_stopwords(text):
    stops = set(stopwords.words("english"))
    text = text.split()
    text = [x.lower() for x in text if x.lower() not in stops]
    return " ".join(text)


def remove_mentions(text, replace_token):
    return re.sub(r"(?:@[\w_]+)", replace_token, text)


def remove_hashtags(text, replace_token):
    return re.sub(r"(?:\#+[\w_]+[\w\'_\-]*[\w_]+)", replace_token, text)


def remove_url(text, replace_token):
    regex = (
        "http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+"
    )
    return re.sub(regex, replace_token, text)


def get_affix(text):
    return " ".join([word[-4:] if len(word) >= 4 else word for word in text.split()])


def affix_punct(text):
    punct = '!"$%&()*+,-./:;<=>?[\]^_`{|}~'
    ngrams = []
    for i, _ in enumerate(text[0:-2]):
        ngram = text[i : i + 3]
        if ngram[0] in punct:
            for p in punct:
                if p in ngram[1:]:
                    break
            else:
                ngrams.append(ngram)
    return "###".join(ngrams)


def affix_punct_tokenize(text):
    tokens = text.split("###")
    return tokens


class text_col(BaseEstimator, TransformerMixin):
    def __init__(self, key):
        self.key = key

    def fit(self, x, y=None):
        return self

    def transform(self, data_dict):
        return data_dict[self.key]


# fit and transform numeric features, used in scikit Feature union
class digit_col(BaseEstimator, TransformerMixin):
    def fit(self, x, y=None):
        return self

    def transform(self, hd_searches):
        d_col_drops = [
            "text",
            "no_punctuation",
            "no_stopwords",
            "text_clean",
            "affixes",
            "affix_punct",
        ]
        hd_searches = hd_searches.drop(d_col_drops, axis=1).values
        scaler = preprocessing.MinMaxScaler().fit(hd_searches)
        return scaler.transform(hd_searches)


def build_dataframe(data_docs):
    df_data = pd.DataFrame({"text": data_docs})
    df_data["text_clean_r"] = df_data["text"].map(
        lambda x: remove_hashtags(x, "#HASHTAG")
    )
    df_data["text_clean_r"] = df_data["text_clean_r"].map(
        lambda x: remove_url(x, "HTTPURL")
    )
    df_data["text_clean_r"] = df_data["text_clean_r"].map(
        lambda x: remove_mentions(x, "@MENTION")
    )
    df_data["text_clean"] = df_data["text"].map(lambda x: remove_hashtags(x, ""))
    df_data["text_clean"] = df_data["text_clean"].map(lambda x: remove_url(x, ""))
    df_data["text_clean"] = df_data["text_clean"].map(lambda x: remove_mentions(x, ""))

    df_data["no_punctuation"] = df_data["text_clean"].map(
        lambda x: remove_punctuation(x)
    )
    df_data["no_stopwords"] = df_data["no_punctuation"].map(
        lambda x: remove_stopwords(x)
    )
    df_data["text_clean"] = df_data["text_clean_r"]
    df_data = df_data.drop("text_clean_r", axis=1)
    df_data["affixes"] = df_data["text_clean"].map(lambda x: get_affix(x))
    return df_data


def get_tfidf_features(
    df_data, cst=0.3, unigram=0.8, bigram=0.1, character=0.8, affixes=0.3
):
    tfidf_unigram = TfidfVectorizer(
        ngram_range=(1, 1), sublinear_tf=True, min_df=5, max_df=0.8
    )
    # tfidf_bigram = TfidfVectorizer(ngram_range=(2, 2), sublinear_tf=False, min_df=20, max_df=0.5)
    character_vectorizer = CountVectorizer(
        analyzer="char_wb", ngram_range=(4, 4), lowercase=False, min_df=20, max_df=0.7
    )
    tfidf_ngram = TfidfVectorizer(
        ngram_range=(1, 1), sublinear_tf=True, min_df=0.1, max_df=0.8
    )
    tfidf_transformer = TfidfTransformer(sublinear_tf=True)

    features = [  # ('cst', digit_col()),
        (
            "unigram",
            pipeline.Pipeline(
                [("s1", text_col(key="no_stopwords")), ("tfidf_unigram", tfidf_unigram)]
            ),
        ),
        # ('bigram', pipeline.Pipeline([('s2', text_col(key='no_punctuation')), ('tfidf_bigram', tfidf_bigram)])),
        #                   ('tag', pipeline.Pipeline([('s4', text_col(key='pos_tag')), ('tfidf_pos', tfidf_pos)])),
        (
            "character",
            pipeline.Pipeline(
                [
                    ("s5", text_col(key="text_clean")),
                    ("character_vectorizer", character_vectorizer),
                    ("tfidf_character", tfidf_transformer),
                ]
            ),
        ),
        (
            "affixes",
            pipeline.Pipeline(
                [("s5", text_col(key="affixes")), ("tfidf_ngram", tfidf_ngram)]
            ),
        ),
    ]
    weights = {  #'cst': cst,
        "unigram": unigram,
        #'bigram': bigram,
        "character": character,
        "affixes": affixes,
    }
    matrix = pipeline.Pipeline(
        [
            (
                "union",
                FeatureUnion(
                    transformer_list=features, transformer_weights=weights, n_jobs=1
                ),
            ),
            ("scale", Normalizer()),
        ]
    )

    tokenizer = matrix.fit(df_data)
    return tokenizer
