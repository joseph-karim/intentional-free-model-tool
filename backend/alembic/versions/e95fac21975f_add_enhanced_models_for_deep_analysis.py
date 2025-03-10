"""Add enhanced models for DEEP analysis

Revision ID: e95fac21975f
Revises: 
Create Date: 2025-03-06 14:54:32.580329

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e95fac21975f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('quiz_results', sa.Column('project_id', sa.Integer(), nullable=True))
    op.add_column('quiz_results', sa.Column('product_description', sa.Text(), nullable=True))
    op.add_column('quiz_results', sa.Column('target_audience', sa.Text(), nullable=True))
    op.add_column('quiz_results', sa.Column('business_goals', sa.Text(), nullable=True))
    op.add_column('quiz_results', sa.Column('user_endgame', sa.Text(), nullable=True))
    op.add_column('quiz_results', sa.Column('beginner_stage', sa.Text(), nullable=True))
    op.add_column('quiz_results', sa.Column('intermediate_stage', sa.Text(), nullable=True))
    op.add_column('quiz_results', sa.Column('advanced_stage', sa.Text(), nullable=True))
    op.add_column('quiz_results', sa.Column('key_challenges', sa.JSON(), nullable=True))
    op.add_column('quiz_results', sa.Column('current_model', sa.Text(), nullable=True))
    op.add_column('quiz_results', sa.Column('current_metrics', sa.JSON(), nullable=True))
    op.add_column('quiz_results', sa.Column('desirable_inputs', sa.JSON(), nullable=True))
    op.add_column('quiz_results', sa.Column('effective_inputs', sa.JSON(), nullable=True))
    op.add_column('quiz_results', sa.Column('efficient_inputs', sa.JSON(), nullable=True))
    op.add_column('quiz_results', sa.Column('polished_inputs', sa.JSON(), nullable=True))
    op.add_column('quiz_results', sa.Column('implementation_plan', sa.JSON(), nullable=True))
    op.add_column('quiz_results', sa.Column('updated_at', sa.DateTime(), nullable=True))
    op.add_column('quiz_results', sa.Column('version', sa.Integer(), nullable=True))
    op.alter_column('quiz_results', 'recommendations',
               existing_type=sa.VARCHAR(),
               type_=sa.Text(),
               existing_nullable=True)
    op.create_index(op.f('ix_quiz_results_project_id'), 'quiz_results', ['project_id'], unique=False)
    op.create_foreign_key(None, 'quiz_results', 'users', ['user_id'], ['id'])
    op.create_foreign_key(None, 'quiz_results', 'projects', ['project_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'quiz_results', type_='foreignkey')
    op.drop_constraint(None, 'quiz_results', type_='foreignkey')
    op.drop_index(op.f('ix_quiz_results_project_id'), table_name='quiz_results')
    op.alter_column('quiz_results', 'recommendations',
               existing_type=sa.Text(),
               type_=sa.VARCHAR(),
               existing_nullable=True)
    op.drop_column('quiz_results', 'version')
    op.drop_column('quiz_results', 'updated_at')
    op.drop_column('quiz_results', 'implementation_plan')
    op.drop_column('quiz_results', 'polished_inputs')
    op.drop_column('quiz_results', 'efficient_inputs')
    op.drop_column('quiz_results', 'effective_inputs')
    op.drop_column('quiz_results', 'desirable_inputs')
    op.drop_column('quiz_results', 'current_metrics')
    op.drop_column('quiz_results', 'current_model')
    op.drop_column('quiz_results', 'key_challenges')
    op.drop_column('quiz_results', 'advanced_stage')
    op.drop_column('quiz_results', 'intermediate_stage')
    op.drop_column('quiz_results', 'beginner_stage')
    op.drop_column('quiz_results', 'user_endgame')
    op.drop_column('quiz_results', 'business_goals')
    op.drop_column('quiz_results', 'target_audience')
    op.drop_column('quiz_results', 'product_description')
    op.drop_column('quiz_results', 'project_id')
    # ### end Alembic commands ### 