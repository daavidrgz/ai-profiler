## parse pan data.
import tqdm
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
from tfidf_kingdom import *
import argparse
from collections import defaultdict
import json
import joblib
import os



def write_output(d, output_file):
    if os.path.exists(output_file):
        os.remove(output_file)
    with open(output_file, 'a', encoding='utf8') as f:
        for id, v in d.items():
            item = {"id": id, "fame": v["fame"], "occupation": v["occupation"], "gender": v["gender"], "birthyear": int(v["birthyear"])}
            v = json.dumps(item)
            f.write(v + '\n')



if __name__ == '__main__':

    argparser = argparse.ArgumentParser(description='Author Profiling Evaluation')
    argparser.add_argument('--output', dest='output', type=str, default='../results/results.json',
                           help='Choose output result directory')

    argparser.add_argument('--input', dest='input', type=str,
                           default='../../data/pan19-celebrity-profiling-test2-dataset-2019-05-02/feeds.ndjson',
                           help='Choose input test dataset')
    argparser.add_argument('--feature_folder', type=str, default="../train_data", help='Path to output feature folder')
    args = argparser.parse_args()

    output = args.output
    input = args.input

    tasks = ['gender', 'fame', 'occupation', 'birthyear']

    documents = {}
    cnt = 0
    with open(input) as fnx:
        for line in fnx:
            cnt += 1
            lx = json.loads(line)
            tokens_word = " ".join(lx['text'][0:100])
            documents[lx['id']] = tokens_word

    test_documents = []
    test_ids = []


    ## correct order
    for k, v in documents.items():
        test_documents.append(v)
        test_ids.append(k)

    test_df = build_dataframe(test_documents)
    vectorizer_file = open(args.feature_folder + "/vectorizer.pickle", 'rb')
    vectorizer = pickle.load(vectorizer_file)
    predict_features = vectorizer.transform(test_df)
    
    docs_dict = defaultdict(dict)

    for task in tasks:
        encoder_file = open(args.feature_folder + "/encoder_" + task +".pickle", 'rb')
        encoder = pickle.load(encoder_file)
        model = joblib.load(args.feature_folder + "/trained_LR_" + task +".pkl")

        predictions = model.predict(predict_features)
        predictions = encoder.inverse_transform(predictions)
        for id, pred in zip(test_ids, predictions):
            docs_dict[id][task] = pred
    write_output(docs_dict, output)

