FORMAT: 1A
HOST: https://api.gagogroup.cn/api

# Group Monitor

## 新增所有用户信息 [/products/{pid}]

### 新增所有用户信息 [POST]

+ Request (application/json)

    + Headers

            Token: it-is-a-token

    + Body

            {
                "username": "linxiaoyi",
                "displayName": "lindaxian"
            }

+ Parameters

    + pid: 15 (number, required) - 产品 ID

+ Response 200 (application/json)

    + Body

            {
                "data": {
                    "message": "ok"
                }
            }

