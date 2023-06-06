import glob
import os
import re
import neptune
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from emoji import demojize
from xml.etree import ElementTree
from nltk.tokenize import TweetTokenizer
from nltk.tokenize.treebank import TreebankWordDetokenizer
from keras.callbacks import History
from keras.utils.layer_utils import count_params
import wandb
from wandb.keras import WandbCallback

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


def demojify(t, remove=True):
    t = demojize(t)
    if remove:
        return re.sub(r'(:[a-zA-Z0-9_-]+:)', ' xxemj ', t)
    else:
        return re.sub(r'(:[a-zA-Z0-9_-]+:)', r' \1 ', t)


use_pre_rules = True
pre_rules = []
if use_pre_rules:
    pre_rules = [demojify]


def preprocess_tweet(tweet):
    for pre_rule in pre_rules:
        tweet = pre_rule(tweet)
    # https://github.com/pan-webis-de/daneshvar18/blob/master/pan18ap/train_model.py#L146
    tokenizer = TweetTokenizer(preserve_case=True, reduce_len=True)
    tokens = tokenizer.tokenize(tweet)
    re_number = re.compile(r'^(?P<NUMBER>[+-]?\d+(?:[,/.:-]\d+[+-]?)?)$')
    for index, token in enumerate(tokens):
        if token[0:8] == "https://" or token[0:7] == "http://":
            tokens[index] = "xxurl"
        elif token[0] == "@" and len(token) > 1:
            tokens[index] = "xxusr"
        elif token[0] == "#" and len(token) > 1:
            tokens[index] = "xxhst".format(token[1:])
        elif re_number.match(token) is not None:
            tokens[index] = 'xxdgt'
        elif token.isdigit():
            tokens[index] = 'xxdgt'

    detokenizer = TreebankWordDetokenizer()
    processed_tweet = detokenizer.detokenize(tokens)

    return processed_tweet


def load_glove_v0(word_index, max_features, embedding_file='glove-embeddings.txt'):
    # https://www.kaggle.com/jpizarrom/gru-with-attention/edit
    def get_coefs(word, *arr):
        return word, np.asarray(arr, dtype='float32')
    # embeddings_index = dict(get_coefs(*o.split(" ")) for o in open(EMBEDDING_FILE) if o.split(" ")[0] in word_index)
    embeddings_index = dict(get_coefs(*o.strip().split()) for o in open(embedding_file))
    # embeddings_index = dict(get_coefs(*o.split(" ")) for o in open(EMBEDDING_FILE))

    all_embs = np.stack(embeddings_index.values())
    emb_mean, emb_std = all_embs.mean(), all_embs.std()
    print(emb_mean, emb_std)
    embed_size = all_embs.shape[1]

    embedding_matrix = np.random.normal(emb_mean, emb_std, (max_features, embed_size))
    for word, i in word_index.items():
        if i >= max_features:
            continue
        embedding_vector = embeddings_index.get(word)
        if word == "pronom_loc":
            embedding_vector = np.ones(300) * 0.85  # the number is arbitrary, just some vector
        if word == "person_loc":
            embedding_vector = np.ones(300) * 0.25  # the number is arbitrary, just some vector
        if embedding_vector is not None:
            embedding_matrix[i] = embedding_vector
    return embedding_matrix


def load_glove_v1(word_index, max_features, use_mean=False, use_unknown_vector=False, embedding_file='glove-embeddings.txt'):
    # https://www.kaggle.com/wowfattie/3rd-place
    # EMBEDDING_FILE = '../input/quora-insincere-questions-classification/embeddings/glove.840B.300d/glove.840B.300d.txt'
    def get_coefs(word, *arr):
        return word, np.asarray(arr, dtype='float32')

    embeddings_index = dict(get_coefs(*o.split(" ")) for o in open(embedding_file))
    # embeddings_index = dict(get_coefs(*o.strip().split()) for o in open(embedding_file))

    all_embs = np.stack(embeddings_index.values())
    emb_mean, emb_std = all_embs.mean(), all_embs.std()
    print(emb_mean, emb_std)
    embed_size = all_embs.shape[1]
    # embed_size = 50
    # nb_words = len(word_dict)+1
    unknown_words = []
    # vocab_size = max_features + 1

    if use_mean:
        embedding_matrix = np.random.normal(emb_mean, emb_std, (max_features + 1, embed_size))
    else:
        embedding_matrix = np.zeros((max_features + 1, embed_size), dtype=np.float32)
    unknown_vector = np.zeros((embed_size + 1,), dtype=np.float32) - 1.
    print(unknown_vector[:5])
    for key, i in word_index.items():
        if i >= max_features:
            continue
        word = key
        embedding_vector = embeddings_index.get(word)
        if embedding_vector is not None:
            embedding_matrix[i] = embedding_vector
            continue
        word = key.lower()
        embedding_vector = embeddings_index.get(word)
        if embedding_vector is not None:
            embedding_matrix[i] = embedding_vector
            continue
        word = key.upper()
        embedding_vector = embeddings_index.get(word)
        if embedding_vector is not None:
            embedding_matrix[i] = embedding_vector
            continue
        word = key.capitalize()
        embedding_vector = embeddings_index.get(word)
        if embedding_vector is not None:
            embedding_matrix[i] = embedding_vector
            continue
        # word = ps.stem(key)
        # embedding_vector = embeddings_index.get(word)
        # if embedding_vector is not None:
        #     embedding_matrix[i] = embedding_vector
        #     continue
        # word = lc.stem(key)
        # embedding_vector = embeddings_index.get(word)
        # if embedding_vector is not None:
        #     embedding_matrix[i] = embedding_vector
        #     continue
        # word = sb.stem(key)
        # embedding_vector = embeddings_index.get(word)
        # if embedding_vector is not None:
        #     embedding_matrix[i] = embedding_vector
        #     continue
        # word = lemma_dict[key]
        # embedding_vector = embeddings_index.get(word)
        # if embedding_vector is not None:
        #     embedding_matrix[i] = embedding_vector
        #     continue
        # if len(key) > 1:
        #     word = correction(key)
        #     embedding_vector = embeddings_index.get(word)
        #     if embedding_vector is not None:
        #         embedding_matrix[i] = embedding_vector
        #         continue
        unknown_words.append(word)
        if use_unknown_vector:
            embedding_matrix[i] = unknown_vector
    # return embedding_matrix, nb_words
    return embedding_matrix, unknown_words


