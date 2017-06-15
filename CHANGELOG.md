# 3.0.5 (2017.6.14.)

* **修改原来join in 方法:** 为 SqlQuery 增加了 left join on 及 right join on 方法。
* **增加手动添加更新insert方法:** 为 InsertQuery 增加手动添加值的方法


# 3.0.4 (3.0.1 - 3.0.4) (2017.6.12.)

* **修复并测试了 MySQL 的兼容**
* **修复了 Migration 的兼容问题**


# 3.0.0 (2017.6.8.)

* **重构了 ORM 模块以兼容 MySQL**: 新的示范可见 src/example
* **更新了包名**: 现在需要使用 npm install sakura-node-3 来安装
* **增加了 join on 的方法:** 为 SqlQuery 引入了 join on 方法。
