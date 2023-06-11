#!/usr/bin/env python
# coding: utf-8

# https://www.kaggle.com/jpizarrom/improved-lstm-baseline-glove-dropout/edit
# 
# https://www.kaggle.com/jpizarrom/gru-with-attention/edit

# In[ ]:


#import os
#os.environ['TF_ENABLE_AUTO_MIXED_PRECISION']=1


# In[ ]:


import sys, os, re, csv, codecs, numpy as np, pandas as pd

from keras.preprocessing.text import Tokenizer
from keras.utils import pad_sequences
from keras.layers import Dense, Input, LSTM, Embedding, Dropout, Activation
from keras.layers import Bidirectional, GlobalMaxPool1D
from keras.models import Model
from keras import initializers, regularizers, constraints, optimizers, layers


# In[ ]:


embed_size = 300 # how big is each word vector
max_features = 20000 # how many unique words to use (i.e num rows in embedding vector)
maxlen = 7000 # max number of words in a comment to use


# In[ ]:


import pandas as pd
from xml.etree import ElementTree
import os

from sklearn.metrics import classification_report


# In[ ]:


from pan19ap_utils import read_xmls


# In[ ]:


import hashlib

xmls_base_directory_train = './pan19-author-profiling-training-2019-02-18-train' 
# 4dfce7b3ff7122b0b1b771c8226fe2c6

#xmls_base_directory_train = '/content/pan19-author-profiling-training-2019-02-18' 
# 4c77129d869c945a03b3d0f46a432722'

xmls_base_directory_dev = './pan19-author-profiling-training-2019-02-18-dev'

#input_dataset, output_dir, lang='en', model_suffix=''

hash_object = hashlib.md5(xmls_base_directory_train.encode())

lang = 'en'
task = 'human_or_bot'
#task = 'gender'
train_model = False
model_suffix = '.alc-keras-lstm'
model_suffix += '.{}'.format(hash_object.hexdigest())
print(lang, task, model_suffix, train_model)


# In[ ]:


xmls_directory_train = '{}/{}'.format(xmls_base_directory_train, lang)
truth_path_train = '{}/truth.txt'.format(xmls_directory_train)
print(xmls_directory_train)
print(truth_path_train)
print('df_train.{}{}.pkl'.format(lang, model_suffix))

try:
#    raise FileNotFoundError()
    df_train = pd.read_pickle('df_train.{}{}.pkl'.format(lang, model_suffix))
except FileNotFoundError:
    df_train = read_xmls(xmls_directory_train, truth_path_train)
    df_train.to_pickle('df_train.{}{}.pkl'.format(lang, model_suffix))

print(df_train.shape)
print(df_train.head(10))


# In[ ]:


from pan19ap_utils import preprocess_tweet
#    pre_rules=[remove_handles, remove_urls, modify_hashtags, demojify]))


# In[ ]:


print('df_train.{}{}.preprocessed.pkl'.format(lang, model_suffix))
try:
    df_train = pd.read_pickle('df_train.{}{}.preprocessed.pkl'.format(lang, model_suffix))
except FileNotFoundError:
    df_train['tweet'] = df_train['tweet'].apply(preprocess_tweet)
    df_train.to_pickle('df_train.{}{}.preprocessed.pkl'.format(lang, model_suffix))

print(df_train.shape)


# In[ ]:


print(df_train.head(2))


# In[ ]:


df_trn = df_train[ ['human_or_bot','tweet'] ]
df_trn.columns = ['label', 'text']
print(df_trn.head())


# In[ ]:


from pan19ap_utils import demojify


# In[ ]:


print(demojify('👍 ddd', False))
print(demojify('🙈 ddd', False))
print(demojify('👍 ddd', True))
print(demojify('sss 🙈 1 :s_-s: ddd', True))
#print(remove_handles('@hola dd@ss'))
#print(modify_hashtags('#hola #hola'))
#print(remove_urls('http://hhhh.com'))
#print(remove_numbers('http://hhhh1.com'))


# In[ ]:


print(df_trn.label.value_counts())


# In[ ]:


xmls_directory_dev = '{}/{}'.format(xmls_base_directory_dev, lang)
truth_path_dev = '{}/truth.txt'.format(xmls_directory_dev)
print(xmls_directory_dev)
print(truth_path_dev)
print('df_dev.{}{}.pkl'.format(lang, model_suffix))

