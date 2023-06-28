import csv
import os
from lxml import etree

csv_file = open("reddit-posts.csv", "w")
csv_writer = csv.writer(csv_file)
csv_writer.writerow(["id", "text"])

xml_parser = etree.XMLParser(recover=True)
for file in os.listdir("../datasets/blm-threads"):
    try:
        xml = etree.parse(os.path.join("assets", file), parser=xml_parser)
        root = xml.getroot()
        for post in root.iter("post"):
            id = post.find("id").text
            text = post.find("body").text
            csv_writer.writerow([id, text])
    except:
        print("Error in file: ", file)

csv_file.close()
