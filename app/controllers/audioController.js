const fs = require('fs')
const util = require('util')
const state = require('../../state')

function getFileNumFromAudioName(name) {
    return Number(name.split('_', 3)[1])
}

function getVersionFromAudioName(name) {
    const withSuffix = name.split('_', 3)[2]
    return Number(withSuffix.split('.')[0])
}

function audioNameArraySort(nameA, nameB) {
    const fileNumA = getFileNumFromAudioName(nameA)
    const fileNumB = getFileNumFromAudioName(nameB)
    return fileNumA - fileNumB
}

/**
 * @author MizunoAkari
 * @method POST
 * @param {
 *    "localAudioList": [
 *       "nkbgm_1001_1.mp3",
 *       "nkbgm_1002_1.mp3",
 *       "nkbgm_1003_9.mp3"
 *    ]
 * }
 * @param name nkbgm_[INT, from 1001 to 9999, file number]_[INT, starts from 1, version code]
 * @returns {
 *    "updateList": [
 *       "nkbgm_1003_10.mp3"
 *    ],
 *    "addList": [
 *       "nkbgm_1004_8.mp3",
 *       "nkbgm_1005_1.mp3"
 *    ],
 *    "delList": [
 *       "nkbgm_1002_1.mp3"
 *    ]
 * }
 */
exports.checkUpdate = async (ctx, next) => {
    // TODO: ADD UNIT TEST FOR THIS FUNCTION!!
    const clientList = ctx.request.body.localAudioList
    clientList.sort(audioNameArraySort)
    console.log('CLIENT_LIST', clientList)
    const readDir = util.promisify(fs.readdir)
    const serverList = await readDir(state.AUDIO_PATH_PREFIX)
    serverList.sort(audioNameArraySort)
    console.log('SERVER_LIST', serverList)
    let updateList = []
    let addList = []
    let delList = []
    let clientPtr = 0
    let serverPtr = 0
    while (clientPtr < clientList.length && serverPtr < serverList.length) {
        const fileNumI = getFileNumFromAudioName(clientList[clientPtr])
        console.log('FILE_NUM_I', fileNumI)
        const fileNumJ = getFileNumFromAudioName(serverList[serverPtr])
        console.log('FILE_NUM_J', fileNumJ)
        const versionI = getVersionFromAudioName(clientList[clientPtr])
        console.log('VERSION_I', versionI)
        const versionJ = getVersionFromAudioName(serverList[serverPtr])
        console.log('VERSION_J', versionJ)
        if (fileNumI === fileNumJ) {
            if (versionI < versionJ) {
                updateList.push(serverList[serverPtr])
            } else if (versionI === versionJ) {
                // no-op
            } else {
                // TODO: API ERROR!
            }
            clientPtr++
            serverPtr++
        } else if (fileNumI < fileNumJ) {
            delList.push(clientList[clientPtr])
            clientPtr++
        } else {
            addList.push(serverList[serverPtr])
            serverPtr++
        }
    }
    ctx.body = {
        "updateList": updateList,
        "addList": addList,
        "delList": delList
    }
}