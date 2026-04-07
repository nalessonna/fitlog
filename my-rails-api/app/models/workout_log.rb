class WorkoutLog < ApplicationRecord
  belongs_to :exercise
  has_many :workout_sets, dependent: :destroy

  validates :date, presence: true, uniqueness: { scope: :exercise_id }

  def self.calendar_data(user_id, year, month)
    logs = joins(:exercise)
      .where(exercises: { user_id: user_id })
      .where("EXTRACT(YEAR FROM date) = ? AND EXTRACT(MONTH FROM date) = ?", year, month)
      .includes(:exercise)
      .order(:date)

    logs.group_by(&:date).map do |date, day_logs|
      { date: date.to_s, exercise_names: day_logs.map { |l| l.exercise.name } }
    end
  end
end