try:
#    raise FileNotFoundError()dc
    df_dev = pd.read_pickle('df_dev.{}{}.pkl'.format(lang, model_suffix))
except FileNotFoundError:
    print('read_xmls')
    df_dev = read_xmls(xmls_directory_dev, truth_path_dev)
    df_dev.to_pickle('df_dev.{}{}.pkl'.format(lang, model_suffix))

print(df_dev.shape)


# In[ ]:


print('df_dev.{}{}.preprocessed.pkl'.format(lang, model_suffix))
try:
    df_dev = pd.read_pickle('df_dev.{}{}.preprocessed.pkl'.format(lang, model_suffix))
except FileNotFoundError:
    df_dev['tweet'] = df_dev['tweet'].apply(preprocess_tweet)
    df_dev.to_pickle('df_dev.{}{}.preprocessed.pkl'.format(lang, model_suffix))

print(df_dev.shape)


# In[ ]:


df_val = df_dev[ ['human_or_bot','tweet'] ]
df_val.columns = ['label', 'text']
print(df_val.head())


# In[ ]:


print(df_val.label.value_counts())


# In[ ]:


list_sentences_train = df_trn["text"].fillna("_na_").values
list_sentences_test = df_val["text"].fillna("_na_").values
#list_sentences_test[0]


# In[ ]:


tokenizer = Tokenizer(num_words=max_features)
#tokenizer = Tokenizer(num_words=max_features)
tokenizer.fit_on_texts(list(list_sentences_train))
list_tokenized_train = tokenizer.texts_to_sequences(list_sentences_train)
list_tokenized_test = tokenizer.texts_to_sequences(list_sentences_test)
word_index = tokenizer.word_index


# In[ ]:


word_index['xxurl']


# In[ ]:


len(word_index)


# In[ ]:


list(word_index.items())[0:1000]


# In[ ]:


#word_index.keys()


# In[ ]:


#list_tokenized_test[0]


# In[ ]:


max([len(x) for x in list_tokenized_train]), max([len(x) for x in list_tokenized_test])


# In[ ]:


X_t = pad_sequences(list_tokenized_train, maxlen=maxlen)
X_te = pad_sequences(list_tokenized_test, maxlen=maxlen)


# In[ ]:


print(len(list_sentences_train),len(list_tokenized_train), len(X_t))
print(len(list_sentences_test),len(list_tokenized_test), len(X_te))


# In[ ]:


from pan19ap_utils import load_glove_v1


# In[ ]:


embedding_matrix, unknown_words = load_glove_v1(word_index, max_features, use_mean=False)


# In[ ]:


nonzero_elements = np.count_nonzero(np.count_nonzero(embedding_matrix, axis=1))
nonzero_elements / max_features


# In[ ]:


embedding_matrix = [embedding_matrix]


# In[ ]:


embedding_matrix_mean, unknown_words_mean = load_glove_v1(word_index, max_features, use_mean=True)


# In[ ]:


nonzero_elements = np.count_nonzero(np.count_nonzero(embedding_matrix_mean, axis=1))
nonzero_elements / max_features


# In[ ]:


embedding_matrix_mean = [embedding_matrix_mean]


# In[ ]:


print(len(unknown_words))


# In[ ]:


#unknown_words


# In[ ]:


#y = np.asarray(df_trn['label'].values)
#y = pd.get_dummies(df_trn['label']).values
#y
from sklearn.preprocessing import LabelEncoder

encoder = LabelEncoder()
encoder.fit(df_trn['label'])
y = encoder.transform(df_trn['label'])
print(y)


# In[ ]:


y_val = encoder.transform(df_val['label'])
print(y_val)


# In[ ]:


from keras.models import Sequential
from keras.layers import Conv1D, MaxPooling1D
from keras.layers import Flatten
#from keras.layers import LSTM, Bidirectional
from keras.layers import Input, Embedding, PReLU, Bidirectional, Lambda,     CuDNNLSTM, CuDNNGRU, SimpleRNN, Conv1D, Dense, BatchNormalization, Dropout, SpatialDropout1D,     GlobalMaxPool1D, GlobalAveragePooling1D, MaxPooling1D


# In[ ]:


from keras import backend as K

#K.set_floatx('float16')
#K.set_epsilon(1e-4)


# In[ ]:


