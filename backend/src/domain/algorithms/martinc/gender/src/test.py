## parse pan data.
import tqdm
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
from .tfidf_kingdom import *
import argparse
from collections import defaultdict
import json
from sklearn.externals import joblib
import os
from os import listdir
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
import shutil

def beautify(text):
    return BeautifulSoup(text, 'html.parser').get_text()

def generate_output(path, author_id, lang, gender, type):
    root = ET.Element("author")
    root.set('id', author_id)
    root.set('lang', lang)
    root.set('type', type)
    root.set('gender', gender)
    tree = ET.ElementTree(root)
    tree.write(os.path.join(path, author_id + ".xml"))



if __name__ == '__main__':

    argparser = argparse.ArgumentParser(description='Author Profiling Evaluation')
    argparser.add_argument('-o', '--output', dest='output', type=str, default='../results',
                           help='Choose output directory')

    argparser.add_argument('-c', '--input', dest='input', type=str,
                           default='../../data/pan19-author-profiling-test-2019-02-18/',
                           help='Choose input dataset')
    argparser.add_argument('--feature_folder', type=str, default="../train_data", help='Path to output feature folder')
    args = argparser.parse_args()

    output = args.output
    input = args.input

    langs = ['en', 'es']

    for lang in langs:
        lang_path = os.path.join(input, lang)

        files = [os.path.join(lang_path, f) for f in listdir(lang_path) if os.path.isfile(os.path.join(lang_path, f)) and f.endswith('xml')]

        test_documents = []
        test_ids = []

        for file in files:
            name = file.split('.')[-2].split('/')[-1]
            try:
                tree = ET.parse(file)
            except:
                continue
            root = tree.getroot()

            concatenated_text = ""
            for document in root.iter('document'):
                if document.text:
                    txt = beautify(document.text)
                    tweet = txt.replace("\n", " ").replace("\t", " ")
                    concatenated_text += tweet + "\n"



            test_documents.append(concatenated_text.strip())
            test_ids.append(name)


        ## pan features
        print("Computing MM")
        test_df = build_dataframe(test_documents)
        vectorizer_file = open(args.feature_folder + "/vectorizer_bot_" + lang +  ".pickle", 'rb')
        vectorizer = pickle.load(vectorizer_file)
        predict_features = vectorizer.transform(test_df)



        #hierarchical evaluation
        task = 'type'
        encoder_file = open(args.feature_folder + "/encoder_bot_" + lang + ".pickle", 'rb')
        encoder = pickle.load(encoder_file)
        model = joblib.load(args.feature_folder + "/trained_LR_bot_" + lang + ".pkl")
        predictions = model.predict(predict_features)
        predictions = encoder.inverse_transform(predictions)

        human_documents = []
        human_ids = []

        if os.path.exists(os.path.join(output, lang)) and os.path.isdir(os.path.join(output, lang)):
            shutil.rmtree(os.path.join(output, lang))
        os.mkdir(os.path.join(output, lang))

        for id, pred, txt in zip(test_ids, predictions, test_documents):
             if pred == 'bot':
                 generate_output(os.path.join(output, lang), id, lang, pred, pred)
             else:
                 human_documents.append(txt)
                 human_ids.append(id)

        print("Computing MM")
        test_df = build_dataframe(human_documents)
        vectorizer_file = open(args.feature_folder + "/vectorizer_gender_" + lang +  ".pickle", 'rb')
        vectorizer = pickle.load(vectorizer_file)
        predict_features = vectorizer.transform(test_df)

        task = 'gender'
        encoder_file = open(args.feature_folder + "/encoder_" + task + "_" + lang + ".pickle", 'rb')
        encoder = pickle.load(encoder_file)
        model = joblib.load(args.feature_folder + "/trained_LR_" + task + "_" + lang + ".pkl")
        predictions = model.predict(predict_features)
        predictions = encoder.inverse_transform(predictions)

        for id, pred in zip(human_ids, predictions):
            generate_output(os.path.join(output, lang), id, lang, pred, 'human')
