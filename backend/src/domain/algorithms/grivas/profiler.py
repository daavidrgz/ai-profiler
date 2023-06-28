from collections import defaultdict
import json
import math
import os
from domain.algorithms.profiling_algorithm import ProfilingAlgorithm
import joblib
import logging
from application.dataset import Dataset
from domain.algorithms.grivas.entities.dataset import ProfilingDataset
from sklearn.svm import LinearSVC, LinearSVR
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    mean_squared_error,
)
from domain.algorithms.grivas.entities.preprocess import clean_html, detwittify
from domain.algorithms.grivas.entities.wrapper import FunctionWrapper

logger = logging.getLogger("server_logger")


class GrivasAlgorithm(ProfilingAlgorithm):
    NAME = "grivas"
    MODEL_FOLDER = "./domain/algorithms/grivas/models"

    def predict(self, dataset: Dataset):
        model_file = os.path.join(self.MODEL_FOLDER, "en.bin")
        all_models = joblib.load(model_file)

        dataset.convert_to_ndjson()

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

        tasks = [
            "age",
            "gender",
            "extroverted",
            "stable",
            "agreeable",
            "concientious",
            "open",
        ]

        results = defaultdict(dict)
        for task in tasks:
            logger.info("Predicting " + task + "...")
            predict = all_models[task].predict(test_documents)

            for id, pred in zip(test_ids, predict):
                if task == "gender":
                    if pred == "F":
                        pred = "female"
                    if pred == "M":
                        pred = "male"
                results[id][task] = pred

        output = []
        for k, v in results.items():
            output.append({"id": str(k), "result": v})

        logger.info("Grivas algorithm predicted successfully")

        return output

    def train(self):
        if not os.path.exists(self.MODEL_FOLDER):
            os.makedirs(self.MODEL_FOLDER)

        input_folder = "../datasets/PAN15 - Author Profiling/training/english"

        dataset = ProfilingDataset(input_folder)
        logger.info(f"Loaded {len(dataset.entries)} users...\n")
        all_models = {}

        svm_tasks = ["age", "gender"]
        svr_tasks = ["extroverted", "stable", "agreeable", "concientious", "open"]
        for task in svm_tasks + svr_tasks:
            logger.info(f"Learning to judge {task}..")
            X, y = dataset.get_data(task)

            pipe = Pipeline(
                [
                    ("cleaner", FunctionWrapper(clean_html)),
                    ("detwittify", FunctionWrapper(detwittify)),
                    (
                        "vectorizer",
                        TfidfVectorizer(analyzer="char", ngram_range=(3, 3)),
                    ),
                    ("clf", LinearSVC() if task in svm_tasks else LinearSVR()),
                ]
            )

            pipe.fit(X, y)
            all_models[task] = pipe

        modelfile = os.path.join(self.MODEL_FOLDER, f"%{dataset.lang}.bin")
        logger.info(f"Writing model to {modelfile}")
        joblib.dump(all_models, modelfile, compress=3)

        logger.info("Grivas algorithm trained successfully")

    def get_performance(self):
        input_folder = "../datasets/PAN15 - Author Profiling/test/english"

        dataset = ProfilingDataset(input_folder)
        model_file = os.path.join(self.MODEL_FOLDER, "en.bin")

        config = dataset.config
        tasks = config.tasks
        all_models = joblib.load(model_file)

        results = {}
        for task in tasks:
            X, y = dataset.get_data(feature=task)
            predict = all_models[task].predict(X)
            logger.info(f"\n-- Predictions for {task} --")
            try:
                acc = accuracy_score(y, predict)
                f1 = f1_score(y, predict, average="weighted")
                logger.info(f"Accuracy: {acc}, F1: {f1}")
            except ValueError:
                sqe = mean_squared_error(y, predict)
                logger.info(f"Mean squared error : {math.sqrt(sqe)}")
            results[task] = {"accuracy": acc, "f1": f1}

        return results
