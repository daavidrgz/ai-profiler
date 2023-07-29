from collections import defaultdict
import json
import math
import os
from os import path
import joblib
import logging
from domain.entities.profiling_algorithm import ProfilingAlgorithm
from domain.entities.predict_dataset import PredictDataset
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
from domain.entities.train_dataset import (
    PAN14TrainDataset,
    PAN15TrainDataset,
    TrainDataset,
)

logger = logging.getLogger("server_logger")


class GrivasAlgorithm(ProfilingAlgorithm):
    MODEL_FOLDER = "./domain/algorithms/grivas/models"
    SVM_TASKS = ["age", "gender"]
    SVR_TASKS = ["extroverted", "stable", "agreeable", "conscientious", "open"]
    TASKS = SVM_TASKS + SVR_TASKS

    def __init__(self):
        name = "grivas"
        supported_train_datasets = [PAN14TrainDataset(), PAN15TrainDataset()]
        default_train_dataset = PAN15TrainDataset()
        super().__init__(name, supported_train_datasets, default_train_dataset)

    def predict(self, dataset: PredictDataset, train_dataset: TrainDataset):
        trained_model = path.join(self.MODEL_FOLDER, f"{train_dataset.name}.bin")
        all_models = joblib.load(trained_model)

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

        results = defaultdict(dict)
        for task in self.TASKS:
            logger.info(f"Predicting {task}...")
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

        logger.info("Grivas algorithm prediction successful")

        return output

    def train(self, train_dataset: TrainDataset):
        if not path.exists(self.MODEL_FOLDER):
            os.makedirs(self.MODEL_FOLDER)

        input_folder = train_dataset.train_path

        dataset = ProfilingDataset(input_folder)
        logger.info(f"Loaded {len(dataset.entries)} users...\n")
        all_models = {}

        for task in dataset.config.tasks:
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
                    ("clf", LinearSVC() if task in self.SVM_TASKS else LinearSVR()),
                ]
            )

            pipe.fit(X, y)
            all_models[task] = pipe

        modelfile = path.join(self.MODEL_FOLDER, f"{train_dataset.name}.bin")
        logger.info(f"Writing model to {modelfile}")
        joblib.dump(all_models, modelfile, compress=3)

        logger.info("Grivas algorithm trained successfully")

    def get_performance(self, train_dataset: TrainDataset):
        input_folder = train_dataset.test_path

        dataset = ProfilingDataset(input_folder)
        logger.info(f"Loaded {len(dataset.entries)} users...\n")
        model_file = path.join(self.MODEL_FOLDER, f"{train_dataset.name}.bin")
        all_models = joblib.load(model_file)

        results = {}
        for task in dataset.config.tasks:
            X, y = dataset.get_data(feature=task)
            predict = all_models[task].predict(X)
            logger.info(f"\n-- Predictions for {task} --")
            if task in self.SVM_TASKS:
                acc = accuracy_score(y, predict)
                f1 = f1_score(y, predict, average="weighted")
                logger.info(f"Accuracy: {acc}, F1: {f1}")
                results[task] = {"accuracy": acc, "f1": f1}
            else:
                sqe = mean_squared_error(y, predict)
                logger.info(f"Mean squared error : {math.sqrt(sqe)}")
                results[task] = {"mse": math.sqrt(sqe)}

        return results
