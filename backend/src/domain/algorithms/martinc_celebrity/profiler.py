import os
import pickle
from domain.algorithms.profiling_algorithm import ProfilingAlgorithm
from domain.algorithms.martinc_celebrity.tfidf_kingdom import *
from collections import defaultdict
import joblib
import tqdm
from sklearn.feature_extraction.text import TfidfVectorizer
import json
import logging
from application.dataset import Dataset
from sklearn.metrics import f1_score
from sklearn.linear_model import LogisticRegression
import numpy as np


logger = logging.getLogger("server_logger")


class MartincCelebrity(ProfilingAlgorithm):
    NAME = "martinc_celebrity"
    
    def autoprofile(self, dataset: Dataset):
        dataset.convert_to_ndjson()
        model_folder = "./domain/algorithms/martinc_celebrity/model"

        tasks = ["gender", "fame", "occupation", "birthyear"]

        documents = {}
        document_count = 0
        for line in dataset.file:
            document_count += 1
            lx = json.loads(line)
            if isinstance(lx["text"], list):
                tokens_word = " ".join(lx["text"])
            else:
                tokens_word = lx["text"]
            documents[lx["id"]] = tokens_word

        test_documents = []
        test_ids = []

        for k, v in documents.items():
            test_documents.append(v)
            test_ids.append(k)

        test_df = build_dataframe(test_documents)
        vectorizer_file = open(model_folder + "/vectorizer.pickle", "rb")
        vectorizer = pickle.load(vectorizer_file)
        predict_features = vectorizer.transform(test_df)

        docs_dict = defaultdict(dict)

        for task in tasks:
            encoder_file = open(model_folder + "/encoder_" + task + ".pickle", "rb")
            encoder = pickle.load(encoder_file)
            model = joblib.load(model_folder + "/trained_LR_" + task + ".pkl")

            predictions = model.predict(predict_features)
            predictions = encoder.inverse_transform(predictions)
            for id, pred in zip(test_ids, predictions):
                docs_dict[id][task] = pred

        output = []
        for k, v in docs_dict.items():
            output.append({"id": int(k), "result": v})

        return output

    def train(self):
        model_folder = "./domain/algorithms/martinc_celebrity/model"
        if not os.path.exists(model_folder):
            os.makedirs(model_folder)

        labels_file_path = (
            "../datasets/PAN19 - Celebrity Profiling/training/labels.ndjson"
        )
        feeds_file_path = (
            "../datasets/PAN19 - Celebrity Profiling/training/feeds.ndjson"
        )

        num_samples = 100
        train_samples = 40000
        document_count = 0
        documents = {}
        train_labels_d = {}
        validation_labels_d = {}

        logger.info("Parsing labels..")
        with open(labels_file_path) as labels_file:
            for line in labels_file:
                document_count += 1
                lab_di = json.loads(line)
                if document_count < train_samples:
                    train_labels_d[lab_di["id"]] = lab_di
                else:
                    validation_labels_d[lab_di["id"]] = lab_di

        logger.info("Parsing feeds..")
        with open(feeds_file_path) as feeds_file:
            for line in tqdm.tqdm(feeds_file, total=document_count):
                lx = json.loads(line)
                tokens_word = " ".join(lx["text"][0:num_samples])
                documents[lx["id"]] = tokens_word

        vectorizer = TfidfVectorizer(max_features=200000)
        train_documents = []
        train_labels = []
        validation_documents = []
        validation_labels = []

        for k, v in documents.items():
            if k in train_labels_d:
                train_documents.append(v)
                train_labels.append(train_labels_d[k])
            else:
                validation_documents.append(v)
                validation_labels.append(validation_labels_d[k])

        logger.info("Computing MM")
        train_df = build_dataframe(train_documents)
        validation_df = build_dataframe(validation_documents)
        logger.info("Dataframe built")

        vectorizer = get_tfidf_features(train_df)
        logger.info("Vectorizing train dataframe")
        feature_matrix = vectorizer.transform(train_df)
        logger.info("Vectorizing validation dataframe")
        test_feature_matrix = vectorizer.transform(validation_df)
        logger.info("Dataframe vectorized")

        ocupations_train = []
        gender_train = []
        fame_train = []
        birth_train = []

        ocupations_test = []
        gender_test = []
        fame_test = []
        birth_test = []

        for sample in train_labels:
            ocupations_train.append(sample["occupation"])
            gender_train.append(sample["gender"])
            fame_train.append(sample["fame"])
            birth_train.append(sample["birthyear"])

        for sample in validation_labels:
            ocupations_test.append(sample["occupation"])
            gender_test.append(sample["gender"])
            fame_test.append(sample["fame"])
            birth_test.append(sample["birthyear"])

        encoder_ocupations = preprocessing.LabelEncoder().fit(
            ocupations_train + ocupations_test
        )
        encoder_gender = preprocessing.LabelEncoder().fit(gender_train + gender_test)
        encoder_fame = preprocessing.LabelEncoder().fit(fame_train + fame_test)
        encoder_birth = preprocessing.LabelEncoder().fit(birth_train + birth_test)

        label_vectors = {}
        label_vectors["gender"] = (
            encoder_gender.transform(gender_train),
            encoder_gender.transform(gender_test),
        )
        label_vectors["occupation"] = (
            encoder_ocupations.transform(ocupations_train),
            encoder_ocupations.transform(ocupations_test),
        )
        label_vectors["fame"] = (
            encoder_fame.transform(fame_train),
            encoder_fame.transform(fame_test),
        )
        label_vectors["birthyear"] = (
            encoder_birth.transform(birth_train),
            encoder_birth.transform(birth_test),
        )

        preds = {}
        for target, vals in label_vectors.items():
            train_labels = vals[0]
            test_labels = vals[1]
            clf = LogisticRegression(C=1e2, fit_intercept=False)
            clf.fit(feature_matrix, train_labels)
            joblib.dump(clf, model_folder + "/trained_LR_{}.pkl".format(target))
            predictions = clf.predict(test_feature_matrix)

            f1 = f1_score(predictions, test_labels, average="weighted")
            logging.info("{} Performed with {}".format(target, f1))
            preds[target] = f1
        total_score = 1 / np.sum([1 / sc for sc in preds.values()])
        logging.info("Total score {}".format(total_score))

        with open(model_folder + "/encoder_occupation.pickle", "wb") as outfile:
            pickle.dump(encoder_ocupations, outfile)

        with open(model_folder + "/encoder_gender.pickle", "wb") as outfile:
            pickle.dump(encoder_gender, outfile)

        with open(model_folder + "/encoder_fame.pickle", "wb") as outfile:
            pickle.dump(encoder_fame, outfile)

        with open(model_folder + "/encoder_birthyear.pickle", "wb") as outfile:
            pickle.dump(encoder_birth, outfile)

        with open(model_folder + "/vectorizer.pickle", "wb") as outfile:
            pickle.dump(vectorizer, outfile)

        logger.info("Train finished!")
