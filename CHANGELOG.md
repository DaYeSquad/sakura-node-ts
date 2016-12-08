# 2.0 (2016.12.8.)

### Features (该版本不计划与1.x兼容)

* **去掉了 corsAllowOnce:** 并未在工程中使用到该方式。
* **修改了 corsAllowAll:** 增加了自定义 method 以及 headers 的可选参数，如果不填，则默认形式与 1.x 时代一样。
* **修改了 SqlType 以满足 sql 自动生成以及数据迁移工具:**
  1. 删除了 VARCHAR, 改为 VARCHAR_255 以及 VARCHAR_2014
  2. 添加了 RANDOM_ID 类型用于大部分的随机 ID

  

# 1.1 (2016.11.30.)

### Features

* **增加了 lint:** 引入 tslint 来检查 TypeScript Code Style。
* **增加了 join 的方法:** 为 SqlQuery 引入了 join 方法。
  


# 1.0 (2016.11.4.)

### Features

* **将后台工程以及 API 工程中的公用方法提取为 sakura:** 含数据库的简单查询以及对应的 ORM 以及单元测试部分。
