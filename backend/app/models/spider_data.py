from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class SpiderData(Base):
    __tablename__ = "spider_data"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("spider_tasks.id"))
    url = Column(Text, nullable=False)
    title = Column(Text)
    content = Column(Text)
    extracted_data = Column(JSON)  # 提取的结构化数据
    raw_html = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关系
    task = relationship("SpiderTask", back_populates="data")
