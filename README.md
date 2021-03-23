# nakayosi-backend
The backend server of my smart phone application "nakayosi-uniapp".
It's based on Koa2, a NodeJS server framework.

# Data structure of ElasticSearch connected
Initilization Command: `curl -X PUT http://127.0.0.1:9200/question`  
```json
{
  "mappings": {
    "main": {
      "properties": {
        "title": {
          "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_max_word"
        },
        "question": {
          "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_max_word"
        },
        "answers": {
          "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_max_word"
        },
        "type": {
          "type": "keyword"
        }
      }
    }
  }
}
```
User Model: `curl -X PUT http://127.0.0.1:9200/user`
```json
{
  "mappings": {
    "main": {
      "properties": {
        "realName": {
          "type": "keyword"
        },
        "idNumber": {
          "type": "keyword"
        },
        "phoneNumber": {
          "type": "keyword"
        },
        "email": {
          "type": "keyword"
        },
        "richText": {
          "type": "keyword"
        },
        "password": {
          "type": "keyword"
        }
      }
    }
  }
}
```
Administrator Model: `curl -X PUT http://127.0.0.1:9200/admin`
```json
{
  "mappings": {
    "main": {
      "properties": {
        "username": {
          "type": "keyword"
        },
        "password": {
          "type": "keyword"
        },
        "phoneNumber": {
          "type": "keyword"
        },
        "email": {
          "type": "keyword"
        }
      }
    }
  }
}
```