from keras.callbacks import ModelCheckpoint, EarlyStopping
from keras import backend as K
from keras.callbacks import Callback
class ReduceLR(Callback):
    def __init__(self, gamma):
        self.gamma = gamma

    def on_epoch_end(self, epoch, logs={}):
        if self.gamma is not None:
            K.set_value(self.model.optimizer.lr, self.gamma * K.get_value(self.model.optimizer.lr))

lr_scheduler = ReduceLR(gamma=None)
early_stopping = EarlyStopping(patience=10, verbose = 1)

callbacks = [
    lr_scheduler,
    early_stopping,
]


# In[ ]:


from pan19ap_utils import fit_and_netptune as fit


# In[ ]:


# from keras.preprocessing.text import Tokenizer
# from keras.preprocessing.sequence import pad_sequences
from keras.layers import Dense, Input, LSTM, Embedding, Dropout, SpatialDropout1D, Flatten
from keras.layers import Bidirectional, GlobalMaxPool1D, CuDNNLSTM, Conv1D, MaxPooling1D
from keras.models import Model
from keras.models import Sequential
from keras import regularizers, layers

# build_model_culstm_dense
# build_model_culstm_culstm_dense
# build_model_biculstm_dense

# Vanilla LSTM
# Stacked LSTM
# Bidirectional LSTM
# CNN LSTM
# ConvLSTM


def build_model_emb_fln_dense_dense(
    vocab_size, embedding_dim, maxlen,
        embedding_matrix_weights=None, trainable=True,
        dropout1_rate=0.,
        dense1_units=10):
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    model = Sequential()
    model.add(layers.Embedding(input_dim=vocab_size,
                               output_dim=embedding_dim,
                               input_length=maxlen,
                               weights=embedding_matrix,
                               trainable=trainable))
    if dropout1_rate:
        model.add(SpatialDropout1D(dropout1_rate))
    model.add(Flatten())
    model.add(layers.Dense(dense1_units, activation='relu'))
    model.add(layers.Dense(1, activation='sigmoid'))
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])
    # model.summary()
    return model


def build_model_emb_culstm_dense(
    vocab_size, embedding_dim, maxlen,
    embedding_matrix_weights=None, trainable=True,
        lstm1_units=100, dropout1_rate=0., dropout2_rate=0.):
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    model = Sequential()
    model.add(layers.Embedding(input_dim=vocab_size,
                               output_dim=embedding_dim,
                               input_length=maxlen,
                               weights=embedding_matrix,
                               trainable=trainable))
    if dropout1_rate:
        model.add(Dropout(dropout1_rate))
    model.add(CuDNNLSTM(lstm1_units))
    if dropout2_rate:
        model.add(Dropout(dropout2_rate))
    model.add(Dense(1, activation='sigmoid'))
    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model


def build_model_emb_lstm_dense(
    vocab_size, embedding_dim, maxlen,
    embedding_matrix_weights=None, trainable=True,
        lstm1_units=100, lstm1_dropout=0., lstm1_recurrent_dropout=0.):
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    model = Sequential()
    model.add(layers.Embedding(input_dim=vocab_size,
                               output_dim=embedding_dim,
                               input_length=maxlen,
                               weights=embedding_matrix,
                               trainable=trainable))
    model.add(LSTM(lstm1_units, dropout=lstm1_dropout, recurrent_dropout=lstm1_recurrent_dropout))
    model.add(Dense(1, activation='sigmoid'))
    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model


def build_model_emb_conv_maxpool_culstm_dense_dense(
    vocab_size, embedding_dim, maxlen,
    embedding_matrix_weights=None, trainable=True,
    dropout1_rate=0.,
    conv1_filters=32, conv1_kernel_size=3,
    pool_size=2,
    dropout2_rate=0.,
    lstm1_units=100, lstm1_return_sequences=False,
    dropout3_rate=0.,
    dense1_units=10,
        dropout4_rate=0.):
    # https://github.com/keras-team/keras/blob/master/examples/imdb_cnn_lstm.py
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    model = Sequential()
    model.add(layers.Embedding(input_dim=vocab_size,
                               output_dim=embedding_dim,
                               input_length=maxlen,
                               weights=embedding_matrix,
                               trainable=trainable))
    if dropout1_rate:
        model.add(SpatialDropout1D(dropout1_rate))
    model.add(Conv1D(filters=conv1_filters, kernel_size=conv1_kernel_size, padding='same', activation='relu'))
    model.add(MaxPooling1D(pool_size=pool_size))
    if dropout2_rate:
        model.add(Dropout(dropout2_rate))
    model.add(CuDNNLSTM(lstm1_units, return_sequences=lstm1_return_sequences))
    if dropout3_rate:
        model.add(Dropout(dropout3_rate))
    if dense1_units:
        model.add(layers.Dense(dense1_units, activation='relu'))
    if dropout4_rate:
        model.add(Dropout(dropout4_rate))
    model.add(Dense(1, activation='sigmoid'))
    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model


