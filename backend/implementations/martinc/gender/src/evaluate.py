## evaluate learners on data
import scipy.io as sio
from sklearn.linear_model import LogisticRegression
import pickle
from sklearn import preprocessing
import numpy as np
from sklearn.metrics import accuracy_score
import logging
from sklearn.externals import joblib
logging.basicConfig(format='%(asctime)s - %(message)s', datefmt='%d-%b-%y %H:%M:%S')
logging.getLogger().setLevel(logging.INFO)
import numpy
import argparse
numpy.random.seed()

def load_labels(label_pickle,test_labels):

    type_train = []
    gender_train = []

    
    type_test = []
    gender_test = []

    with open(label_pickle, "rb") as input_file:
        e = pickle.load(input_file)
        
    with open(test_labels, "rb") as input_file:
        et = pickle.load(input_file)

    for el in e:
        type_train.append(el['type'])
        gender_train.append(el['gender'])

        
    for el in et:
        type_test.append(el['type'])
        gender_test.append(el['gender'])


    encoder_type = preprocessing.LabelEncoder().fit(type_train+type_test)
    encoder_gender = preprocessing.LabelEncoder().fit(gender_train+gender_test)

        
    label_object = {}
    label_object['gender'] = (encoder_gender.transform(gender_train),encoder_gender.transform(gender_test))
    label_object['type'] = (encoder_type.transform(type_train),encoder_type.transform(type_test))

    encoders = (encoder_type,encoder_gender)
    return label_object,encoders
    
    
        
if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument('--feature_folder', type=str, default="../train_data", help='Path to output feature folder')
    args = parser.parse_args()

    for lang in ['en', 'es']:
        for task in ['bot', 'gender']:

            fname = args.feature_folder +  "/train_instances_" + task + "_" + lang + ".mat"
            labels_train = args.feature_folder +  "/train_labels_" + task + "_" + lang + ".pickle"
            labels_test = args.feature_folder +  "/test_labels_" + task + "_" + lang + ".pickle"

            dmat = sio.loadmat(fname)
            train_features = dmat['train_features']
            test_features = dmat['test_features']
            label_vectors,encoders = load_labels(labels_train,labels_test)
            encoder_type,encoder_gender = encoders

            outfile = open(args.feature_folder + "/encoder_" + task + "_" + lang + ".pickle",'wb')
            pickle.dump(encoder_type,outfile)
            outfile.close()

            outfile = open(args.feature_folder + "/encoder_" + task + "_" + lang + ".pickle",'wb')
            pickle.dump(encoder_gender,outfile)
            outfile.close()

            preds = {}
            print('Evaluation on task and language: ', task, lang )
            for target, vals in label_vectors.items():

                if target == task or (task=='bot' and target=="type"):
                    train_labels = vals[0]
                    test_labels = vals[1]

                    clf = LogisticRegression(C=1e2, fit_intercept=False)
                    clf.fit(train_features,train_labels)
                    joblib.dump(clf, args.feature_folder + '/trained_LR_' + task + "_" + lang + '.pkl')
                    predictions = clf.predict(test_features)

                    accuracy = accuracy_score(predictions,test_labels)
                    logging.info("{} Performed with {}".format(target, accuracy))
                    preds[target] = accuracy
            total_score = 1/np.sum([1/sc for sc in preds.values()])
            logging.info("Total score {}".format(total_score))


