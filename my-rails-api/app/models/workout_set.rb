class WorkoutSet < ApplicationRecord
  belongs_to :workout_log

  validates :set_number, presence: true
  validates :weight, presence: true, numericality: { greater_than: 0 }
  validates :reps,   presence: true, numericality: { greater_than: 0, only_integer: true }
end
