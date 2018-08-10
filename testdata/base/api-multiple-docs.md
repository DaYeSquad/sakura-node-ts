FORMAT: 1A
HOST: https://api.gagogroup.cn/api

## 新增所有用户信息 [/products/{pid}]

### 新增所有用户信息 [POST]

+ Parameters

    + pid: 15 (number, required) - 产品 ID

+ Request (application/json)

    + Body

            {
                "username": "linxiaoyi",
                "displayName": "lindaxian"
            }

+ Response 200 (application/json)

    + Body

            {
                "data": {
                    "message": "ok"
                }
            }

## 删除所有用户信息 [/products/{pid}]

### 删除所有用户信息 [DELETE]

+ Parameters

    + pid: 15 (number, required) - 产品 ID

+ Response 200 (application/json)

    + Body

            {
                "data": {
                    "message": "ok"
                }
            }

