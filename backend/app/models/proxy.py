from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Proxy(Base):
    __tablename__ = "proxies"
    
    id = Column(Integer, primary_key=True, index=True)
    ip = Column(String(45), nullable=False, index=True)  # 支持IPv6
    port = Column(Integer, nullable=False)
    protocol = Column(String(10), nullable=False)  # http, https, socks4, socks5
    country = Column(String(50))
    region = Column(String(100))
    city = Column(String(100))
    isp = Column(String(100))
    
    # 代理质量指标
    speed = Column(Float)  # 响应速度(ms)
    uptime = Column(Float)  # 在线率(%)
    last_check = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    
    # 代理类型
    is_free = Column(Boolean, default=True)
    provider = Column(String(100))  # 代理提供商
    api_key = Column(String(200))  # API密钥
    
    # 使用统计
    success_count = Column(Integer, default=0)
    fail_count = Column(Integer, default=0)
    last_used = Column(DateTime(timezone=True))
    
    # 元数据
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Proxy(ip={self.ip}:{self.port}, protocol={self.protocol})>"
