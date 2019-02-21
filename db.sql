SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";



-- 
-- 表的结构 `utsz_articles`
-- 
create table ISBN(
    id int primary key auto_increment,
    isbn varchar(15),
    author varchar(20),
    coverurl varchar(200),
    title varchar(50),
    subtitle varchar(80),
    publisher varchar(50),
    pubdate varchar(20),
    pages varchar(10),
    price varchar(20),
    bookdesc text,
    authordesc text,
    tags varchar(200)
) default charset=utf8mb4;

CREATE TABLE `utsz_articles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `authorid` varchar(32),
  `createdate` int(10) unsigned,
  `updatetime` int(10) unsigned COMMENT '更新/擦亮时间',
  `pics` varchar(500),
  `text` varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `url` varchar(1000),
  `gps` varchar(50),
  `gpsaddr` varchar(50),
  `gpscity` varchar(10),
  `type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '0-98论坛99公告100商店101达人102PK103接龙',
  `eventid` int(10) unsigned,
  `title` varchar(1000) COMMENT '商品标题',
  `price` int(10) unsigned COMMENT '价格(分)',
  `unit` varchar(2),
  `exchangecoin` int(10) unsigned COMMENT '积分抵扣额度',
  `exchangeprice` int(10) unsigned COMMENT '可换人民币额度',
  `exchangedesc` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT '积分兑换说明',
  `telephone` varchar(11),
  `viewcount` int(8) unsigned COMMENT '访问量',
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `masked` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '匿名',
  `disablecomment` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '禁止评论',
  PRIMARY KEY (`id`),
  KEY `authorid` (`authorid`,`gpscity`,`type`),
  KEY `title` (`title`(255),`price`),
  KEY `viewcount` (`viewcount`),
  KEY `deleted` (`deleted`),
  KEY `updatetime` (`updatetime`),
  KEY `priceexchange` (`exchangeprice`),
  KEY `masked` (`masked`),
  KEY `disablecomment` (`disablecomment`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

-- 
-- 表的结构 `utsz_books`
-- 

CREATE TABLE `utsz_books` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `isbn` varchar(20),
  `ownerid` varchar(32),
  `createdate` int(10) unsigned,
  `status` tinyint(1) unsigned COMMENT '0可借1已借出',
  `title` varchar(50),
  `coverurl` varchar(100),
  `telephone` varchar(11),
  PRIMARY KEY (`id`),
  KEY `isbn` (`isbn`,`ownerid`,`status`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

-- 
-- 表的结构 `utsz_coinhistory`
-- 

CREATE TABLE `utsz_coinhistory` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` varchar(32) CHARACTER SET utf8,
  `value` int(10),
  `createdate` int(10) unsigned,
  `msg` varchar(50) CHARACTER SET utf8,
  `type` tinyint(1) unsigned,
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`,`createdate`,`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- 表的结构 `utsz_comment`
-- 

CREATE TABLE `utsz_comment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `authorid` varchar(32),
  `articleid` int(10) unsigned,
  `replyid` int(10) unsigned,
  `text` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `createdate` int(10) unsigned,
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `authorid` (`authorid`,`articleid`,`replyid`,`createdate`),
  KEY `deleted` (`deleted`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

-- 
-- 表的结构 `utsz_exchangehistory`
-- 

CREATE TABLE `utsz_exchangehistory` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` varchar(32) CHARACTER SET utf8,
  `goodsid` int(10) unsigned,
  `exchangecoin` int(10) unsigned,
  `exchangeprice` int(10) unsigned,
  `createdate` int(10) unsigned,
  `exchangetime` int(10) unsigned,
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`,`goodsid`,`createdate`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- 表的结构 `utsz_formids`
-- 

CREATE TABLE `utsz_formids` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` varchar(32) CHARACTER SET utf8,
  `formid` varchar(32) CHARACTER SET utf8,
  `createdate` int(10) unsigned,
  `used` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`,`createdate`),
  KEY `used` (`used`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- 表的结构 `utsz_like`
-- 

CREATE TABLE `utsz_like` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(32),
  `articleid` int(10) unsigned,
  `createdate` int(10) unsigned,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`,`articleid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;




-- --------------------------------------------------------

-- 
-- 表的结构 `utsz_members`
-- 

CREATE TABLE `utsz_members` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `openid` varchar(32),
  `nickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `headimg` varchar(150),
  `gender` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '1男2女',
  `area` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `city` varchar(20),
  `province` varchar(20),
  `country` varchar(20),
  `age` tinyint(2) unsigned,
  `slogan` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `tags` varchar(100),
  `career` varchar(10),
  `mobile` varchar(20),
  `wechatid` varchar(20),
  `realname` varchar(10),
   `studentid` varchar(12),
  `college` varchar(15),
  `qq` varchar(15),
  `type` tinyint(1) unsigned NOT NULL DEFAULT '10' COMMENT '1管理2官方7认证商铺8认证业主10普通',
  `joindate` int(10) unsigned,
  `lastlogin` int(10) unsigned COMMENT '最后登录',
  `baned` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '封禁',
  `coin` int(10) unsigned NOT NULL DEFAULT '50' COMMENT '积分/代币',
  PRIMARY KEY (`id`),
  UNIQUE KEY `openid` (`openid`),
  KEY `gender` (`gender`,`city`,`province`,`country`,`type`,`joindate`),
  KEY `baned` (`baned`),
  KEY `area` (`area`),
  KEY `coin` (`coin`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

-- 
-- 表的结构 `utsz_services`
-- 

CREATE TABLE `utsz_services` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50),
  `telephone` varchar(50),
  `type` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `text` varchar(5000),
  `ownerid` varchar(32),
  PRIMARY KEY (`id`),
  KEY `title` (`title`,`type`),
  KEY `ownerid` (`ownerid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

-- 
-- 表的结构 `utsz_vote`
-- 

CREATE TABLE `utsz_vote` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(32) CHARACTER SET utf8,
  `createdate` int(10) unsigned,
  `votevalue` tinyint(1) unsigned COMMENT '1反对2支持',
  `comment` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `articleid` int(10) unsigned,
  PRIMARY KEY (`id`),
  KEY `authorid` (`uid`,`createdate`,`votevalue`,`articleid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- 表的结构 `utsz_werun`
-- 

CREATE TABLE `utsz_werun` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` varchar(32) CHARACTER SET utf8,
  `stepcount` int(6) unsigned NOT NULL DEFAULT '0',
  `timestamp` int(10) unsigned,
  `updatetime` int(10) unsigned,
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`,`stepcount`),
  KEY `wxtimestamp` (`timestamp`),
  KEY `updatetime` (`updatetime`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
