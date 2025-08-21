#!/usr/bin/env python3
"""
数据库表创建脚本
创建代理相关的数据库表
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from app.core.config import settings
from app.models import Base

def create_tables():
    """创建所有数据库表"""
    try:
        # 创建数据库引擎
        engine = create_engine(settings.DATABASE_URL)
        
        print("正在创建数据库表...")
        
        # 创建所有表
        Base.metadata.create_all(bind=engine)
        
        print("✅ 数据库表创建成功！")
        
        # 验证表是否创建成功
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name
            """))
            
            tables = [row[0] for row in result]
            print(f"已创建的表: {', '.join(tables)}")
            
    except Exception as e:
        print(f"❌ 创建数据库表失败: {e}")
        return False
    
    return True

def drop_tables():
    """删除所有数据库表"""
    try:
        engine = create_engine(settings.DATABASE_URL)
        
        print("正在删除数据库表...")
        
        # 删除所有表
        Base.metadata.drop_all(bind=engine)
        
        print("✅ 数据库表删除成功！")
        
    except Exception as e:
        print(f"❌ 删除数据库表失败: {e}")
        return False
    
    return True

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="数据库表管理脚本")
    parser.add_argument("--action", choices=["create", "drop", "recreate"], default="create", 
                       help="操作类型: create(创建), drop(删除), recreate(重建)")
    
    args = parser.parse_args()
    
    if args.action == "create":
        create_tables()
    elif args.action == "drop":
        drop_tables()
    elif args.action == "recreate":
        print("正在重建数据库表...")
        if drop_tables():
            create_tables()