def build_model_emb_conv_maxpool_lstm_dense(
    vocab_size, embedding_dim, maxlen,
    embedding_matrix_weights=None, trainable=True,
    dropout1_rate=0.,
    conv1_filters=32, conv1_kernel_size=3,
    pool_size=2,
        lstm1_units=100, lstm1_dropout=0., lstm1_recurrent_dropout=0.):
    # https://github.com/keras-team/keras/blob/master/examples/imdb_cnn_lstm.py
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    model = Sequential()
    model.add(layers.Embedding(input_dim=vocab_size,
                               output_dim=embedding_dim,
                               input_length=maxlen,
                               weights=embedding_matrix,
                               trainable=trainable))
    if dropout1_rate:
        model.add(SpatialDropout1D(dropout1_rate))
    model.add(Conv1D(filters=conv1_filters, kernel_size=conv1_kernel_size, padding='same', activation='relu'))
    model.add(MaxPooling1D(pool_size=pool_size))
    model.add(LSTM(lstm1_units, dropout=lstm1_dropout, recurrent_dropout=lstm1_recurrent_dropout))
    model.add(Dense(1, activation='sigmoid'))
    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model


def build_model_emb_conv_globmaxpool_dense_dense(
    vocab_size, embedding_dim, maxlen,
    embedding_matrix_weights=None, trainable=True,
    dropout1_rate=0.,
    conv1_filters=128, conv1_kernel_size=5,
    dropout2_rate=0.,
    dense1_units=10,
        dropout3_rate=0.,):
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    model = Sequential()
    model.add(layers.Embedding(input_dim=vocab_size,
                               output_dim=embedding_dim,
                               input_length=maxlen,
                               weights=embedding_matrix,
                               trainable=trainable))
    if dropout1_rate:
        model.add(SpatialDropout1D(dropout1_rate))
    model.add(layers.Conv1D(conv1_filters, conv1_kernel_size, activation='relu'))
    if dropout2_rate:
        model.add(Dropout(dropout2_rate))
    model.add(layers.GlobalMaxPooling1D())
    if dense1_units:
        model.add(layers.Dense(dense1_units, activation='relu'))
    if dropout3_rate:
        model.add(Dropout(dropout3_rate))
    model.add(layers.Dense(1, activation='sigmoid'))
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])
    # model.summary()
    return model


def build_model_emb_conv_globmaxpool_culstm_dense_dense(
    vocab_size, embedding_dim, maxlen,
    embedding_matrix_weights=None, trainable=True,
    dropout1_rate=0.,
    conv1_filters=128, conv1_kernel_size=5,
    dropout2_rate=0.,
    lstm1_units=16,
    dropout3_rate=0.,
    dense1_units=10,
        dropout4_rate=0.,):
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    model = Sequential()
    model.add(layers.Embedding(input_dim=vocab_size,
                               output_dim=embedding_dim,
                               input_length=maxlen,
                               weights=embedding_matrix,
                               trainable=trainable))
    if dropout1_rate:
        model.add(SpatialDropout1D(dropout1_rate))
    model.add(layers.Conv1D(conv1_filters, conv1_kernel_size, activation='relu'))
    if dropout2_rate:
        model.add(Dropout(dropout2_rate))
    model.add(layers.GlobalMaxPooling1D())
    model.add(CuDNNLSTM(lstm1_units, return_sequences=False))
    if dropout3_rate:
        model.add(Dropout(dropout3_rate))
    if dense1_units:
        model.add(layers.Dense(dense1_units, activation='relu'))
    if dropout4_rate:
        model.add(Dropout(dropout4_rate))
    model.add(layers.Dense(1, activation='sigmoid'))
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])
    # model.summary()
    return model


