# prepare dataset


# train


# get acc
```
python pan_v1_acc.py \
        -c /pan19-author-profiling-training-2019-02-18 \
        -o /tira/2019-03-26-23-50-54/output
```

# predict 

## with model v1.json in pan-models-v1

```
python pan_v1_predict.py \
	-md /pan-models-v1 \
	-mc v1.json \
	-c /pan19-author-profiling-training-2019-02-18-dev \
	-o /pan-test-out
```

## v1.json sample
```
{
  "en": {
    "human_or_bot": {
      "vectorizer": "human_or_bot.alc-sklearn-hyperopt.4c77129d869c945a03b3d0f46a432722.56db10fcf25fd578e4177cc325522ff9",
      "model": "human_or_bot.alc-sklearn-hyperopt.4c77129d869c945a03b3d0f46a432722.56db10fcf25fd578e4177cc325522ff9.a75bed10306f3c44059062c19a3e7641"
    },
    "gender": {
      "vectorizer": "gender.alc-sklearn-hyperopt.4c77129d869c945a03b3d0f46a432722.4ef263f3cbc94c9f0e6aa99b88874486",
      "model": "gender.alc-sklearn-hyperopt.4c77129d869c945a03b3d0f46a432722.4ef263f3cbc94c9f0e6aa99b88874486.546e5098668afd0f32ae16e09160ac22"
    }
  },
  "es": {
    "human_or_bot": {
      "vectorizer": "human_or_bot.alc-sklearn-hyperopt.4c77129d869c945a03b3d0f46a432722.2c934bf38fa74c5978029c119d0deddb",
      "model": "human_or_bot.alc-sklearn-hyperopt.4c77129d869c945a03b3d0f46a432722.2c934bf38fa74c5978029c119d0deddb.a75bed10306f3c44059062c19a3e7641"
    },
    "gender": {
      "vectorizer": "gender.alc-sklearn-hyperopt.4c77129d869c945a03b3d0f46a432722.97002196dd454da195c2a2b7858ca8bd",
      "model": "gender.alc-sklearn-hyperopt.4c77129d869c945a03b3d0f46a432722.97002196dd454da195c2a2b7858ca8bd.f9c131f1751c60c137cf37183acc90fc"
    }
  }
}
```
