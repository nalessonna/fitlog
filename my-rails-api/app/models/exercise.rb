class Exercise < ApplicationRecord
  BODY_PARTS = %w[chest back legs shoulders arms core other].freeze

  belongs_to :user
  has_many :workout_logs, dependent: :destroy

  validates :name,      presence: true, uniqueness: { scope: :user_id }
  validates :body_part, presence: true, inclusion: { in: BODY_PARTS }
end