def build_model_emb_conv_culstm_dense_dense(
    vocab_size, embedding_dim, maxlen,
    embedding_matrix_weights=None, trainable=True,
    dropout1_rate=0.,
    conv1_filters=128, conv1_kernel_size=5,
    dropout2_rate=0.,
    lstm1_units=16,
    dropout3_rate=0.,
    dense1_units=10,
        dropout4_rate=0.,):
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    model = Sequential()
    model.add(layers.Embedding(input_dim=vocab_size,
                               output_dim=embedding_dim,
                               input_length=maxlen,
                               weights=embedding_matrix,
                               trainable=trainable))
    if dropout1_rate:
        model.add(SpatialDropout1D(dropout1_rate))
    model.add(layers.Conv1D(conv1_filters, conv1_kernel_size, activation='relu'))
    if dropout2_rate:
        model.add(Dropout(dropout2_rate))
    model.add(CuDNNLSTM(lstm1_units, return_sequences=False))
    if dropout3_rate:
        model.add(Dropout(dropout3_rate))
    if dense1_units:
        model.add(layers.Dense(dense1_units, activation='relu'))
    if dropout4_rate:
        model.add(Dropout(dropout4_rate))
    model.add(layers.Dense(1, activation='sigmoid'))
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])
    # model.summary()
    return model


# build_model_emb_tdconv_tdmaxpool_tdfln_culstm_dense
# https://machinelearningmastery.com/how-to-develop-lstm-models-for-time-series-forecasting/
# model = Sequential()
# model.add(TimeDistributed(Conv1D(filters=64, kernel_size=1, activation='relu'), input_shape=(None, n_steps, n_features)))
# model.add(TimeDistributed(MaxPooling1D(pool_size=2)))
# model.add(TimeDistributed(Flatten()))
# model.add(LSTM(50, activation='relu'))
# model.add(Dense(1))
# model.compile(optimizer='adam', loss='mse')


def build_model_emb_conv_maxpool_fln_culstm_dense(
    vocab_size, embedding_dim, maxlen,
    embedding_matrix_weights=None, trainable=True,
    dropout1_rate=0.,
    conv1_filters=32, conv1_kernel_size=3,
    pool1_size=2,
        lstm1_units=10):
    lstm1_return_sequences = False

    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    model = Sequential()
    model.add(layers.Embedding(input_dim=vocab_size,
                               output_dim=embedding_dim,
                               input_length=maxlen,
                               weights=embedding_matrix,
                               trainable=trainable))
    if dropout1_rate:
        model.add(SpatialDropout1D(dropout1_rate))
    model.add(layers.Conv1D(conv1_filters, conv1_kernel_size, activation='relu'))
    model.add(MaxPooling1D(pool_size=pool1_size))
    model.add(Flatten())
    model.add(CuDNNLSTM(lstm1_units, return_sequences=lstm1_return_sequences))
    model.add(layers.Dense(1, activation='sigmoid'))
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])
    # model.summary()
    return model


def build_model_emb_conv_maxpool_fln_dense_dense(
    vocab_size, embedding_dim, maxlen,
    embedding_matrix_weights=None, trainable=True,
    dropout1_rate=0.,
    conv1_filters=32, conv1_kernel_size=3,
    pool1_size=2,
        dense1_units=10):

    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    model = Sequential()
    model.add(layers.Embedding(input_dim=vocab_size,
                               output_dim=embedding_dim,
                               input_length=maxlen,
                               weights=embedding_matrix,
                               trainable=trainable))
    if dropout1_rate:
        model.add(SpatialDropout1D(dropout1_rate))
    model.add(layers.Conv1D(conv1_filters, conv1_kernel_size, activation='relu'))
    model.add(MaxPooling1D(pool_size=pool1_size))
    model.add(Flatten())
    model.add(layers.Dense(dense1_units, activation='relu'))
    model.add(layers.Dense(1, activation='sigmoid'))
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])
    # model.summary()
    return model


