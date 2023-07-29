import os
import pickle

from os import path
from sklearn.metrics import accuracy_score
from domain.entities.profiling_algorithm import ProfilingAlgorithm
from domain.algorithms.martinc.tfidf_kingdom import *
from collections import defaultdict
import joblib
import tqdm
from sklearn.feature_extraction.text import TfidfVectorizer
import json
import logging
from domain.entities.predict_dataset import PredictDataset
from sklearn.metrics import f1_score
from sklearn.linear_model import LogisticRegression
import numpy as np
from domain.entities.train_dataset import PAN19TrainDataset, TrainDataset


logger = logging.getLogger("server_logger")


class MartincAlgorithm(ProfilingAlgorithm):
    MODEL_FOLDER = "./domain/algorithms/martinc/models"

    def __init__(self):
        name = "martinc"
        default_train_dataset = PAN19TrainDataset()
        supported_train_datasets = [PAN19TrainDataset()]
        super().__init__(name, supported_train_datasets, default_train_dataset)

    def predict(self, dataset: PredictDataset, train_dataset: TrainDataset):
        dataset.convert_to_ndjson()
        tasks = ["gender", "fame", "occupation", "age"]
        trained_model_path = path.join(self.MODEL_FOLDER, train_dataset.name)

        documents = {}
        for line in dataset.file:
            lx = json.loads(line)
            if isinstance(lx["text"], list):
                tokens_word = " ".join(lx["text"])
            else:
                tokens_word = lx["text"]

            documents[lx["id"]] = documents.get(lx["id"], "") + tokens_word

        test_documents = []
        test_ids = []

        for k, v in documents.items():
            test_documents.append(v)
            test_ids.append(k)

        test_df = build_dataframe(test_documents)
        vectorizer_file = open(path.join(trained_model_path, "vectorizer.pickle"), "rb")
        vectorizer = pickle.load(vectorizer_file)
        predict_features = vectorizer.transform(test_df)

        docs_dict = defaultdict(dict)

        for task in tasks:
            logger.info(f"Predicting {task}...")
            encoder_file = open(
                path.join(trained_model_path, f"encoder_{task}.pickle"),
                "rb",
            )
            encoder = pickle.load(encoder_file)
            model = joblib.load(path.join(trained_model_path, f"trained_LR_{task}.pkl"))

            predictions = model.predict(predict_features)
            predictions = encoder.inverse_transform(predictions)
            for id, pred in zip(test_ids, predictions):
                docs_dict[id][task] = pred

        output = []
        for k, v in docs_dict.items():
            output.append({"id": str(k), "result": v})

        logger.info("Martinc algorithm predicted successfully")

        return output

    def train(self, train_dataset: TrainDataset):
        if not path.exists(self.MODEL_FOLDER):
            os.makedirs(self.MODEL_FOLDER)

        output_model_path = path.join(self.MODEL_FOLDER, train_dataset.name)

        labels_file_path = path.join(train_dataset.train_path, "labels.ndjson")
        feeds_file_path = path.join(train_dataset.train_path, "feeds.ndjson")

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
        age_train = []

        ocupations_test = []
        gender_test = []
        fame_test = []
        age_test = []

        for sample in train_labels:
            ocupations_train.append(sample["occupation"])
            gender_train.append(sample["gender"])
            fame_train.append(sample["fame"])
            age_train.append(sample["age"])

        for sample in validation_labels:
            ocupations_test.append(sample["occupation"])
            gender_test.append(sample["gender"])
            fame_test.append(sample["fame"])
            age_test.append(sample["age"])

        encoder_ocupations = preprocessing.LabelEncoder().fit(
            ocupations_train + ocupations_test
        )
        encoder_gender = preprocessing.LabelEncoder().fit(gender_train + gender_test)
        encoder_fame = preprocessing.LabelEncoder().fit(fame_train + fame_test)
        encoder_age = preprocessing.LabelEncoder().fit(age_train + age_test)

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
        label_vectors["age"] = (
            encoder_age.transform(age_train),
            encoder_age.transform(age_test),
        )

        for target, vals in label_vectors.items():
            train_labels = vals[0]
            test_labels = vals[1]
            clf = LogisticRegression(C=1e2, fit_intercept=False)
            clf.fit(feature_matrix, train_labels)
            joblib.dump(clf, path.join(output_model_path, f"trained_LR_{target}.pkl"))
            predictions = clf.predict(test_feature_matrix)

            accuracy = accuracy_score(test_labels, predictions)
            f1 = f1_score(test_labels, predictions, average="weighted")
            logger.info(f"{target} Performed with accuracy {accuracy} and f1 {f1}")

        with open(
            path.join(output_model_path, "encoder_occupation.pickle", "wb")
        ) as outfile:
            pickle.dump(encoder_ocupations, outfile)

        with open(
            path.join(output_model_path, "encoder_gender.pickle", "wb")
        ) as outfile:
            pickle.dump(encoder_gender, outfile)

        with open(path.join(output_model_path, "encoder_fame.pickle", "wb")) as outfile:
            pickle.dump(encoder_fame, outfile)

        with open(path.join(output_model_path, "encoder_age.pickle", "wb")) as outfile:
            pickle.dump(encoder_age, outfile)

        with open(path.join(output_model_path, "vectorizer.pickle"), "wb") as outfile:
            pickle.dump(vectorizer, outfile)

        logger.info("Martinc algorithm trained successfully")

    def get_performance(self):
        tasks = ["gender", "fame", "occupation", "birthdecade"]

        labels_file_path = "../datasets/PAN19 - Celebrity Profiling/test/labels.ndjson"
        feeds_file_path = "../datasets/PAN19 - Celebrity Profiling/test/feeds.ndjson"

        documents = {}
        test_labels_d = {}
        num_samples = 100

        logger.info("Parsing labels..")
        with open(labels_file_path) as labels_file:
            for line in tqdm.tqdm(labels_file):
                lab_di = json.loads(line)
                test_labels_d[lab_di["id"]] = lab_di

        logger.info("Parsing feeds..")
        with open(feeds_file_path) as feeds_file:
            for line in tqdm.tqdm(feeds_file):
                lx = json.loads(line)
                tokens_word = " ".join(lx["text"][0:num_samples])
                documents[lx["id"]] = tokens_word

        test_documents = []
        test_labels = []

        for k, v in documents.items():
            test_documents.append(v)
            test_labels.append(test_labels_d[k])

        test_df = build_dataframe(test_documents)
        vectorizer_file = open(self.self.MODEL_FOLDER + "/vectorizer.pickle", "rb")
        vectorizer = pickle.load(vectorizer_file)
        test_features = vectorizer.transform(test_df)

        gender_labels = []
        fame_labels = []
        occupation_labels = []
        birthyear_labels = []

        for sample in test_labels:
            occupation_labels.append(sample["occupation"])
            gender_labels.append(sample["gender"])
            fame_labels.append(sample["fame"])
            birthyear_labels.append(sample["birthyear"])

        labels_dict = {
            "occupation": occupation_labels,
            "fame": fame_labels,
            "gender": gender_labels,
            "birthyear": birthyear_labels,
        }

        preds = {}
        for task, labels in labels_dict.items():
            encoder_file = open(
                self.self.MODEL_FOLDER + "/encoder_" + task + ".pickle", "rb"
            )
            encoder = pickle.load(encoder_file)
            model = joblib.load(self.self.MODEL_FOLDER + "/trained_LR_" + task + ".pkl")
            predictions = model.predict(test_features)
            predictions = encoder.inverse_transform(predictions)

            print(predictions)
            print(labels)

            f1 = f1_score(predictions, labels, average="weighted")
            logger.info(f"{task} performed with {f1}")
            preds[task] = f1
        total_score = 1 / np.sum([1 / sc for sc in preds.values()])
        logger.info(f"Total score {total_score}")
