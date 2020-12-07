import pandas as pd
import json
import requests
import time

FILE_PATH = './data/psychology_utf8.csv'
OUTPUT_PATH = './data/psychology_processed.csv'
USEFUL_COLUMNS = ['title', 'questions', 'answer_txt1', 'answer-txt2', 'answer_txt3',
                  'answer-txt4', 'answer_txt5', 'answer_txt6', 'answer_txt7',
                  'type']
COLUMN_NAME_TYPE = 'type'
COLUMN_NAME_PREFIX_ANSWER = 'answer'
COLUMN_NAME_ANSWERS = 'answers'
COLUMN_NAME_QUESTIONS = 'questions'
COLUMN_NAME_QUESTION = 'question'
NUM_OF_USEFUL_ROWS = 4999
TEST_ROWS_NUM = 3
NUM_OF_USEFUL_COLUMNS = 10
ELASTIC_SERVER_URL = "http://127.0.0.1:9200/question/main"
SLEEP_TIME_SECS = 0.05


def process_type_data(type_str: str) -> list:
    try:
        line_separated: list = type_str.split('\n')
        for i in range(len(line_separated)):
            line_separated[i] = line_separated[i].strip()
        empty_count = line_separated.count('')
        for j in range(empty_count):
            line_separated.remove('')
        return line_separated
    except AttributeError:
        # if type_str is nan
        return []


def print_response(rsp: str, cnt_cur: int, cnt_all: int):
    print('電波通信できました！')
    print(f'サーバーからの返事: {rsp}')
    print(f'通信回数: {cnt_cur + 1} of {cnt_all}')
    print('🌈🌈')


if __name__ == '__main__':
    data = pd.read_csv(FILE_PATH)
    useful_data: pd.DataFrame = data.loc[:, USEFUL_COLUMNS]
    useful_data = useful_data.fillna('')
    dict_to_post = {}
    for row in range(NUM_OF_USEFUL_ROWS):
        dict_to_post.clear()
        answer_list = []
        for column in USEFUL_COLUMNS:
            value = useful_data.loc[row, column]
            if column == COLUMN_NAME_TYPE:
                dict_to_post[column] = process_type_data(value)
            elif column.startswith(COLUMN_NAME_PREFIX_ANSWER):
                if value != '':
                    answer_list.append(value)
                else:
                    pass
            elif column == COLUMN_NAME_QUESTIONS:
                dict_to_post[COLUMN_NAME_QUESTION] = value
            else:
                dict_to_post[column] = value
            dict_to_post[COLUMN_NAME_ANSWERS] = answer_list
        json_to_post = json.dumps(dict_to_post, ensure_ascii=False)
        response = requests.post(url=ELASTIC_SERVER_URL, data=json_to_post.encode('utf-8'))
        print_response(response.text, row, NUM_OF_USEFUL_ROWS)
        time.sleep(SLEEP_TIME_SECS)
    exit(0)