def build_model_emb_conv_maxpool_conv_maxpool_conv_maxpool_fln_dense_dense(
    # def build_model_cnn(
    vocab_size, embedding_dim, maxlen,
        embedding_matrix_weights=None, trainable=True,
        dropout1_rate=0.,
        conv1_filters=128, conv1_kernel_size=5,
        pool1_size=5,
        conv2_filters=128, conv2_kernel_size=5,
        pool2_size=5,
        conv3_filters=128, conv3_kernel_size=5,
        pool3_size=35,
        dense1_units=128):
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None

    inp = Input(shape=(maxlen,))
    x = Embedding(vocab_size, embedding_dim, weights=embedding_matrix, trainable=trainable)(inp)
    if dropout1_rate:
        x = SpatialDropout1D(dropout1_rate)(x)
    x = Conv1D(conv1_filters, conv1_kernel_size, activation='relu')(x)
    x = MaxPooling1D(pool1_size)(x)
    x = Conv1D(conv2_filters, conv2_kernel_size, activation='relu')(x)
    x = MaxPooling1D(pool2_size)(x)
    x = Conv1D(conv3_filters, conv3_kernel_size, activation='relu')(x)
    x = MaxPooling1D(pool3_size)(x)  # global max pooling
    # x = GlobalMaxPooling1D()(x)
    x = Flatten()(x)
    x = Dense(dense1_units, activation='relu')(x)
    x = Dense(1, activation='sigmoid')(x)

    model = Model(inputs=inp, outputs=x)
    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    # model.summary()
    return model


def build_model_emb_globmaxpool_dense_dense(
    vocab_size, embedding_dim, maxlen,
        embedding_matrix_weights=None, trainable=True,
        dropout1_rate=0.,
        dense1_units=10):
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    model = Sequential()
    model.add(layers.Embedding(input_dim=vocab_size,
                               output_dim=embedding_dim,
                               input_length=maxlen,
                               weights=embedding_matrix,
                               trainable=trainable))
    if dropout1_rate:
        model.add(SpatialDropout1D(dropout1_rate))
    model.add(layers.GlobalMaxPool1D())
    model.add(layers.Dense(dense1_units, activation='relu'))
    model.add(layers.Dense(1, activation='sigmoid'))
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])
    # model.summary()
    return model


def build_model_emb_biculstm_dense(
    vocab_size, embedding_dim, maxlen,
        embedding_matrix_weights=None, trainable=True,
        dropout1_rate=0.,
        lstm1_units=64,
        dropout2_rate=0.):
    # https://github.com/keras-team/keras/blob/master/examples/imdb_bidirectional_lstm.py
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    rnn_kernel_reg_l2 = 0.0001
    rnn_recurrent_reg_l2 = 0.0001
    rnn_bias_reg_l2 = 0.0001

    model = Sequential()
    model.add(layers.Embedding(input_dim=vocab_size,
                               output_dim=embedding_dim,
                               input_length=maxlen,
                               weights=embedding_matrix,
                               trainable=trainable))
    if dropout1_rate:
        model.add(SpatialDropout1D(dropout1_rate))
    model.add(Bidirectional(CuDNNLSTM(
        lstm1_units, return_sequences=False,
        kernel_regularizer=regularizers.l2(rnn_kernel_reg_l2),
        recurrent_regularizer=regularizers.l2(rnn_recurrent_reg_l2),
        bias_regularizer=regularizers.l2(rnn_bias_reg_l2))))
    if dropout2_rate:
        model.add(Dropout(dropout2_rate))
    model.add(Dense(1, activation='sigmoid'))


def build_model_emb_biculstm_globmaxpool_dense_dense(
    vocab_size, embedding_dim, maxlen,
        embedding_matrix_weights=None, trainable=True,
        dropout1_rate=0.,
        lstm1_units=50,
        dense1_units=50,
        dropout2_rate=0.):
    # https://www.kaggle.com/jhoward/improved-lstm-baseline-glove-dropout
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None
    inp = Input(shape=(maxlen,))
    x = Embedding(vocab_size, embedding_dim, weights=embedding_matrix, trainable=trainable)(inp)
    if dropout1_rate:
        x = Dropout(dropout1_rate)(x)
    x = Bidirectional(CuDNNLSTM(lstm1_units, return_sequences=True))(x)
    x = GlobalMaxPool1D()(x)
    x = Dense(dense1_units, activation="relu")(x)
    if dropout2_rate:
        x = Dropout(dropout2_rate)(x)
    x = Dense(1, activation="sigmoid")(x)
    model = Model(inputs=inp, outputs=x)
    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])


