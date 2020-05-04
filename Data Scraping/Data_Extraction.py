import os
import datetime
import time
from string import punctuation
from string import digits
from string import whitespace
import pymongo


def connect_database():
    client = pymongo.MongoClient('mongodb://root:kethan@3.83.239.149:27017/')
    db = client['book_catalog']
    book_info = db['book_info']
    processing_info = db['processing_info']
    return book_info, processing_info


def clean_strings(val):
    # removing whitespaces at the both ends before removing the garbage values
    val = val.strip(whitespace)
    # removing punctuation marks at the both ends
    val = val.strip(punctuation)
    # removing whitespaces that are present after removing punctuation marks
    val = val.strip(whitespace)
    # removing digits at the end of the string
    val = val.rstrip(digits)
    # removing whitespaces that are present after removing the garbage values
    val = val.strip(whitespace)
    return val


def store_content_in_database(books_info):
    book_info_collection.insert_many(books_info)


def store_processing_times_in_database(processing_info):
    processing_info_collection.insert_one(processing_info)


def extract_content():
    count = 0
    for filename in os.listdir("../gutindex_files"):
        with open(os.path.join("../gutindex_files", filename), 'r', encoding="utf8") as file:
            soup = file.read()

            # print(soup)
            books_database = []
            processing_info = dict()

            # capturing the starting time of the process
            processing_info["starting_time"] = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')

            soup_string = str(soup)[15:-18]
            index = soup_string.find("TITLE")
            soup_string = soup_string[index+80:]
            soup_string = soup_string.split("\n\n")

            for line in soup_string:
                updated_vals = []
                vals = line.split("by")
                for val in vals[:2]:
                    # removing whitespace to skip the strings with Subtitles
                    val = val.strip(whitespace)
                    if val.__contains__("\n"):
                        val = val.split("\n")[0]
                    if not val.startswith('['):
                        val = clean_strings(val)
                        updated_vals.append(val)
                # create a dictionary to store in db
                book_details = dict()
                if len(updated_vals) == 2:
                    book_details["book_name"] = updated_vals[0]
                    book_details["author_name"] = updated_vals[1]
                elif len(updated_vals) == 1:
                    book_details["book_name"] = updated_vals[0]
                    book_details["author_name"] = 'Unknown'
                books_database.append(book_details)
            store_content_in_database(books_database)

            # capturing the ending time of the process
            processing_info["ending_time"] = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
            store_processing_times_in_database(processing_info)

            # Sleep for 5 minutes or 300 seconds
            time.sleep(300)


if __name__ == "__main__":
    # extract all the books and author names and inserts in database
    book_info_collection, processing_info_collection = connect_database()
    extract_content()
