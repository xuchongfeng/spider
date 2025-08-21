from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class ProxyWebsite(Base):
    __tablename__ = "proxy_websites"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, comment="网站名称")
    url = Column(String(500), nullable=False, comment="网站URL")
    description = Column(Text, comment="网站描述")
    is_active = Column(Boolean, default=True, comment="是否启用")
    crawl_interval = Column(Integer, default=3600, comment="爬取间隔(秒)")
    last_crawl_time = Column(DateTime, comment="最后爬取时间")
    success_rate = Column(Float, default=0.0, comment="成功率")
    total_proxies = Column(Integer, default=0, comment="总代理数量")
    valid_proxies = Column(Integer, default=0, comment="有效代理数量")
    created_at = Column(DateTime, default=func.now(), comment="创建时间")
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), comment="更新时间")
    
    # 关系
    proxies = relationship("Proxy", back_populates="source_website")
