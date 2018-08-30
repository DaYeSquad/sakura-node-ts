# 3.5.7 - 3.5.8 (2018.8.30.)

* **修复当 apiDoc 产生 unit test 的错误:** 当 responseBody 有数组时，会产生大量测试代码的问题

# 3.5.6 (2018.8.17.)

* **支持面向文档编程:** 新增 apiDoc 直接生成 api blueprint 文件和单元测试代码

# 3.4.7 (2018.3.29.)

* **QueryResult 支持回传 query 后影响的总 row 数:** 若为 select 会是 select 到的总 row 数，若为 update, delete 则为影响的总 row 数，transation 目前底层框架不支持，会回传 NaN 

# 3.4.6 (2018.3.18.)

* **修正了在 SELECT 的时候的一处错误:** 在 SELECT 的时候如果你设置 column type 为 NUMERIC，但是实际值为 null，在之前会返回 0


# 3.4.0 (2018.1.4.)

* **支持以 UUID v4 为主键:** 在 INSERT 语句的支持默认使用 UUID 的值
* **修复注入攻击问题:** 引入 DBClient.escape(value: any)，同时有 static method 和 instance method
* **忽略了泰瑚提出的 where 为空的情况:** 在 where 的 array 中如果有空值了话拼接时候会有错误，但是如果处理了该场景，可能会难以 debug
* **支持 INNER JOIN:** 支持 INNER JOIN 的语法
* **支持自动插入 created_at、updated_at 以及 is_deleted:** 如果该类继承自 GGModel 则会自动插入 created_at、updated_at 以及 is_deleted
* **InsertQuery、UpdateQuery 支持自动填充 created_at、updated_at:** 另外还有参数可以关闭该功能，详见 GGModel 注释


# 3.3.8 - 3.3.9 (2017.12.14.)

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
