import glob
import os
import pandas as pd
# import random
# import json

from sklearn import metrics

# from nltk.tokenize import TweetTokenizer
# from nltk.tokenize.treebank import TreebankWordDetokenizer

# from sklearn.externals import joblib
# from sklearn.svm import LinearSVC
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.pipeline import Pipeline, FeatureUnion

from xml.etree import ElementTree


def read_xmls(xmls_directory, truth_path=None):
    def _read_xml(author_id):
        # tweets = []
        xml_filename = f'{author_id}.xml'
        tree = ElementTree.parse(
            os.path.join(xmls_directory, xml_filename),
            parser=ElementTree.XMLParser(encoding="utf-8"))
        root = tree.getroot()
        val = {}
        val['id'] = root.attrib['id']
        val['lang'] = root.attrib['lang']
        val['type'] = root.attrib['type']
        val['gender'] = root.attrib['gender']
        return val
    if truth_path is not None:
        raise
    else:
        files = glob.glob(f'{xmls_directory}/*.xml')
        author_ids = map(lambda x: os.path.splitext(os.path.basename(x))[0], files)
        vals = map(lambda x: _read_xml(x), author_ids)
        df = pd.DataFrame(vals)
    return df


def options():
    import argparse
    parser = argparse.ArgumentParser(description='')
    parser.add_argument('-c', '--input-dataset', help='', required=True)
    parser.add_argument('-o', '--output-dir', help='', required=True)
    parser.add_argument('-l', '--lang', help='', default='en,es')
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = options()
    input_dataset = args.input_dataset
    output_dir = args.output_dir
    langs = args.lang.split(',')

    # conf = json.load(open(os.path.join(model_dir, mc)))

    print('input_dataset', input_dataset)
    print('output_dir', output_dir)
    print('langs', langs)
    # print('conf', json.dumps(conf))

    for i, lang in enumerate(langs):
        print('lang', lang)
        truth_path = os.path.join(input_dataset, lang, 'truth.txt')
        df = pd.read_csv(truth_path, sep=':::', header=None, names=['author_id', 'human_or_bot', 'gender'], engine ='python')
        xmls_directory = os.path.join(input_dataset, lang)
        df_test = read_xmls(xmls_directory)
        result = pd.merge(df_test, df, left_on='id', right_on='author_id')

        y_pred = result['type']
        y_ref = result['human_or_bot']
        print(lang, 'human_or_bot', metrics.accuracy_score(y_ref, y_pred))

        y_pred = result['gender_x']
        y_ref = result['gender_y']
        print(lang, 'gender', metrics.accuracy_score(y_ref, y_pred))
