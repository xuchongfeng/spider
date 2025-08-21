#!/usr/bin/env python3
"""
代理验证脚本
检测代理的有效性、响应速度等指标
"""

import requests
import time
import concurrent.futures
import logging
from typing import List, Dict, Optional, Tuple
from urllib.parse import urlparse
import json

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ProxyValidator:
    def __init__(self, timeout: int = 10, max_workers: int = 50):
        self.timeout = timeout
        self.max_workers = max_workers
        self.test_urls = [
            'http://httpbin.org/ip',
            'http://httpbin.org/get',
            'https://httpbin.org/ip',
            'https://httpbin.org/get'
        ]
        
    def validate_proxy(self, proxy: Dict) -> Dict:
        """验证单个代理"""
        proxy_url = f"{proxy['protocol']}://{proxy['ip']}:{proxy['port']}"
        proxies = {
            'http': proxy_url,
            'https': proxy_url
        }
        
        result = {
            'proxy_id': proxy.get('id'),
            'ip': proxy['ip'],
            'port': proxy['port'],
            'protocol': proxy['protocol'],
            'is_valid': False,
            'speed': None,
            'success_rate': 0.0,
            'error_message': None,
            'test_results': []
        }
        
        success_count = 0
        total_tests = 0
        
        for test_url in self.test_urls:
            if test_url.startswith('https') and proxy['protocol'] == 'http':
                continue  # HTTP代理不能测试HTTPS
                
            try:
                start_time = time.time()
                response = requests.get(
                    test_url,
                    proxies=proxies,
                    timeout=self.timeout,
                    headers={
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                )
                end_time = time.time()
                
                if response.status_code == 200:
                    response_time = (end_time - start_time) * 1000  # 转换为毫秒
                    success_count += 1
                    total_tests += 1
                    
                    result['test_results'].append({
                        'url': test_url,
                        'status_code': response.status_code,
                        'response_time': response_time,
                        'success': True
                    })
                    
                    # 更新速度（取最快响应时间）
                    if result['speed'] is None or response_time < result['speed']:
                        result['speed'] = response_time
                        
                else:
                    total_tests += 1
                    result['test_results'].append({
                        'url': test_url,
                        'status_code': response.status_code,
                        'response_time': None,
                        'success': False
                    })
                    
            except requests.exceptions.ProxyError as e:
                total_tests += 1
                result['test_results'].append({
                    'url': test_url,
                    'status_code': None,
                    'response_time': None,
                    'success': False,
                    'error': str(e)
                })
                
            except requests.exceptions.Timeout as e:
                total_tests += 1
                result['test_results'].append({
                    'url': test_url,
                    'status_code': None,
                    'response_time': None,
                    'success': False,
                    'error': 'timeout'
                })
                
            except Exception as e:
                total_tests += 1
                result['test_results'].append({
                    'url': test_url,
                    'status_code': None,
                    'response_time': None,
                    'success': False,
                    'error': str(e)
                })
        
        # 计算成功率
        if total_tests > 0:
            result['success_rate'] = (success_count / total_tests) * 100
            result['is_valid'] = result['success_rate'] >= 30  # 30%以上成功率认为有效
        
        return result
    
    def validate_proxies_batch(self, proxies: List[Dict]) -> List[Dict]:
        """批量验证代理"""
        logger.info(f"开始验证 {len(proxies)} 个代理...")
        
        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # 提交所有任务
            future_to_proxy = {
                executor.submit(self.validate_proxy, proxy): proxy 
                for proxy in proxies
            }
            
            # 收集结果
            for future in concurrent.futures.as_completed(future_to_proxy):
                try:
                    result = future.result()
                    results.append(result)
                    
                    # 实时显示进度
                    if len(results) % 10 == 0:
                        valid_count = sum(1 for r in results if r['is_valid'])
                        logger.info(f"已验证 {len(results)}/{len(proxies)} 个代理，有效: {valid_count}")
                        
                except Exception as e:
                    proxy = future_to_proxy[future]
                    logger.error(f"验证代理 {proxy['ip']}:{proxy['port']} 时出错: {e}")
                    results.append({
                        'proxy_id': proxy.get('id'),
                        'ip': proxy['ip'],
                        'port': proxy['port'],
                        'protocol': proxy['protocol'],
                        'is_valid': False,
                        'speed': None,
                        'success_rate': 0.0,
                        'error_message': str(e),
                        'test_results': []
                    })
        
        # 按成功率排序
        results.sort(key=lambda x: x['success_rate'], reverse=True)
        
        valid_count = sum(1 for r in results if r['is_valid'])
        logger.info(f"验证完成！总共 {len(proxies)} 个代理，有效: {valid_count}，无效: {len(proxies) - valid_count}")
        
        return results
    
    def validate_proxy_anonymity(self, proxy: Dict) -> Dict:
        """检测代理匿名度"""
        proxy_url = f"{proxy['protocol']}://{proxy['ip']}:{proxy['port']}"
        proxies = {
            'http': proxy_url,
            'https': proxy_url
        }
        
        try:
            # 测试1: 检查是否泄露真实IP
            response = requests.get(
                'http://httpbin.org/headers',
                proxies=proxies,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                headers = response.json().get('headers', {})
                
                # 检查常见的真实IP泄露头
                real_ip_headers = [
                    'X-Forwarded-For',
                    'X-Real-IP',
                    'X-Client-IP',
                    'CF-Connecting-IP',
                    'True-Client-IP'
                ]
                
                has_real_ip = any(
                    headers.get(header) for header in real_ip_headers
                )
                
                if has_real_ip:
                    return {'anonymity': 'transparent', 'details': '泄露真实IP'}
                else:
                    # 进一步测试
                    return self._test_elite_anonymity(proxy, proxies)
            else:
                return {'anonymity': 'unknown', 'details': '无法连接'}
                
        except Exception as e:
            return {'anonymity': 'unknown', 'details': str(e)}
    
    def _test_elite_anonymity(self, proxy: Dict, proxies: Dict) -> Dict:
        """测试是否为高匿代理"""
        try:
            # 测试2: 检查代理是否修改了请求头
            custom_headers = {
                'X-Test-Header': 'test_value',
                'User-Agent': 'Custom-User-Agent'
            }
            
            response = requests.get(
                'http://httpbin.org/headers',
                proxies=proxies,
                headers=custom_headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                headers = response.json().get('headers', {})
                
                # 检查自定义头是否被保留
                if headers.get('X-Test-Header') == 'test_value':
                    return {'anonymity': 'elite', 'details': '完全匿名，不修改请求头'}
                else:
                    return {'anonymity': 'anonymous', 'details': '匿名，但修改了请求头'}
            else:
                return {'anonymity': 'unknown', 'details': '无法进行匿名度测试'}
                
        except Exception as e:
            return {'anonymity': 'unknown', 'details': str(e)}
    
    def get_proxy_quality_score(self, proxy_result: Dict) -> float:
        """计算代理质量评分 (0-100)"""
        if not proxy_result['is_valid']:
            return 0.0
        
        score = 0.0
        
        # 成功率权重: 40%
        score += proxy_result['success_rate'] * 0.4
        
        # 速度权重: 30%
        if proxy_result['speed'] is not None:
            # 速度越快分数越高，超过1000ms得0分
            speed_score = max(0, 100 - (proxy_result['speed'] / 10))
            score += speed_score * 0.3
        
        # 匿名度权重: 20%
        anonymity_scores = {
            'elite': 100,
            'anonymous': 80,
            'transparent': 40,
            'unknown': 50
        }
        anonymity = proxy_result.get('anonymity', 'unknown')
        score += anonymity_scores.get(anonymity, 50) * 0.2
        
        # 协议支持权重: 10%
        protocol_scores = {
            'https': 100,
            'http': 80,
            'socks5': 90,
            'socks4': 70
        }
        protocol = proxy_result.get('protocol', 'http')
        score += protocol_scores.get(protocol, 80) * 0.1
        
        return round(score, 2)
    
    def generate_validation_report(self, results: List[Dict]) -> Dict:
        """生成验证报告"""
        total_proxies = len(results)
        valid_proxies = sum(1 for r in results if r['is_valid'])
        invalid_proxies = total_proxies - valid_proxies
        
        # 按协议统计
        protocol_stats = {}
        for result in results:
            protocol = result['protocol']
            if protocol not in protocol_stats:
                protocol_stats[protocol] = {'total': 0, 'valid': 0}
            protocol_stats[protocol]['total'] += 1
            if result['is_valid']:
                protocol_stats[protocol]['valid'] += 1
        
        # 按国家统计
        country_stats = {}
        for result in results:
            country = result.get('country', '未知')
            if country not in country_stats:
                country_stats[country] = {'total': 0, 'valid': 0}
            country_stats[country]['total'] += 1
            if result['is_valid']:
                country_stats[country]['valid'] += 1
        
        # 速度统计
        valid_speeds = [r['speed'] for r in results if r['is_valid'] and r['speed'] is not None]
        avg_speed = sum(valid_speeds) / len(valid_speeds) if valid_speeds else 0
        
        # 成功率统计
        valid_success_rates = [r['success_rate'] for r in results if r['is_valid']]
        avg_success_rate = sum(valid_success_rates) / len(valid_success_rates) if valid_success_rates else 0
        
        return {
            'summary': {
                'total_proxies': total_proxies,
                'valid_proxies': valid_proxies,
                'invalid_proxies': invalid_proxies,
                'valid_rate': (valid_proxies / total_proxies * 100) if total_proxies > 0 else 0
            },
            'protocol_stats': protocol_stats,
            'country_stats': country_stats,
            'performance': {
                'avg_speed': round(avg_speed, 2),
                'avg_success_rate': round(avg_success_rate, 2)
            },
            'top_proxies': [
                {
                    'ip': r['ip'],
                    'port': r['port'],
                    'protocol': r['protocol'],
                    'speed': r['speed'],
                    'success_rate': r['success_rate'],
                    'quality_score': self.get_proxy_quality_score(r)
                }
                for r in results[:10] if r['is_valid']
            ]
        }

if __name__ == "__main__":
    # 测试代理验证
    validator = ProxyValidator()
    
    # 示例代理
    test_proxies = [
        {'id': 1, 'ip': '127.0.0.1', 'port': 8080, 'protocol': 'http'},
        {'id': 2, 'ip': '127.0.0.1', 'port': 8081, 'protocol': 'http'},
    ]
    
    print("开始验证代理...")
    results = validator.validate_proxies_batch(test_proxies)
    
    # 生成报告
    report = validator.generate_validation_report(results)
    
    print("\n验证报告:")
    print(json.dumps(report, indent=2, ensure_ascii=False))
