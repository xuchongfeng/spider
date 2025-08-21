from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Proxy(Base):
    __tablename__ = "proxies"
    
    id = Column(Integer, primary_key=True, index=True)
    ip = Column(String(45), nullable=False, comment="代理IP")
    port = Column(Integer, nullable=False, comment="代理端口")
    protocol = Column(String(10), default="http", comment="协议类型")
    country = Column(String(50), comment="国家/地区")
    region = Column(String(100), comment="省份/州")
    city = Column(String(100), comment="城市")
    isp = Column(String(100), comment="网络服务商")
    anonymity = Column(String(20), default="unknown", comment="匿名度")
    speed = Column(Float, comment="响应速度(ms)")
    success_rate = Column(Float, default=0.0, comment="成功率")
    last_check_time = Column(DateTime, comment="最后检测时间")
    is_active = Column(Boolean, default=True, comment="是否有效")
    source_website_id = Column(Integer, ForeignKey("proxy_websites.id"), comment="来源网站ID")
    created_at = Column(DateTime, default=func.now(), comment="创建时间")
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), comment="更新时间")
    
    # 关系
    source_website = relationship("ProxyWebsite", back_populates="proxies")
