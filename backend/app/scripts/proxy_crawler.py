#!/usr/bin/env python3
"""
代理爬取脚本
支持从多个免费代理网站爬取代理信息
"""

import requests
import re
import time
import random
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ProxyCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.timeout = 10
        
    def crawl_kuaidaili(self) -> List[Dict]:
        """爬取快代理"""
        proxies = []
        try:
            urls = [
                'https://www.kuaidaili.com/free/inha/',
                'https://www.kuaidaili.com/free/intr/',
                'https://www.kuaidaili.com/free/outha/'
            ]
            
            for url in urls:
                try:
                    response = self.session.get(url, timeout=self.timeout)
                    response.raise_for_status()
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    rows = soup.select('tbody tr')
                    for row in rows:
                        cols = row.select('td')
                        if len(cols) >= 7:
                            ip = cols[0].text.strip()
                            port = cols[1].text.strip()
                            anonymity = cols[2].text.strip()
                            protocol = cols[3].text.strip().lower()
                            country = cols[4].text.strip()
                            region = cols[5].text.strip()
                            speed = cols[6].text.strip()
                            
                            if self._is_valid_ip(ip) and self._is_valid_port(port):
                                proxies.append({
                                    'ip': ip,
                                    'port': int(port),
                                    'protocol': protocol,
                                    'country': country,
                                    'region': region,
                                    'anonymity': self._normalize_anonymity(anonymity),
                                    'speed': self._parse_speed(speed)
                                })
                    
                    time.sleep(random.uniform(1, 3))  # 随机延迟
                    
                except Exception as e:
                    logger.error(f"爬取快代理 {url} 失败: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"爬取快代理失败: {e}")
            
        return proxies
    
    def crawl_89ip(self) -> List[Dict]:
        """爬取89IP代理"""
        proxies = []
        try:
            urls = [
                'http://www.89ip.cn/index_1.html',
                'http://www.89ip.cn/index_2.html',
                'http://www.89ip.cn/index_3.html'
            ]
            
            for url in urls:
                try:
                    response = self.session.get(url, timeout=self.timeout)
                    response.raise_for_status()
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    rows = soup.select('tbody tr')
                    for row in rows:
                        cols = row.select('td')
                        if len(cols) >= 4:
                            ip = cols[0].text.strip()
                            port = cols[1].text.strip()
                            region = cols[2].text.strip()
                            isp = cols[3].text.strip()
                            
                            if self._is_valid_ip(ip) and self._is_valid_port(port):
                                proxies.append({
                                    'ip': ip,
                                    'port': int(port),
                                    'protocol': 'http',
                                    'country': '中国',
                                    'region': region,
                                    'isp': isp,
                                    'anonymity': 'unknown'
                                })
                    
                    time.sleep(random.uniform(1, 2))
                    
                except Exception as e:
                    logger.error(f"爬取89IP {url} 失败: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"爬取89IP失败: {e}")
            
        return proxies
    
    def crawl_66ip(self) -> List[Dict]:
        """爬取66IP代理"""
        proxies = []
        try:
            url = 'http://www.66ip.cn/mo.php?tqsl=100'
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            # 使用正则表达式提取IP和端口
            pattern = r'(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d+)'
            matches = re.findall(pattern, response.text)
            
            for ip, port in matches:
                if self._is_valid_ip(ip) and self._is_valid_port(port):
                    proxies.append({
                        'ip': ip,
                        'port': int(port),
                        'protocol': 'http',
                        'country': '中国',
                        'region': '未知',
                        'anonymity': 'unknown'
                    })
                    
        except Exception as e:
            logger.error(f"爬取66IP失败: {e}")
            
        return proxies
    
    def crawl_xicidaili(self) -> List[Dict]:
        """爬取西刺代理"""
        proxies = []
        try:
            urls = [
                'http://www.xicidaili.com/nn/',
                'http://www.xicidaili.com/nt/',
                'http://www.xicidaili.com/wn/'
            ]
            
            for url in urls:
                try:
                    response = self.session.get(url, timeout=self.timeout)
                    response.raise_for_status()
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    rows = soup.select('#ip_list tr')
                    for row in rows[1:]:  # 跳过表头
                        cols = row.select('td')
                        if len(cols) >= 7:
                            ip = cols[1].text.strip()
                            port = cols[2].text.strip()
                            protocol = cols[5].text.strip().lower()
                            country = cols[3].text.strip()
                            region = cols[4].text.strip()
                            speed = cols[6].text.strip()
                            
                            if self._is_valid_ip(ip) and self._is_valid_port(port):
                                proxies.append({
                                    'ip': ip,
                                    'port': int(port),
                                    'protocol': protocol,
                                    'country': country,
                                    'region': region,
                                    'anonymity': 'unknown',
                                    'speed': self._parse_speed(speed)
                                })
                    
                    time.sleep(random.uniform(2, 4))
                    
                except Exception as e:
                    logger.error(f"爬取西刺代理 {url} 失败: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"爬取西刺代理失败: {e}")
            
        return proxies
    
    def _is_valid_ip(self, ip: str) -> bool:
        """验证IP地址格式"""
        try:
            parts = ip.split('.')
            if len(parts) != 4:
                return False
            for part in parts:
                if not 0 <= int(part) <= 255:
                    return False
            return True
        except:
            return False
    
    def _is_valid_port(self, port: str) -> bool:
        """验证端口号格式"""
        try:
            port_num = int(port)
            return 1 <= port_num <= 65535
        except:
            return False
    
    def _normalize_anonymity(self, anonymity: str) -> str:
        """标准化匿名度"""
        anonymity = anonymity.lower()
        if '高匿' in anonymity or 'elite' in anonymity:
            return 'elite'
        elif '匿名' in anonymity or 'anonymous' in anonymity:
            return 'anonymous'
        elif '透明' in anonymity or 'transparent' in anonymity:
            return 'transparent'
        else:
            return 'unknown'
    
    def _parse_speed(self, speed_str: str) -> Optional[float]:
        """解析速度字符串"""
        try:
            # 提取数字
            numbers = re.findall(r'\d+\.?\d*', speed_str)
            if numbers:
                return float(numbers[0])
        except:
            pass
        return None
    
    def crawl_all(self) -> List[Dict]:
        """爬取所有代理源"""
        all_proxies = []
        
        logger.info("开始爬取代理...")
        
        # 爬取各个代理源
        sources = [
            ('快代理', self.crawl_kuaidaili),
            ('89IP', self.crawl_89ip),
            ('66IP', self.crawl_66ip),
            ('西刺代理', self.crawl_xicidaili)
        ]
        
        for name, crawler_func in sources:
            try:
                logger.info(f"正在爬取 {name}...")
                proxies = crawler_func()
                logger.info(f"{name} 爬取到 {len(proxies)} 个代理")
                all_proxies.extend(proxies)
                time.sleep(random.uniform(2, 5))  # 源之间延迟
            except Exception as e:
                logger.error(f"爬取 {name} 失败: {e}")
                continue
        
        # 去重
        unique_proxies = self._deduplicate_proxies(all_proxies)
        logger.info(f"总共爬取到 {len(all_proxies)} 个代理，去重后 {len(unique_proxies)} 个")
        
        return unique_proxies
    
    def _deduplicate_proxies(self, proxies: List[Dict]) -> List[Dict]:
        """去重代理"""
        seen = set()
        unique_proxies = []
        
        for proxy in proxies:
            key = f"{proxy['ip']}:{proxy['port']}"
            if key not in seen:
                seen.add(key)
                unique_proxies.append(proxy)
        
        return unique_proxies

if __name__ == "__main__":
    crawler = ProxyCrawler()
    proxies = crawler.crawl_all()
    
    print(f"\n爬取结果:")
    for i, proxy in enumerate(proxies[:10]):  # 只显示前10个
        print(f"{i+1}. {proxy['ip']}:{proxy['port']} ({proxy['protocol']}) - {proxy['country']} {proxy['region']}")
    
    if len(proxies) > 10:
        print(f"... 还有 {len(proxies) - 10} 个代理")
