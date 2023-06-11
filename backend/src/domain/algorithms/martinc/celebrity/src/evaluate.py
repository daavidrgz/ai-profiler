## evaluate learners on data
import scipy.io as sio
from sklearn.linear_model import LogisticRegression
import pickle
from sklearn import preprocessing
import numpy as np
from sklearn.metrics import f1_score
import logging
import joblib

logging.basicConfig(format="%(asctime)s - %(message)s", datefmt="%d-%b-%y %H:%M:%S")
logging.getLogger().setLevel(logging.INFO)
import numpy
import argparse

numpy.random.seed()


def load_labels(label_pickle, test_labels):
    ocupations_train = []
    gender_train = []
    fame_train = []
    birth_train = []

    ocupations_test = []
    gender_test = []
    fame_test = []
    birth_test = []
    with open(label_pickle, "rb") as input_file:
        e = pickle.load(input_file)

    with open(test_labels, "rb") as input_file:
        et = pickle.load(input_file)
        
    for el in e:
        ocupations_train.append(el["occupation"])
        gender_train.append(el["gender"])
        fame_train.append(el["fame"])
        birth_train.append(el["birthyear"])

    for el in et:
        ocupations_test.append(el["occupation"])
        gender_test.append(el["gender"])
        fame_test.append(el["fame"])
        birth_test.append(el["birthyear"])

    encoder_ocupations = preprocessing.LabelEncoder().fit(
        ocupations_train + ocupations_test
    )
    encoder_gender = preprocessing.LabelEncoder().fit(gender_train + gender_test)
    encoder_fame = preprocessing.LabelEncoder().fit(fame_train + fame_test)
    encoder_birth = preprocessing.LabelEncoder().fit(birth_train + birth_test)

    label_object = {}
    label_object["gender"] = (
        encoder_gender.transform(gender_train),
        encoder_gender.transform(gender_test),
    )
    label_object["occupation"] = (
        encoder_ocupations.transform(ocupations_train),
        encoder_ocupations.transform(ocupations_test),
    )
    label_object["fame"] = (
        encoder_fame.transform(fame_train),
        encoder_fame.transform(fame_test),
    )
    label_object["birthyear"] = (
        encoder_birth.transform(birth_train),
        encoder_birth.transform(birth_test),
    )
    encoders = (encoder_ocupations, encoder_gender, encoder_fame, encoder_birth)
    return label_object, encoders


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--feature_folder",
        type=str,
        default="../train_data",
        help="Path to output feature folder",
    )
    args = parser.parse_args()

    fname = args.feature_folder + "/train_instances.mat"
    labels_train = args.feature_folder + "/train_labels.pickle"
    labels_test = args.feature_folder + "/test_labels.pickle"

    dmat = sio.loadmat(fname)
    train_features = dmat["train_features"]
    test_features = dmat["test_features"]
    label_vectors, encoders = load_labels(labels_train, labels_test)
    encoder_ocupations, encoder_gender, encoder_fame, encoder_birth = encoders

    outfile = open(args.feature_folder + "/encoder_occupation.pickle", "wb")
    pickle.dump(encoder_ocupations, outfile)
    outfile.close()

    outfile = open(args.feature_folder + "/encoder_gender.pickle", "wb")
    pickle.dump(encoder_gender, outfile)
    outfile.close()

    outfile = open(args.feature_folder + "/encoder_fame.pickle", "wb")
    pickle.dump(encoder_fame, outfile)
    outfile.close()

    outfile = open(args.feature_folder + "/encoder_birthyear.pickle", "wb")
    pickle.dump(encoder_birth, outfile)
    outfile.close()

    preds = {}
    for target, vals in label_vectors.items():
        train_labels = vals[0]
        test_labels = vals[1]
        clf = LogisticRegression(C=1e2, fit_intercept=False)
        clf.fit(train_features, train_labels)
        joblib.dump(clf, args.feature_folder + "/trained_LR_{}.pkl".format(target))
        predictions = clf.predict(test_features)

        f1 = f1_score(predictions, test_labels, average="weighted")
        logging.info("{} Performed with {}".format(target, f1))
        preds[target] = f1
    total_score = 1 / np.sum([1 / sc for sc in preds.values()])
    logging.info("Total score {}".format(total_score))
