FORMAT: 1A
HOST: https://api.gagogroup.cn/api

# Group Monitor

## 获得所有用户信息 [/products]

### 获得所有用户信息，以数组的形式返回 [GET]

+ Request (application/json)

    + Headers

            Token: it-is-a-token

+ Response 200 (application/json)

    + Body

            {
                "data": {
                    "users": [
                        {
                            "uid": 1,
                            "displayName": "linxiaoyi"
                        },
                        {
                            "uid": 2,
                            "displayName": "huangtaihu"
                        }
                    ]
                }
            }

