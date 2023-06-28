## parse pan data.
import tqdm 
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
from tfidf_kingdom import *
import json
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from os import listdir
from os.path import isfile, join
import pandas as pd
import argparse
import os

def read_gender(text_path):

    truth_train = join(text_path, 'truth-train.txt')
    truth_dev = join(text_path, 'truth-dev.txt')

    files = [join(text_path, f) for f in listdir(text_path) if isfile(join(text_path, f)) and f.endswith('xml')]

    train_dict = {}
    test_dict = {}



    for line in open(truth_train):
        l = line.split(':::')
        train_dict[l[0]] = (l[1].strip(), l[2].strip())
    for line in open(truth_dev):
        l = line.split(':::')
        test_dict[l[0]] = (l[1].strip(), l[2].strip())

    train_documents = []
    train_labels = []
    test_documents = []
    test_labels = []

    gender_train_documents = []
    gender_train_labels = []
    gender_test_documents = []
    gender_test_labels = []

    for file in files:
        name = file.split('.')[-2].split('/')[-1]
        try:
            tree = ET.parse(file)
        except:
            continue
        root = tree.getroot()

        if name in train_dict:
            type, gender = train_dict[name]
        if name in test_dict:
            type, gender = test_dict[name]

        concatenated_text = ""
        for document in root.iter('document'):
            if document.text:
                txt = beautify(document.text)
                tweet = txt.replace("\n", " ").replace("\t", " ")
                concatenated_text += tweet + "\n"

        # remove empty strings
        if concatenated_text:
            if name in train_dict:
                if type != 'bot':
                    gender_train_documents.append(concatenated_text.strip())
                    gender_train_labels.append({'type': type, 'gender': gender})
                train_documents.append(concatenated_text.strip())
                train_labels.append({'type':type, 'gender': gender})
            if name in test_dict:
                if type != 'bot':
                    gender_test_documents.append(concatenated_text.strip())
                    gender_test_labels.append({'type': type, 'gender': gender})
                test_documents.append(concatenated_text.strip())
                test_labels.append({'type': type, 'gender': gender})
        else:
            print(name)

    print('Train size: ', len(train_documents))
    print('Val size: ', len(test_documents))
    return train_documents, train_labels, test_documents, test_labels, gender_train_documents, gender_train_labels, gender_test_documents, gender_test_labels

# remove html tags, used in PAN corpora
def beautify(text):
    return BeautifulSoup(text, 'html.parser').get_text()


def parse_feeds(fname, all=False):
    train_documents, train_labels, test_documents, test_labels,  gender_train_documents, gender_train_labels, gender_test_documents, gender_test_labels = read_gender(fname)

    print(train_labels)


    # bot features
    print("Bot vectorizer")
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
        #final model
        all_df = pd.concat([train_df, test_df])
        full_vectorizer = get_tfidf_features(all_df)
        feature_matrix = full_vectorizer.transform(all_df)
        test_feature_matrix = full_vectorizer.transform(test_df)
        train_labels = train_labels + test_labels
        print("Num final features: ", feature_matrix.shape[1])

    #gender features
    print("Gender vectorizer")
    print("Computing MM")
    gender_train_df = build_dataframe(gender_train_documents)
    gender_test_df = build_dataframe(gender_test_documents)
    print('Dataframe built')

    if not all:
        gender_vectorizer = get_tfidf_features(gender_train_df)
        gender_feature_matrix = gender_vectorizer.transform(gender_train_df)
        gender_test_feature_matrix = gender_vectorizer.transform(gender_test_df)
        print("Num features: ", gender_feature_matrix.shape[1])
        print('Dataframe vectorized')
        gender_full_vectorizer = gender_vectorizer

    if all:
        #final model
        gender_all_df = pd.concat([gender_train_df, gender_test_df])
        gender_full_vectorizer = get_tfidf_features(gender_all_df)
        gender_feature_matrix = gender_full_vectorizer.transform(gender_all_df)
        gender_test_feature_matrix = gender_full_vectorizer.transform(gender_test_df)
        gender_train_labels = gender_train_labels + gender_test_labels
        print("Num final features: ", gender_feature_matrix.shape[1])
    
    return (feature_matrix, test_feature_matrix, train_labels, test_labels, full_vectorizer), (gender_feature_matrix, gender_test_feature_matrix, gender_train_labels, gender_test_labels, gender_full_vectorizer)
    
if __name__ == "__main__":

    from scipy import io


    parser = argparse.ArgumentParser()
    parser.add_argument('--train_corpus', type=str,
                        default="../../data/pan19-author-profiling-training-2019-02-18/",
                        help='Path to PAN train corpus')
    parser.add_argument('--feature_folder', type=str, default="../train_data", help='Path to output feature folder')
    args = parser.parse_args()

    if not os.path.exists(args.feature_folder):
        os.makedirs(args.feature_folder)

    for lang in ['en', 'es']:
        data_path = os.path.join(args.train_corpus, lang)
        bot, gender = parse_feeds(data_path, all=False)
        task = "bot"
        train_instances,test_instances, train_labels,test_labels,vectorizer = bot
        out_obj = {"train_features":train_instances,"test_features":test_instances}

        outfile = open(args.feature_folder + "/train_labels_" + task + "_" + lang + ".pickle",'wb')
        pickle.dump(train_labels,outfile)
        outfile.close()

        outfile = open(args.feature_folder + "/test_labels_" + task + "_" + lang + ".pickle",'wb')
        pickle.dump(test_labels,outfile)
        outfile.close()

        outfile = open(args.feature_folder + "/vectorizer_" + task + "_" + lang + ".pickle",'wb')
        pickle.dump(vectorizer,outfile)
        outfile.close()
        io.savemat(args.feature_folder + "/train_instances_" + task + "_" + lang + ".mat",out_obj)

        task = "gender"
        train_instances, test_instances, train_labels, test_labels, vectorizer = gender
        out_obj = {"train_features": train_instances, "test_features": test_instances}

        outfile = open(args.feature_folder + "/train_labels_" + task + "_" + lang + ".pickle", 'wb')
        pickle.dump(train_labels, outfile)
        outfile.close()

        outfile = open(args.feature_folder + "/test_labels_" + task + "_" + lang + ".pickle", 'wb')
        pickle.dump(test_labels, outfile)
        outfile.close()

        outfile = open(args.feature_folder + "/vectorizer_" + task + "_" + lang + ".pickle", 'wb')
        pickle.dump(vectorizer, outfile)
        outfile.close()
        io.savemat(args.feature_folder + "/train_instances_" + task + "_" + lang + ".mat", out_obj)

