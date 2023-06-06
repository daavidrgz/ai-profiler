## parse pan data.
import tqdm
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
from tfidf_kingdom import *
import json
import pandas as pd


def parse_feeds(fname, labels_file, train_threshold, all=False):
    cntx = 0
    documents = {}
    train_labels_d = {}
    test_labels_d = {}
    print("Parsing labels..")
    with open(labels_file) as lf:
        for line in lf:
            cntx += 1
            lab_di = json.loads(line)
            if cntx < train_threshold:
                train_labels_d[lab_di['id']] = lab_di
            else:
                test_labels_d[lab_di['id']] = lab_di
                
    print("Parsing feeds..")
    with open(fname) as fnx:
        for line in tqdm.tqdm(fnx, total=cntx):
            lx = json.loads(line)
            tokens_word = " ".join(lx['text'][0:args.num_samples])
            documents[lx['id']] = tokens_word

    vectorizer = TfidfVectorizer(max_features=200000)
    train_documents = []
    train_labels = []
    test_documents = []
    test_labels = []

    ## correct order
    for k, v in documents.items():
        if k in train_labels_d:
            train_documents.append(v)
            train_labels.append(train_labels_d[k])
        else:
            test_documents.append(v)
            test_labels.append(test_labels_d[k])

    ## pan features
    print("Computing MM")
    train_df = build_dataframe(train_documents)
    test_df = build_dataframe(test_documents)
    print('Dataframe built')

    if not all:
        vectorizer = get_tfidf_features(train_df)
        feature_matrix = vectorizer.transform(train_df)
        test_feature_matrix = vectorizer.transform(test_df)
        print("Num features: ", feature_matrix.shape[1])
        print('Dataframe vectorized')
        full_vectorizer = vectorizer

    if all:
        all_df = pd.concat([train_df, test_df])
        full_vectorizer = get_tfidf_features(all_df)
        feature_matrix = full_vectorizer.transform(all_df)
        test_feature_matrix = full_vectorizer.transform(test_df)
        train_labels = train_labels + test_labels
        print("Num final features: ", feature_matrix.shape[1])

    return (feature_matrix, test_feature_matrix, train_labels, test_labels, full_vectorizer)


if __name__ == "__main__":
    from scipy import io
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--num_samples", default=100, type=int, help="How many tweets per author to take")
    parser.add_argument('--train_corpus', type=str, default='../../data/pan19-celebrity-profiling-training-dataset-2019-01-31/feeds.ndjson', help='Path to PAN train corpus')
    parser.add_argument('--train_labels', type=str,default="../../data/pan19-celebrity-profiling-training-dataset-2019-01-31/labels.ndjson", help='Path to PAN train labels')
    parser.add_argument('--feature_folder', type=str, default="../train_data", help='Path to output feature folder')
    parser.add_argument('--all_data', action='store_true', help='Use all data for trainining. Set this to False if you want to conduct evaluation on the train data. If False, '
                             '3837 instances will be removed from the train set and used as a validation set')
    args = parser.parse_args()
    data_inpt = args.train_corpus
    num_train = 10000
    labels_inpt = args.train_labels
    datafolder = args.feature_folder
    a = parse_feeds(data_inpt, labels_inpt, train_threshold=num_train, all=args.all_data)

    train_instances, test_instances, train_labels, test_labels, vectorizer = a
    out_obj = {"train_features": train_instances, "test_features": test_instances}

    outfile = open(datafolder + "/train_labels.pickle", 'wb')
    pickle.dump(train_labels, outfile)
    outfile.close()

    outfile = open(datafolder + "/test_labels.pickle", 'wb')
    pickle.dump(test_labels, outfile)
    outfile.close()

    outfile = open(datafolder + "/vectorizer.pickle", 'wb')
    pickle.dump(vectorizer, outfile)
    outfile.close()
    io.savemat(datafolder + "/train_instances.mat", out_obj)

