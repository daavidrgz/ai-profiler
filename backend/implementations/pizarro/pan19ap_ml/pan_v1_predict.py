import glob
import os
import pandas as pd
# import random
import json

from nltk.tokenize import TweetTokenizer
from nltk.tokenize.treebank import TreebankWordDetokenizer

from sklearn.externals import joblib
# from sklearn.svm import LinearSVC
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.pipeline import Pipeline, FeatureUnion

from xml.etree import ElementTree


def preprocess_tweet(tweet):
    # https://github.com/pan-webis-de/daneshvar18/blob/master/pan18ap/train_model.py#L146
    tokenizer = TweetTokenizer(preserve_case=False, reduce_len=True)
    tokens = tokenizer.tokenize(tweet)
    for index, token in enumerate(tokens):
        if token[0:8] == "https://" or token[0:7] == "http://":
            tokens[index] = "<URLURL>"
        elif token[0] == "@" and len(token) > 1:
            tokens[index] = "<UsernameMention>"
        elif token[0] == "#" and len(token) > 1:
            tokens[index] = "<HASHTAG>"

    detokenizer = TreebankWordDetokenizer()
    processed_tweet = detokenizer.detokenize(tokens)

    return processed_tweet


def read_xmls(xmls_directory, truth_path=None):
    def _read_xml(author_id):
        tweets = []
        xml_filename = '{}.xml'.format(author_id)
        tree = ElementTree.parse(
            os.path.join(xmls_directory, xml_filename),
            parser=ElementTree.XMLParser(encoding="utf-8"))
        root = tree.getroot()
        for child in root[0]:
            tweets.append('xxnew {}'.format(child.text))
        return ' '.join(tweets)
    if truth_path is not None:
        df = pd.read_csv(truth_path, sep=':::', header=None, names=['author_id', 'human_or_bot', 'gender'])
    else:
        files = glob.glob('{}/*.xml'.format(xmls_directory))
        author_ids = list(map(lambda x: os.path.splitext(os.path.basename(x))[0], files))
        df = pd.DataFrame({'author_id': author_ids})

    df['tweet'] = df['author_id'].apply(_read_xml)
    return df


def write_file(filename, author_id, lang, atype, gender):
    # <author id="author-id"
    #   lang="en|es"
    #   type="bot|human"
    #   gender="bot|male|female"
    # />
    tmpl = '''
    <author id="{author_id}"
        lang="{lang}"
        type="{atype}"
        gender="{gender}"
    />'''
    value = tmpl.format(
        author_id=author_id,
        lang=lang,
        atype=atype,
        gender=gender,
    )
    with open(filename, 'w') as f:
        f.write(value)


def main(input_dataset, output_dir, lang, model_dir='', conf={}):

    vectorizer_file_h = os.path.join(model_dir, 'vectorizer.{}{}.pkl'.format(lang, conf['human_or_bot']['vectorizer']))
    print('load vectorizer_h', vectorizer_file_h)
    vectorizer_h = joblib.load(vectorizer_file_h)

    model_file_h = os.path.join(model_dir, 'model.{}{}.pkl'.format(lang, conf['human_or_bot']['model']))
    print('load model_h', model_file_h)
    model_h = joblib.load(model_file_h)

    vectorizer_file_g = os.path.join(model_dir, 'vectorizer.{}{}.pkl'.format(lang, conf['gender']['vectorizer']))
    print('load vectorizer_g', vectorizer_file_g)
    vectorizer_g = joblib.load(vectorizer_file_g)

    model_file_g = os.path.join(model_dir, 'model.{}{}.pkl'.format(lang, conf['gender']['model']))
    print('load model', model_file_g)
    model_g = joblib.load(model_file_g)

    print('read_xmls input_dataset')
    xmls_base_directory_test = input_dataset
    xmls_directory_test = '{}/{}'.format(xmls_base_directory_test, lang)

    df_test = read_xmls(xmls_directory_test)
    docs_test_clean = df_test['tweet']

    print('vectorizer_h transform input_dataset')
    X_test_h = vectorizer_h.transform(docs_test_clean)

    print('predict model_h input_dataset')
    y_pred_h = model_h.predict(X_test_h)

    print('vectorizer_g transform input_dataset')
    X_test_g = vectorizer_g.transform(docs_test_clean)

    print('predict model_g input_dataset')
    y_pred_g = model_g.predict(X_test_g)

    os.makedirs('{}/{}/'.format(output_dir, lang), exist_ok=True)
    for i, pred in enumerate(y_pred_h):
        author_id = df_test.iloc[i]['author_id']
        filename = '{}/{}/{}.xml'.format(output_dir, lang, author_id)
        if pred == 'bot':
            gender = 'bot'
        else:
            gender = y_pred_g[i]
        write_file(filename, author_id, lang, atype=pred, gender=gender)

    print('predict done')


def options():
    import argparse
    parser = argparse.ArgumentParser(description='')
    parser.add_argument('-c', '--input-dataset', help='', required=True)
    parser.add_argument('-o', '--output-dir', help='', required=True)
    parser.add_argument('-md', '--model-dir', help='', default='/home/pizarro19/pan_v0')
    parser.add_argument('-mc', '--model-conf', help='', required=True)
    parser.add_argument('-l', '--lang', help='', default='en,es')
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = options()
    input_dataset = args.input_dataset
    output_dir = args.output_dir
    model_dir = args.model_dir
    mc = args.model_conf
    langs = args.lang.split(',')

    conf = json.load(open(os.path.join(model_dir, mc)))

    print('input_dataset', input_dataset)
    print('output_dir', output_dir)
    print('model_dir', model_dir)
    print('langs', langs)
    print('conf', json.dumps(conf))

    for i, lang in enumerate(langs):
        print('lang', lang)
        main(input_dataset, output_dir, lang=lang, model_dir=model_dir, conf=conf[lang])
