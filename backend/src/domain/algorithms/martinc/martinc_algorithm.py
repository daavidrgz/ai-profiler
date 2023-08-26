import os
import pickle
from os import path
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from domain.entities.profiling_algorithm import ProfilingAlgorithm
from domain.algorithms.martinc.tfidf_kingdom import *
from collections import defaultdict
import joblib
import tqdm
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
    TASKS = ["gender", "fame", "occupation", "age"]

    def __init__(self):
        name = "martinc"
        default_train_dataset = PAN19TrainDataset()
        supported_train_datasets = [PAN19TrainDataset()]
        super().__init__(name, supported_train_datasets, default_train_dataset)

    def predict(self, predict_dataset: PredictDataset, train_dataset: TrainDataset):
        model_path = path.join(self.MODEL_FOLDER, train_dataset.name)

        predict_documents = predict_dataset.get_documents()
        test_documents = []
        test_ids = []
        for k, v in predict_documents.items():
            test_documents.append(v)
            test_ids.append(k)

        test_df = build_dataframe(test_documents)
        vectorizer_file = open(path.join(model_path, "vectorizer.pkl"), "rb")
        vectorizer = pickle.load(vectorizer_file)
        predict_features = vectorizer.transform(test_df)

        docs_dict = defaultdict(dict)
        for task in self.TASKS:
            logger.info(f"Predicting {task}...")
            encoder_file = open(path.join(model_path, f"encoder_{task}.pkl"), "rb")
            encoder = pickle.load(encoder_file)
            model = joblib.load(path.join(model_path, f"trained_LR_{task}.pkl"))

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
        model_path = path.join(self.MODEL_FOLDER, train_dataset.name)
        if not path.exists(model_path):
            os.makedirs(model_path)

        labels_file_path = path.join(train_dataset.train_path, "labels.ndjson")
        feeds_file_path = path.join(train_dataset.train_path, "feeds.ndjson")

        num_samples = 100
        document_count = 0
        documents = {}
        train_labels_d = {}

        logger.info("Parsing labels..")
        with open(labels_file_path) as labels_file:
            for line in labels_file:
                document_count += 1
                lab_di = json.loads(line)
                train_labels_d[lab_di["id"]] = lab_di

        logger.info("Parsing feeds..")
        with open(feeds_file_path) as feeds_file:
            for line in tqdm.tqdm(feeds_file, total=document_count):
                lx = json.loads(line)
                tokens_word = " ".join(lx["text"][0:num_samples])
                documents[lx["id"]] = tokens_word

        train_documents = []
        train_labels = []
        for k, v in documents.items():
            train_documents.append(v)
            train_labels.append(train_labels_d[k])

        logger.info("Computing MM")
        train_df = build_dataframe(train_documents)
        logger.info("Dataframe built")

        vectorizer = get_tfidf_features(train_df)
        vectorizer_file = open(path.join(model_path, "vectorizer.pkl"), "wb")
        pickle.dump(vectorizer, vectorizer_file)

        logger.info("Vectorizing train dataframe")
        feature_vector = vectorizer.transform(train_df)
        logger.info("Dataframe vectorized")

        all_encoded_task_labels = {}
        for task in self.TASKS:
            labels = []
            for sample in train_labels:
                labels.append(sample[task])
            encoder = preprocessing.LabelEncoder().fit(labels)
            all_encoded_task_labels[task] = encoder.transform(labels)
            encoder_path = path.join(model_path, f"encoder_{task}.pkl")
            pickle.dump(encoder, open(encoder_path, "wb"))

        for task, encoded_task_labels in all_encoded_task_labels.items():
            clf = LogisticRegression(C=1e2, fit_intercept=False)
            clf.fit(feature_vector, encoded_task_labels)
            joblib.dump(clf, path.join(model_path, f"trained_LR_{task}.pkl"))

        logger.info("Martinc algorithm trained successfully")

    def get_performance(self, train_dataset: TrainDataset):
        model_path = path.join(self.MODEL_FOLDER, train_dataset.name)

        test_labels_file_path = path.join(
            train_dataset.test_path, "labels.ndjson"
        )
        test_feeds_file_path = path.join(train_dataset.test_path, "feeds.ndjson")

        documents = {}
        test_labels_d = {}
        num_samples = 100

        logger.info("Parsing labels..")
        with open(test_labels_file_path) as labels_file:
            for line in labels_file:
                lab_di = json.loads(line)
                test_labels_d[lab_di["id"]] = lab_di

        logger.info("Parsing feeds..")
        with open(test_feeds_file_path) as feeds_file:
            for line in feeds_file:
                lx = json.loads(line)
                tokens_word = " ".join(lx["text"][0:num_samples])
                documents[lx["id"]] = tokens_word

        test_documents = []
        test_labels = []
        for k, v in documents.items():
            test_documents.append(v)
            test_labels.append(test_labels_d[k])

        test_df = build_dataframe(test_documents)
        vectorizer_file = open(path.join(model_path, "vectorizer.pkl"), "rb")
        vectorizer = pickle.load(vectorizer_file)
        test_features = vectorizer.transform(test_df)

        labels_dict = {}
        for task in self.TASKS:
            labels = []
            for sample in test_labels:
                labels.append(sample[task])
            labels_dict[task] = labels

        results = {}
        for task, task_labels in labels_dict.items():
            encoder_file = open(path.join(model_path, f"encoder_{task}.pkl"), "rb")
            encoder = pickle.load(encoder_file)
            model = joblib.load(path.join(model_path, f"trained_LR_{task}.pkl"))

            predictions = model.predict(test_features)
            predictions = encoder.inverse_transform(predictions)

            accuracy = accuracy_score(task_labels, predictions)
            f1 = f1_score(task_labels, predictions, average="macro")

            results[task] = {"accuracy": accuracy, "f1": f1}
            logger.info(f"{task} performed with Accuracy: {accuracy} and F1: {f1}")
        return results
