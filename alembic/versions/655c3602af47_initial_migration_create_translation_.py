"""Initial migration: create translation_tasks table

Revision ID: 655c3602af47
Revises: 
Create Date: 2026-02-11 11:59:24.295761

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '655c3602af47'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 创建枚举类型（使用 DO 块检查是否存在）
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE file_type_enum AS ENUM ('pptx', 'docx', 'xlsx', 'pdf');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE task_status_enum AS ENUM (
                'pending', 'queued', 'processing', 'completed', 'failed', 'cancelled'
            );
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE error_type_enum AS ENUM (
                'api_error', 'file_error', 'translation_error', 'system_error'
            );
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)

    # 创建表（使用原生 PostgreSQL 类型引用）
    op.create_table(
        'translation_tasks',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('file_name', sa.String(255), nullable=False, comment='原文件名'),
        sa.Column('file_path', sa.String(512), nullable=False, comment='文件存储路径'),
        sa.Column('file_type', sa.dialects.postgresql.ENUM('pptx', 'docx', 'xlsx', 'pdf', name='file_type_enum', create_type=False), nullable=False, comment='文件类型'),
        sa.Column('target_language', sa.String(50), nullable=False, comment='目标语言'),
        sa.Column('model', sa.String(100), nullable=False, comment='LLM 模型名称'),
        sa.Column('status', sa.dialects.postgresql.ENUM('pending', 'queued', 'processing', 'completed', 'failed', 'cancelled', name='task_status_enum', create_type=False), nullable=False, comment='任务状态'),
        sa.Column('priority', sa.Integer(), nullable=False, default=5, comment='任务优先级'),
        sa.Column('progress', sa.Float(), nullable=False, default=0.0, comment='翻译进度 (0-100)'),
        sa.Column('created_at', sa.DateTime(), nullable=False, comment='创建时间'),
        sa.Column('started_at', sa.DateTime(), nullable=True, comment='开始处理时间'),
        sa.Column('completed_at', sa.DateTime(), nullable=True, comment='完成时间'),
        sa.Column('error_message', sa.Text(), nullable=True, comment='错误详细信息'),
        sa.Column('error_type', sa.dialects.postgresql.ENUM('api_error', 'file_error', 'translation_error', 'system_error', name='error_type_enum', create_type=False), nullable=True, comment='错误类型'),
        sa.Column('retry_count', sa.Integer(), nullable=False, default=0, comment='重试次数'),
        sa.Column('output_path', sa.String(512), nullable=True, comment='翻译结果文件路径'),
    )

    # 创建索引
    op.create_index('ix_translation_tasks_status', 'translation_tasks', ['status'])
    op.create_index('ix_translation_tasks_priority', 'translation_tasks', ['priority'])
    op.create_index('ix_translation_tasks_created_at', 'translation_tasks', ['created_at'])


def downgrade() -> None:
    """Downgrade schema."""
    # 删除索引
    op.drop_index('ix_translation_tasks_created_at', table_name='translation_tasks')
    op.drop_index('ix_translation_tasks_priority', table_name='translation_tasks')
    op.drop_index('ix_translation_tasks_status', table_name='translation_tasks')

    # 删除表
    op.drop_table('translation_tasks')

    # 删除枚举类型
    op.execute('DROP TYPE error_type_enum')
    op.execute('DROP TYPE task_status_enum')
    op.execute('DROP TYPE file_type_enum')
