from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional, Dict, Any
from app.models.proxy_website import ProxyWebsite
from app.models.proxy import Proxy
from app.schemas.proxy import ProxyWebsiteCreate, ProxyWebsiteUpdate, ProxyCreate, ProxyUpdate
from datetime import datetime, timedelta
import requests
import time
import random

class ProxyWebsiteService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_proxy_website(self, proxy_website: ProxyWebsiteCreate) -> ProxyWebsite:
        db_proxy_website = ProxyWebsite(**proxy_website.dict())
        self.db.add(db_proxy_website)
        self.db.commit()
        self.db.refresh(db_proxy_website)
        return db_proxy_website
    
    def get_proxy_website(self, proxy_website_id: int) -> Optional[ProxyWebsite]:
        return self.db.query(ProxyWebsite).filter(ProxyWebsite.id == proxy_website_id).first()
    
    def get_proxy_websites(self, skip: int = 0, limit: int = 100) -> List[ProxyWebsite]:
        return self.db.query(ProxyWebsite).offset(skip).limit(limit).all()
    
    def update_proxy_website(self, proxy_website_id: int, proxy_website: ProxyWebsiteUpdate) -> Optional[ProxyWebsite]:
        db_proxy_website = self.get_proxy_website(proxy_website_id)
        if db_proxy_website:
            update_data = proxy_website.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_proxy_website, field, value)
            db_proxy_website.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(db_proxy_website)
        return db_proxy_website
    
    def delete_proxy_website(self, proxy_website_id: int) -> bool:
        db_proxy_website = self.get_proxy_website(proxy_website_id)
        if db_proxy_website:
            self.db.delete(db_proxy_website)
            self.db.commit()
            return True
        return False
    
    def update_crawl_stats(self, proxy_website_id: int, total_proxies: int, valid_proxies: int):
        db_proxy_website = self.get_proxy_website(proxy_website_id)
        if db_proxy_website:
            db_proxy_website.total_proxies = total_proxies
            db_proxy_website.valid_proxies = valid_proxies
            db_proxy_website.success_rate = (valid_proxies / total_proxies * 100) if total_proxies > 0 else 0
            db_proxy_website.last_crawl_time = datetime.utcnow()
            db_proxy_website.updated_at = datetime.utcnow()
            self.db.commit()

class ProxyService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_proxy(self, proxy: ProxyCreate) -> Proxy:
        db_proxy = Proxy(**proxy.dict())
        self.db.add(db_proxy)
        self.db.commit()
        self.db.refresh(db_proxy)
        return db_proxy
    
    def get_proxy(self, proxy_id: int) -> Optional[Proxy]:
        return self.db.query(Proxy).filter(Proxy.id == proxy_id).first()
    
    def get_proxies(self, skip: int = 0, limit: int = 100, filters: Dict[str, Any] = None) -> List[Proxy]:
        query = self.db.query(Proxy)
        
        if filters:
            if filters.get('protocol'):
                query = query.filter(Proxy.protocol == filters['protocol'])
            if filters.get('country'):
                query = query.filter(Proxy.country == filters['country'])
            if filters.get('is_active') is not None:
                query = query.filter(Proxy.is_active == filters['is_active'])
            if filters.get('source_website_id'):
                query = query.filter(Proxy.source_website_id == filters['source_website_id'])
        
        return query.offset(skip).limit(limit).all()
    
    def update_proxy(self, proxy_id: int, proxy: ProxyUpdate) -> Optional[Proxy]:
        db_proxy = self.get_proxy(proxy_id)
        if db_proxy:
            update_data = proxy.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_proxy, field, value)
            db_proxy.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(db_proxy)
        return db_proxy
    
    def delete_proxy(self, proxy_id: int) -> bool:
        db_proxy = self.get_proxy(proxy_id)
        if db_proxy:
            self.db.delete(db_proxy)
            self.db.commit()
            return True
        return False
    
    def get_proxy_stats(self) -> Dict[str, Any]:
        total_proxies = self.db.query(func.count(Proxy.id)).scalar()
        active_proxies = self.db.query(func.count(Proxy.id)).filter(Proxy.is_active == True).scalar()
        inactive_proxies = total_proxies - active_proxies
        
        # 按协议统计
        http_proxies = self.db.query(func.count(Proxy.id)).filter(Proxy.protocol == 'http').scalar()
        https_proxies = self.db.query(func.count(Proxy.id)).filter(Proxy.protocol == 'https').scalar()
        socks_proxies = self.db.query(func.count(Proxy.id)).filter(Proxy.protocol.like('socks%')).scalar()
        
        # 按国家统计
        countries_count = self.db.query(func.count(func.distinct(Proxy.country))).scalar()
        
        # 平均速度和成功率
        avg_speed = self.db.query(func.avg(Proxy.speed)).scalar()
        avg_success_rate = self.db.query(func.avg(Proxy.success_rate)).scalar()
        
        return {
            'total_proxies': total_proxies,
            'active_proxies': active_proxies,
            'inactive_proxies': inactive_proxies,
            'http_proxies': http_proxies,
            'https_proxies': https_proxies,
            'socks_proxies': socks_proxies,
            'countries_count': countries_count,
            'avg_speed': float(avg_speed) if avg_speed else None,
            'avg_success_rate': float(avg_success_rate) if avg_success_rate else None
        }
    
    def get_random_proxy(self, protocol: str = None, country: str = None) -> Optional[Proxy]:
        query = self.db.query(Proxy).filter(Proxy.is_active == True)
        
        if protocol:
            query = query.filter(Proxy.protocol == protocol)
        if country:
            query = query.filter(Proxy.country == country)
        
        # 按成功率排序，选择成功率高的代理
        query = query.order_by(Proxy.success_rate.desc())
        
        return query.first()
    
    def bulk_update_proxies(self, proxy_ids: List[int], updates: Dict[str, Any]):
        """批量更新代理信息"""
        self.db.query(Proxy).filter(Proxy.id.in_(proxy_ids)).update(
            {**updates, 'updated_at': datetime.utcnow()},
            synchronize_session=False
        )
        self.db.commit()
