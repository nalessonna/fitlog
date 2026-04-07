class WorkoutSet < ApplicationRecord
  belongs_to :workout_log

  validates :set_number, presence: true
  validates :weight, presence: true, numericality: { greater_than: 0 }
  validates :reps,   presence: true, numericality: { greater_than: 0, only_integer: true }

  def self.volume_by_date(scope)
    scope.group("workout_logs.date")
      .sum("workout_sets.weight * workout_sets.reps")
      .map { |date, vol| { date: date.to_s, volume: vol.to_f } }
      .sort_by { |e| e[:date] }
  end

  def self.one_rm_by_date(scope)
    scope.group("workout_logs.date")
      .maximum("workout_sets.weight * (1 + workout_sets.reps * 1.0 / 30.0)")
      .map { |date, one_rm| { date: date.to_s, one_rm: one_rm.to_f } }
      .sort_by { |e| e[:date] }
  end
end
