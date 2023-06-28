## Code for experiments conducted in the papers 'Who is hot and who is not? profiling celebs on twitter' and 'Fake or not: Distinguishing between bots, males and females' submitted to the Tenth International Conference of the CLEF Association (CLEF 2019) as part of the PAN author profiling task ##

Please cite these papers [[bib](https://github.com/matejMartinc/PAN2019/blob/master/bibtex.js)] if you use this code.

## Installation, documentation ##

Published results were produced in Python 3 programming environment on Linux Mint 18 Cinnamon operating system. Instructions for installation assume the usage of PyPI package manager.<br/>

To get the source code, clone the repository from github with 'git clone https://github.com/EMBEDDIA/PAN2019'<br/><br/>

Data for the bot vs male vs female classification can be downloaded from here: <br/>
https://zenodo.org/record/3692340#.YAARLNYo-Uk <br/>
Data for the celebrity classification can be downloaded from here: <br/>
https://zenodo.org/record/3885373#.YAASeNYo-Uk <br/>

Install dependencies if needed: pip install -r requirements.txt

### We have added a Jupyter notebook (see gender/src/example_usage.ipynb) in order to explain specific steps in the code.

### To reproduce the results of celebrity classification published in the paper run the code in the command line using following commands: ###

Read data and generate features:<br/>
```
python parse_data.py --num_samples 100 --train_corpus pathToTrainCorpus --train_labels pathToTrainLabels --feature_folder pathToOutputFeatureFolder --all_data
```

Remove the '--all_data' flag if you want to reproduce the results on the evaluation set. If the flag is removed, 3837 examples are removed from the train set and used as a validation set.<br/><br/>
Evaluate on development set:<br/>
```
python evaluate.py --feature_folder pathToOutputFeatureFolder
```

Generate test set predictions:<br/>
```
python test.py --input pathToTestCorpus --output pathToResultsFolder --feature_folder pathToOutputFeatureFolder
```

## To reproduce the results of bot vs male vs female classification published in the paper run the code in the command line using following commands: ###

Read data and generate features:<br/>
```
python parse_data.py --train_corpus pathToTrainCorpus --feature_folder pathToOutputFeatureFolder
```

Evaluate on development set:<br/>
```
python evaluate.py --feature_folder pathToOutputFeatureFolder
```

Generate test set predictions:<br/>
```
python test.py --input pathToTestCorpus --output pathToResultsFolder --feature_folder pathToOutputFeatureFolder
```


## Contributors to the code ##

Matej Martinc, Blaž Škrlj<br/>

* [Knowledge Technologies Department](http://kt.ijs.si), Jožef Stefan Institute, Ljubljana
