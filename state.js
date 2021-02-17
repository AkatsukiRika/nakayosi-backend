const state = {
    // global variables
    PROGRAM_NAME: 'nakayosi-backend',
    VERSION_CODE: '1.0.0',
    // variables concerning elasticsearch
    ELASTIC_ADDR: 'http://127.0.0.1:9200',
    ELASTIC_MAIN_SUFFIX: '/question/main',
    ELASTIC_SEARCH_SUFFIX: '/_search',
    ELASTIC_QUESTION_DEL_SUFFIX: '/question/_delete_by_query',
    // resources on server
    AUDIO_PATH_PREFIX: '/public/nkbgm'
}

module.exports = state