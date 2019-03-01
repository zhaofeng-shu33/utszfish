# UTSZFISH miniprogram
=============
大学城闲置物品交换平台 
[网页版](https://gitee.com/freewind201301/utsz-fish-web)，还在开发中，后续会迁到 GitHub 上。

## Background
北京大学深圳研究生院绿色+协会于2018年春季学期创办了深圳大学城闲鱼市场，最初以微信群的形式运营，在1群满500人后，逐渐扩展到2群、3群，现3个微信群达到1500人的规模，
2019年秋季学期，TPH-LINK协会成立，希望整合深圳大学城三校的社团资源，其下的技术交流组开展了一系列互联网IT领域的活动，TPH-LINK与绿色+酝酿了深圳大学城闲鱼市场微信小程序的项目，
希望能够整合3个群的信息，更好地满足广大同学的交易需求。

## How to deploy on your server
The code of this repository is started from [community-mini-program](https://github.com/ezshine/community-mini-program) but differs from the starting point gradually.

For the *UTSZFISH* project. We have used the LAMP backend pipe. The version of my deployment on [](https://www.leidenschaft.cn/api) uses:
* Ubuntu 18.04 LTS
* Apache2.4
* php7.2
* mysql5.7

I believe the deployment can be done for LNMP. Below is the steps for configuration for LAMP configuration(You need a cloud server with public ip address, domain name and ssl certificate).

I recommand to configure the backend first, because you can test it immediately. 
### Backend
The backend uses third-party api, which is listed as follows:
* **douban**: GET https://api.douban.com/v2/book/isbn/[isbn]
* **wechat**

* create a database by mysql client, then choose a database prefix for your project, the default is
*utsz*, you can change it by *Replace All* through a text editor or by command line:
```shell
perl -p -e "s/utsz/custom_name/g" -i db.sql
```
After that, you can execute `source db.sql` in mysql client.
* In directory `api`, copy `mysql-sample.php` to `mysql.php` and make the following entries complete:
    * database host, name, user and password
    * table prefix, use `custom_name` for example
    * your miniprogram appid and secret
Since the `api` directory contains all the backend code, after the above deployment, you can test your configuration by `curl [https root]/api/login.php`. If the return code is 200, it is ok; otherwise, check your php log error.

* 在微信小程序管理后台配置域名
* src/app.js中更改相关的URL路径, including `getAppName`, `CDNUrl` and `ServerUrl`.
* In `src/project.config.json`, use your custom projectname and `appid`
to be written...

## Screenshot
to be written...

## Current Functionality

### 闲鱼市集
所有同学都可以在这个版块内发布带价格的商品或者服务，但这里并没有完成支付，需要面对面交易。


## About censorship
微信小程序的审核非常严格，如果没有互联网增值业务许可证，你是无法上架一个社区小程序的。



## Reference
 * [【倒计时3天】大学城闲鱼来啦！](https://mp.weixin.qq.com/s/sAu_-YEWPV5FMth1k4tw_Q)
 * [TPH-Link是什么](https://mp.weixin.qq.com/s/aSn0YEtefARfdX9SXbhwwg)
 * [免费的微信小程序社区系统](https://zhuanlan.zhihu.com/p/28932121)

### ChangeLog
 * v0.5
 ** add college, realname
 * v0.4 
 ** use green plus logo

### License
Apache License V2.0