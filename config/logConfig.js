var path = require('path');
// 日志根目录
var baseLogPath = path.resolve(__dirname, '../logs');
// 错误日志目录
var errorPath = "/error";
// 错误日志文件名
var errorFileName = "error";
// 错误日志输出完整路径
var errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
// TEST
console.log('baseLogPath', baseLogPath);
console.log('errorPath', errorPath);
console.log('errorFileName', errorFileName);
console.log('errorLogPath', errorLogPath);

// 响应日志目录
var responsePath = "/response";
// 响应日志文件名
var responseFileName = "response";
// 响应日志输出完整路径
var responseLogPath = baseLogPath + responsePath + "/" + responseFileName;
// TEST
console.log('baseLogPath', baseLogPath);
console.log('responsePath', responsePath);
console.log('responseFileName', responseFileName);
console.log('responseLogPath', responseLogPath);

module.exports = {
    "appenders": {
        errorLogger: {
            "category": "errorLogger",
            "type": "dateFile",
            "filename": errorLogPath,
            "pattern": "yyyy-MM-dd-hh",
            "alwaysIncludePattern": true
        },
        resLogger: {
            "category": "resLogger",
            "type": "dateFile",
            "filename": responseLogPath,
            "pattern": "yyyy-MM-dd-hh",
            "alwaysIncludePattern": true
        },
        console: {
            "type": "console"
        }
    },
    "categories": {
        errorLogger: {
            appenders: ["errorLogger"],
            level: "info"
        },
        resLogger: {
            appenders: ["resLogger"],
            level: "info"
        },
        default: {
            appenders: ["console"],
            level: "info"
        }
    },
    "baseLogPath": baseLogPath
}