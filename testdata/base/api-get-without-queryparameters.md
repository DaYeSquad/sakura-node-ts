## 获得所有用户信息 [/products]

### 获得所有用户信息，以数组的形式返回 [GET]

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