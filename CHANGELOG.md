# 3.3.8 (2017.12.14.)

* **修复了 MySQL 更新 Geometry 类型时坐标系问题:** 原先是没给，用了默认值 4326，改成了 0

# 3.3.7 (2017.12.6.)

* **让 update query 和其他query一样都是透过 valueAsStringByType 获取最后产生 SQL 的 value:** 原本是把相同逻辑写了一份在valueAsStringByType和buildUpdateQuery，造成可以新增geometry但不能修改的问题
* **修复了 pgdriver 类型错误问题:**

# 3.3.6 (2017.12.6.)

* **添加了一些错误输出:** 为错误输出增加标记，方便引用时判断是哪里报出的


# 3.3.1 (2017.11.27.)

* **新增Geometry type和新增findPrimaryKeyByClass function :** 新增Geometry type和新增findPrimaryKeyByClass function于sqlcontext.ts，避免让每隔人都自行撰写搜索primary key栏位名称的function


# 3.3.0 (2017.11.26.)

* **对 driver 新增 type 方便判断数据库类型 :** dbClient.driver.type 可看数据库类型


# 3.2.0 (2017.10.26.)

* **SELECT 语句在构造时不使用 wildcard :** SELECT 语句在查询所有的时候不再使用 wildcard，改为使用具体的枚举 columns
* **修复了 NUMERIC 和 BOOLEAN 类型报错问题:**


# 3.1.3 (2017.9.19.)

* **SELECT 语句在单独拼串时候取消分号 :** SELECT 语句在单独拼串时不再有分号，但是在执行 transaction 时候如果语句最后不是分号结尾会加上分号


# 3.1.1 (2017.9.8.)

* **DriverOption 支持池最大链接数 :** 可以通过设置 DriverOption.max 来设置最大并发数，默认为 10


# 3.1.0 (2017.9.4.)

* **支持 MySQL 的主从模式 :** 新增了 master-slave 模式的选项，默认在 SELECT 语句走 slave，在其余走 master，即读写分离


# 3.0.14 (2017.9.3.)

* **修复了 issue 31 :**  buildDeleteQuery及buildSelectQuery末尾无分号，造成使用queryInTransaction时拼接出错


# 3.0.13 (2017.8.31.)

* **修复了端口错误问题**


# 3.0.10 (2017.6.25.)

* **增加了mysql 随机函数实现 :**  增加了mysql builder 支持 make_radom_id 的实现


# 3.0.8 (2017.6.24.)

* **修复了 issue 23:** [postgres和mysql，插入一条数据，返回数据结构不一样](https://github.com/DaYeSquad/sakura-node-ts/issues/23)


# 3.0.5 (2017.6.14.)

* **修改原来join in 方法:** 为 SqlQuery 增加了 left join on 及 right join on 方法。
* **增加手动添加更新insert方法:** 为 InsertQuery 增加手动添加值的方法
* **增加Query 到 string 的转换方法:** 增加queryToString 方法


# 3.0.4 (3.0.1 - 3.0.4) (2017.6.12.)

* **修复并测试了 MySQL 的兼容**
* **修复了 Migration 的兼容问题**


# 3.0.0 (2017.6.8.)

* **重构了 ORM 模块以兼容 MySQL**: 新的示范可见 src/example
* **更新了包名**: 现在需要使用 npm install sakura-node-3 来安装
* **增加了 join on 的方法:** 为 SqlQuery 引入了 join on 方法。
