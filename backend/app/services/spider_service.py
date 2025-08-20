import requests
from bs4 import BeautifulSoup
import json
from typing import Dict, Any, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class SpiderService:
    """爬虫服务类"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': settings.DEFAULT_USER_AGENT
        })
    
    async def crawl_url(self, url: str, config: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """爬取指定URL的内容"""
        try:
            response = self.session.get(
                url, 
                timeout=settings.REQUEST_TIMEOUT,
                headers=self._get_headers(config)
            )
            response.raise_for_status()
            
            # 解析HTML内容
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 提取数据
            extracted_data = self._extract_data(soup, config)
            
            return {
                'url': url,
                'title': soup.title.string if soup.title else None,
                'content': soup.get_text()[:1000] if soup.get_text() else None,  # 限制内容长度
                'extracted_data': extracted_data,
                'raw_html': response.text,
                'status_code': response.status_code
            }
            
        except requests.RequestException as e:
            logger.error(f"爬取失败: {url}, 错误: {str(e)}")
            raise Exception(f"爬取失败: {str(e)}")
        except Exception as e:
            logger.error(f"处理失败: {url}, 错误: {str(e)}")
            raise Exception(f"处理失败: {str(e)}")
    
    def _get_headers(self, config: Optional[Dict[str, Any]] = None) -> Dict[str, str]:
        """获取请求头"""
        headers = {
            'User-Agent': settings.DEFAULT_USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        
        if config and 'headers' in config:
            headers.update(config['headers'])
        
        return headers
    
    def _extract_data(self, soup: BeautifulSoup, config: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """根据配置提取数据"""
        if not config or 'selectors' not in config:
            return {}
        
        extracted_data = {}
        selectors = config['selectors']
        
        for field, selector in selectors.items():
            try:
                if selector.startswith('css:'):
                    # CSS选择器
                    css_selector = selector[4:]
                    elements = soup.select(css_selector)
                    if elements:
                        if len(elements) == 1:
                            extracted_data[field] = elements[0].get_text(strip=True)
                        else:
                            extracted_data[field] = [elem.get_text(strip=True) for elem in elements]
                elif selector.startswith('xpath:'):
                    # XPath选择器 (需要lxml支持)
                    # 这里简化处理，实际应该使用lxml的xpath
                    pass
                else:
                    # 默认作为CSS选择器处理
                    elements = soup.select(selector)
                    if elements:
                        extracted_data[field] = elements[0].get_text(strip=True)
            except Exception as e:
                logger.warning(f"提取字段 {field} 失败: {str(e)}")
                extracted_data[field] = None
        
        return extracted_data
    
    async def start_task(self, task_id: int, url: str, config: Optional[Dict[str, Any]] = None):
        """启动爬虫任务"""
        try:
            result = await self.crawl_url(url, config)
            # 这里应该将结果保存到数据库
            logger.info(f"任务 {task_id} 完成: {url}")
            return result
        except Exception as e:
            logger.error(f"任务 {task_id} 失败: {str(e)}")
            raise e