def build_model_emb_biculstm_globmaxpool_dense(
    vocab_size, embedding_dim, maxlen,
        embedding_matrix_weights=None, trainable=True,
        dropout1_rate=0.,
        lstm1_units=50,
        dropout2_rate=0.):
    embedding_matrix = globals()[embedding_matrix_weights] if embedding_matrix_weights is not None else None

    rnn_kernel_reg_l2 = 0.0001
    rnn_recurrent_reg_l2 = 0.0001
    rnn_bias_reg_l2 = 0.0001
    # dense_kernel_reg_l2 = 0.0001
    # dense_bias_reg_l2 = 0.0001

    inp = Input(shape=(maxlen,))
    x = Embedding(vocab_size, embedding_dim, weights=embedding_matrix, trainable=trainable)(inp)
    if dropout1_rate:
        x = SpatialDropout1D(dropout1_rate)(x)

    # x = Bidirectional(LSTM(50, return_sequences=True, dropout=0.1, recurrent_dropout=0.1))(x)
    x = Bidirectional(CuDNNLSTM(lstm1_units, return_sequences=True,
                                kernel_regularizer=regularizers.l2(rnn_kernel_reg_l2),
                                recurrent_regularizer=regularizers.l2(rnn_recurrent_reg_l2),
                                bias_regularizer=regularizers.l2(rnn_bias_reg_l2)))(x)
    # x = _prelu(use_prelu)(x)
    if dropout2_rate:
        x = SpatialDropout1D(dropout2_rate)(x)

    x = GlobalMaxPool1D()(x)
    # x = Dense(50, activation="relu")(x)
    # x = Dropout(0.1)(x)

    x = Dense(1, activation="sigmoid")(x)

    model = Model(inputs=inp, outputs=x)
    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    # model.summary()
    return model


# In[ ]:


#model = build_model_emb_conv_maxpool_culstm_dense_dense(
#    vocab_size=max_features+1, embedding_dim=50, maxlen=maxlen,
#)


# In[ ]:


fit_model=True


# In[ ]:


from hyperopt import hp, fmin, tpe, STATUS_OK, Trials
def objective(args):
    print(args)
    build_model_fn = globals()[args['build_model']['build_model_fn']]
    _, scores = fit(
        build_model_fn, 
        X_t, y, X_te, y_val,
        callbacks=callbacks,
        batch_size=args['fit']['batch_size'], epochs=args['fit']['epochs'],
        vocab_size=max_features+1, embedding_dim=300, maxlen=maxlen, **args['build_model']['args'])
    print(scores)

    return{'loss': -scores[1], 'status': STATUS_OK}


# In[ ]:


space_build_model_emb_conv_globmaxpool_dense_dense = {
    'data': {
    },
    'build_model': {
        'build_model_fn': 'build_model_emb_conv_globmaxpool_dense_dense',
        'args' : {
            'embedding_matrix_weights': hp.choice('m_embedding_matrix_weights', [
                None, 'embedding_matrix', 'embedding_matrix_mean'
            ]),
            'trainable': hp.choice('m_emb_trainable', [False, True]),
            'dropout1_rate': hp.choice('m_dropout1_rate', [0.,0.2,0.4,0.6]),
            'conv1_filters': hp.choice('m_conv1_filters', [8,16,32,64,128]),
            'conv1_kernel_size':hp.choice('m_conv1_kernel_size', [3,5,7]),
            'dense1_units':hp.choice('m_dense1_units', [0,8,16,32,64,128]),
        },
    },
    'fit': {
        'batch_size': 64,
        'epochs': 50,
        #'lra_scale': 0.1,
        #'milestones': [50, 60],
        #'plot_losses': True,
    },
    'fmin': {
        'max_evals': 100,
    }
}


# In[ ]:


space_build_model_emb_conv_culstm_dense_dense = {
    'data': {
    },
    'build_model': {        
        'build_model_fn': 'build_model_emb_conv_culstm_dense_dense',
        'args' : {  
            'embedding_matrix_weights': hp.choice('m_embedding_matrix_weights', [
                None, 'embedding_matrix', 'embedding_matrix_mean'
            ]),
            'trainable': hp.choice('m_emb_trainable', [False, True]),
            'dropout1_rate': hp.choice('m_dropout1_rate', [0.,0.2,0.4,0.6]),
            'conv1_filters': hp.choice('m_conv1_filters', [8,16,32,64,128]),
            'conv1_kernel_size':hp.choice('m_conv1_kernel_size', [3,5,7]),
            'dropout2_rate': hp.choice('m_dropout2_rate', [0.,0.2,0.4,0.6]),
            'lstm1_units':hp.choice('m_lstm1_units', [10,8,16,32,64,100,128]),
            'dropout3_rate': hp.choice('m_dropout3_rate', [0.,0.2,0.4,0.6]),
            'dense1_units':hp.choice('m_dense1_units', [0,8,16,32,64,128]),
            'dropout4_rate': hp.choice('m_dropout4_rate', [0.,0.2,0.4,0.6]),
        },
    },
    'fit': {
        'batch_size': 64,
        'epochs': 50,
        #'lra_scale': 0.1,
        #'milestones': [50, 60],
        #'plot_losses': True,
    },
    'fmin': {
        'max_evals': 100,
    }
}


