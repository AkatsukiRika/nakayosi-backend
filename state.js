const state = {
    // global variables
    PROGRAM_NAME: 'nakayosi-backend',
    VERSION_CODE: '0.2.2 DEV',
    // variables concerning elasticsearch
    ELASTIC_ADDR: 'http://127.0.0.1:9200',
    ELASTIC_MAIN_SUFFIX: '/question/main',
    ELASTIC_SEARCH_SUFFIX: '/_search',
    // resources on server
    AUDIO_PATH_PREFIX: '/public/nkbgm'
}

module.exports = state