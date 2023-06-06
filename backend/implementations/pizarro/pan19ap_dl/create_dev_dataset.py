import glob
import os

xmls_base_directory_train = './pan19-author-profiling-training-2019-02-18-train' 
xmls_target_directory_dev = './pan19-author-profiling-training-2019-02-18-dev'
langs = ["en", "es"]

for lang in langs:
	xmls_directory = xmls_base_directory_train + "/" + lang
	truth_dev_file = xmls_directory + "/truth-dev.txt"
 
	dev_xmls = []
	with open(truth_dev_file, "r") as f:
		for line in f:
			dev_xmls.append(line.split(":::")[0])
 
	xmls = glob.glob(xmls_directory + "/*.xml")
	for xml in xmls:
		if xml.split("/")[-1].split(".")[0] in dev_xmls:
			# Move xml to target directory
			os.system("mv " + xml + " " + xmls_target_directory_dev + "/" + lang)
		
		