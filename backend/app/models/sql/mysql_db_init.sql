-- 代理网站表
CREATE TABLE `proxy_websites` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` VARCHAR(100) NOT NULL COMMENT '网站名称',
  `url` VARCHAR(500) NOT NULL COMMENT '网站URL',
  `description` TEXT NULL COMMENT '网站描述',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `crawl_interval` INT NOT NULL DEFAULT 3600 COMMENT '爬取间隔(秒)',
  `last_crawl_time` DATETIME NULL COMMENT '最后爬取时间',
  `success_rate` DOUBLE NOT NULL DEFAULT 0 COMMENT '成功率(0-100)',
  `total_proxies` INT NOT NULL DEFAULT 0 COMMENT '累计抓取的代理数量',
  `valid_proxies` INT NOT NULL DEFAULT 0 COMMENT '当前有效代理数量',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_proxy_websites_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 代理池表
CREATE TABLE `proxies` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `ip` VARCHAR(45) NOT NULL COMMENT '代理IP(支持IPv6)',
  `port` INT NOT NULL COMMENT '代理端口',
  `protocol` VARCHAR(10) NOT NULL DEFAULT 'http' COMMENT '协议(http/https/socks4/socks5)',
  `country` VARCHAR(50) NULL COMMENT '国家/地区',
  `region` VARCHAR(100) NULL COMMENT '省份/州',
  `city` VARCHAR(100) NULL COMMENT '城市',
  `isp` VARCHAR(100) NULL COMMENT '运营商',
  `anonymity` VARCHAR(20) NOT NULL DEFAULT 'unknown' COMMENT '匿名度(elite/anonymous/transparent/unknown)',
  `speed` DOUBLE NULL COMMENT '响应速度(毫秒)',
  `success_rate` DOUBLE NOT NULL DEFAULT 0 COMMENT '成功率(0-100)',
  `last_check_time` DATETIME NULL COMMENT '最后检测时间',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否有效',
  `source_website_id` BIGINT UNSIGNED NULL COMMENT '来源网站ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_proxies_is_active` (`is_active`),
  KEY `idx_proxies_protocol` (`protocol`),
  KEY `idx_proxies_country` (`country`),
  KEY `idx_proxies_source_site` (`source_website_id`),
  CONSTRAINT `fk_proxies_source_site`
    FOREIGN KEY (`source_website_id`)
    REFERENCES `proxy_websites` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
  -- , UNIQUE KEY `uq_proxies_ip_port_protocol` (`ip`,`port`,`protocol`)  -- 可选：去重
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
