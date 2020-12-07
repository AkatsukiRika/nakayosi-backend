import codecs

FILE_PATH_ORIGINAL = "./data/一心理问答数据.csv"
FILE_PATH_UTF8 = "./data/psychology_utf8.csv"
FILE_PATH_PROCESSED_UTF8 = "./data/psychology_processed.csv"
FILE_PATH_PROCESSED_GBK = "./data/psychology_processed_gbk.csv"


def read_file(file_path, encoding='gbk'):
    with codecs.open(file_path, 'r', encoding) as f:
        return f.read()


def write_file(file_path, u, encoding='utf-8'):
    with codecs.open(file_path, 'wb') as f:
        f.write(u.encode(encoding, errors='ignore'))


def gbk_to_utf8(src, dst):
    content = read_file(src)
    write_file(dst, content)


def utf8_to_gbk(src, dst):
    content = read_file(src, encoding='utf-8')
    write_file(dst, content, encoding='gbk')


if __name__ == '__main__':
    # gbk_to_utf8(FILE_PATH_ORIGINAL, FILE_PATH_UTF8)
    utf8_to_gbk(FILE_PATH_PROCESSED_UTF8, FILE_PATH_PROCESSED_GBK)
