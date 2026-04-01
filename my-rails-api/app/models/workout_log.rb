class WorkoutLog < ApplicationRecord
  belongs_to :exercise
  has_many :workout_sets, dependent: :destroy

  validates :date, presence: true, uniqueness: { scope: :exercise_id }
end
