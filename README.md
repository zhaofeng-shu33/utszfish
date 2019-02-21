# UTSZFISH miniprogram
=============
大学城闲置物品交换平台 


![封面图](https://github.com/ezshine/community-mini-program/blob/master/thumb.jpg)

## Background
北京大学深圳研究生院绿色+协会于2018年春季学期创办了深圳大学城闲鱼市场，最初以微信群的形式运营，在1群满500人后，逐渐扩展到2群、3群，现3个微信群达到1500人的规模，
2019年秋季学期，TPH-LINK协会成立，希望整合深圳大学城三校的社团资源，其下的技术交流组开展了一系列互联网IT领域的活动，TPH-LINK与绿色+酝酿了深圳大学城闲鱼市场微信小程序的项目，
希望能够整合3个群的信息，更好地满足广大同学的交易需求。

## How to deploy on your server
* src/app.js中更改相关的URL路径
* src为全部前端源码，api为全部后端php源码

* 在微信小程序管理后台配置域名，并将api目录上传至指定域名内
* 在API文件夹中的mysql.php中配置自己的数据库地址，用户名，微信小程序appid，secret等
* 将“数据库表.sql”导入到自己的数据库中

to be written...

## Screenshot
to be written...

## Current Functionality

### 闲鱼市集
所有同学都可以在这个版块内发布带价格的商品或者服务，但这里并没有完成支付，需要面对面交易。


## About censorship
微信小程序的审核非常严格，如果没有互联网增值业务许可证，你是无法上架一个社区小程序的。



## Reference
 [【倒计时3天】大学城闲鱼来啦！](https://mp.weixin.qq.com/s/sAu_-YEWPV5FMth1k4tw_Q)
 [TPH-Link是什么](https://mp.weixin.qq.com/s/aSn0YEtefARfdX9SXbhwwg)
 [免费的微信小程序社区系统](https://zhuanlan.zhihu.com/p/28932121)