def fit(build_model_fn, x_train, y_train, x_test, y_test, batch_size=32, epochs=50, verbose=False, callbacks=None, **kwargs):

    model = build_model_fn(**kwargs)
    return fit_model(build_model_fn, x_train, y_train, x_test, y_test, batch_size=32, epochs=50, verbose=False, callbacks=None, **kwargs)


def fit_model(model, x_train, y_train, x_test, y_test, batch_size=32, epochs=50, verbose=False, callbacks=None, **kwargs):

    cb = []
    history = History()
    cb.append(history)

    if callbacks:
        cb += callbacks

    model.fit(
        x_train, y_train,
        batch_size=batch_size,
        epochs=epochs,
        validation_data=(x_test, y_test),
        callbacks=cb,
        verbose=verbose)
    train_loss, train_accuracy = model.evaluate(x_train, y_train, verbose=verbose)
    print("Training Accuracy: {:.4f}".format(train_accuracy))
    val_loss, val_accuracy = model.evaluate(x_test, y_test, verbose=verbose)
    print("Testing Accuracy:  {:.4f}".format(val_accuracy))
    plot_history(history)
    return (train_loss, train_accuracy), (val_loss, val_accuracy), model, history


def plot_history(history):
    try:
        acc = history.history['acc'] if 'acc' in history.history else None
        val_acc = history.history['val_acc'] if 'val_acc' in history.history else None
        loss = history.history['loss'] if 'loss' in history.history else None
        val_loss = history.history['val_loss'] if 'val_loss' in history.history else None
        x = range(1, len(acc) + 1)

        plt.figure(figsize=(12, 5))
        plt.subplot(1, 2, 1)
        if acc:
            plt.plot(x, acc, 'b', label='Training acc')
        if val_acc:
            plt.plot(x, val_acc, 'r', label='Validation acc')
        plt.title('Training and validation accuracy')
        plt.legend()
        plt.subplot(1, 2, 2)
        if loss:
            plt.plot(x, loss, 'b', label='Training loss')
        if val_loss:
            plt.plot(x, val_loss, 'r', label='Validation loss')
        plt.title('Training and validation loss')
        plt.legend()
    except Exception as e:
        print(e)
    plt.show()


# os.environ['NEPTUNE_API_TOKEN'] = ''
# os.environ['NEPTUNE_PROJECT'] = ''


def fit_and_netptune(
        build_model_fn, x_train, y_train, x_test, y_test, batch_size=64, epochs=50, verbose=False,
        callbacks=None, use_neptune=False, use_wandb=True, fit_model=True, **kwargs):

    if use_neptune:
        try:
            project = neptune.init()
        except:
            pass
    params = {}

    for index, row in pd.json_normalize(kwargs).iterrows():
        for k in row.keys():
            params[k] = row[k]

    model = build_model_fn(**kwargs)

    total_count = model.count_params()
    non_trainable_count = count_params(model.non_trainable_weights)
    trainable_count = total_count - non_trainable_count

    print('params_total_count', total_count)
    print('params_non_trainable_count', non_trainable_count)
    print('params_trainable_count', trainable_count)

    params['params_total_count'] = total_count
    params['params_non_trainable_count'] = non_trainable_count
    params['params_trainable_count'] = trainable_count

    params['build_model_fn'] = build_model_fn.__name__
    params['batch_size'] = batch_size
    params['epochs'] = epochs
    params['fit_model'] = fit_model

    if use_wandb:
        wandb.init(project="pan19ap", config=params, reinit=True, allow_val_change=True)

    if use_neptune:
        neptune_aborted = None

        def stop_training():
            nonlocal neptune_aborted
            neptune_aborted = True
            model.stop_training = True

        tags = [params['build_model_fn']]
        try:
            project.create_experiment(name='runner_qualified_name', params=params, upload_source_files=[], abort_callback=stop_training, tags=tags)
        except:
            pass
    # if use_wandb:
    #     wandb.config.update(params, allow_val_change=True)
        # for k, v in params.items():
        #     setattr(wandb.config, k, v)

    if fit_model:
        cb = []
        history = History()
        cb.append(history)

        if use_neptune:
            cb.append(NeptuneMonitor())

        if use_wandb:
            cb.append(WandbCallback())

        if callbacks:
            cb += callbacks

        model.fit(
            x_train, y_train,
            batch_size=batch_size,
            epochs=epochs,
            validation_data=(x_test, y_test),
            callbacks=cb,
            verbose=verbose)

    if use_neptune:
        print('neptune_aborted', neptune_aborted)
        if not neptune_aborted:
            try:
                neptune.stop()
            except:
                pass

    if fit_model:
        loss, accuracy = model.evaluate(x_train, y_train, verbose=verbose)
        print("Training Accuracy: {:.4f}".format(accuracy))
        loss, accuracy = model.evaluate(x_test, y_test, verbose=verbose)
        print("Testing Accuracy:  {:.4f}".format(accuracy))
        plot_history(history)
        return model, (loss, accuracy)