# In[ ]:


space_build_model_emb_conv_maxpool_culstm_dense_dense = {
    'data': {
    },
    'build_model': {
        'build_model_fn': 'build_model_emb_conv_maxpool_culstm_dense_dense',
        'args' : {  
            'embedding_matrix_weights': hp.choice('m_embedding_matrix_weights', [
                None, 'embedding_matrix', 'embedding_matrix_mean'
            ]),
            'trainable': hp.choice('m_emb_trainable', [False, True]),
            'dropout1_rate': hp.choice('m_dropout1_rate', [0.,0.2,0.4,0.6]),
            'conv1_filters': hp.choice('m_conv1_filters', [8,16,32,64,128]),
            'conv1_kernel_size':hp.choice('m_conv1_kernel_size', [3,5,7]),
            'pool_size':hp.choice('m_pool_size', [2]),
            'dropout2_rate': hp.choice('m_dropout2_rate', [0.,0.2,0.4,0.6]),
            'lstm1_units':hp.choice('m_lstm1_units', [10,8,16,32,64,100,128]),
            'dropout3_rate': hp.choice('m_dropout3_rate', [0.,0.2,0.4,0.6]),
            'dense1_units':hp.choice('m_dense1_units', [0,8,16,32,64,128]),
            'dropout4_rate': hp.choice('m_dropout4_rate', [0.,0.2,0.4,0.6]),
        },
    },
    'fit': {
        'batch_size': 64,
        'epochs': 50,
        #'lra_scale': 0.1,
        #'milestones': [50, 60],
        #'plot_losses': True,
    },
    'fmin': {
        'max_evals': 100,
    }
}


# In[ ]:


space_build_model_emb_fln_dense_dense = {
    'data': {
    },
    'build_model': {
        'build_model_fn': 'build_model_emb_fln_dense_dense',
        'args' : {
            'embedding_matrix_weights': hp.choice('m_embedding_matrix_weights', [
                None, 'embedding_matrix', 'embedding_matrix_mean'
            ]),
            'trainable': hp.choice('m_emb_trainable', [False, True]),
            'dropout1_rate': hp.choice('m_dropout1_rate', [0.,0.2,0.4,0.6]),
            'dense1_units':hp.choice('m_dense1_units', [0,8,16,32,64,128]),
        },
    },
    'fit': {
        'batch_size': 64,
        'epochs': 50,
        #'lra_scale': 0.1,
        #'milestones': [50, 60],
        #'plot_losses': True,
    },
    'fmin': {
        'max_evals': 100,
    }
}


# In[ ]:


spaces = [
    # space_build_model_emb_conv_globmaxpool_dense_dense,
    # space_build_model_emb_conv_culstm_dense_dense,
    # space_build_model_emb_conv_maxpool_culstm_dense_dense,
    space_build_model_emb_fln_dense_dense,
    # build_model_emb_culstm_dense,
    # build_model_emb_conv_globmaxpool_culstm_dense_dense,
    # build_model_emb_conv_maxpool_fln_culstm_dense,
    # build_model_emb_conv_maxpool_fln_dense_dense,
    # build_model_emb_conv_maxpool_conv_maxpool_conv_maxpool_fln_dense_dense,
    # build_model_emb_globmaxpool_dense_dense,
    # build_model_emb_biculstm_dense,
    # build_model_emb_biculstm_globmaxpool_dense_dense
    # build_model_emb_biculstm_globmaxpool_dense
]


# In[ ]:


for space in spaces:
    try:
        trials = Trials()
        max_evals = space['fmin']['max_evals']
        verbose = False
        best = fmin(objective, space, algo=tpe.suggest, trials=trials, max_evals=max_evals, 
                    verbose=verbose, show_progressbar=True)
        print(best)
    except Exception as e:
        print(e, space)
        


# In[ ]:




