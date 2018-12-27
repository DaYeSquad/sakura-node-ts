FORMAT: 1A
HOST: https://api.gagogroup.cn/api

# Group Monitor

## 删除所有用户信息 [/products/{pid}]

### 删除所有用户信息 [DELETE]

+ Request (application/json)

    + Headers

            Token: it-is-a-token

+ Parameters

    + pid: 15 (number, required) - 产品 ID

+ Response 200 (application/json)

    + Body

            {
                "data": {
                    "message": "ok"
                }
            }

