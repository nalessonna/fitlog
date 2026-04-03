class Exercise < ApplicationRecord
  belongs_to :user
  belongs_to :body_part
  has_many :workout_logs, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :user_id }
end
