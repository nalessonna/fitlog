require "rails_helper"

RSpec.describe WorkoutSet, type: :model do
  describe "バリデーション" do
    it "workout_log, set_number, weight, repsがあれば有効であること" do
      workout_set = build(:workout_set)
      expect(workout_set).to be_valid
    end

    it "set_numberがなければ無効であること" do
      workout_set = build(:workout_set, set_number: nil)
      expect(workout_set).not_to be_valid
      expect(workout_set.errors[:set_number]).to include("can't be blank")
    end

    it "weightがなければ無効であること" do
      workout_set = build(:workout_set, weight: nil)
      expect(workout_set).not_to be_valid
      expect(workout_set.errors[:weight]).to include("can't be blank")
    end

    it "repsがなければ無効であること" do
      workout_set = build(:workout_set, reps: nil)
      expect(workout_set).not_to be_valid
      expect(workout_set.errors[:reps]).to include("can't be blank")
    end

    it "weightが0以下なら無効であること" do
      workout_set = build(:workout_set, weight: 0)
      expect(workout_set).not_to be_valid
      expect(workout_set.errors[:weight]).to include("must be greater than 0")
    end

    it "repsが0以下なら無効であること" do
      workout_set = build(:workout_set, reps: 0)
      expect(workout_set).not_to be_valid
      expect(workout_set.errors[:reps]).to include("must be greater than 0")
    end
  end

  describe ".volume_by_date" do
    let(:exercise) { create(:exercise) }

    it "日別の合計ボリュームを返すこと" do
      log = create(:workout_log, exercise: exercise, date: "2026-04-10")
      create(:workout_set, workout_log: log, weight: 80.0, reps: 10)
      create(:workout_set, workout_log: log, weight: 60.0, reps: 12)

      scope = WorkoutSet.joins(:workout_log).where(workout_logs: { exercise_id: exercise.id })
      result = WorkoutSet.volume_by_date(scope)

      expect(result.first[:date]).to eq("2026-04-10")
      expect(result.first[:volume]).to eq(80.0 * 10 + 60.0 * 12)
    end

    it "日付昇順で返すこと" do
      log1 = create(:workout_log, exercise: exercise, date: "2026-04-10")
      log2 = create(:workout_log, exercise: exercise, date: "2026-04-05")
      create(:workout_set, workout_log: log1, weight: 80.0, reps: 10)
      create(:workout_set, workout_log: log2, weight: 80.0, reps: 10)

      scope = WorkoutSet.joins(:workout_log).where(workout_logs: { exercise_id: exercise.id })
      result = WorkoutSet.volume_by_date(scope)

      expect(result.map { |e| e[:date] }).to eq([ "2026-04-05", "2026-04-10" ])
    end
  end

  describe ".one_rm_by_date" do
    let(:exercise) { create(:exercise) }

    it "日別の最大1RMを返すこと" do
      log = create(:workout_log, exercise: exercise, date: "2026-04-10")
      create(:workout_set, workout_log: log, weight: 100.0, reps: 5)
      create(:workout_set, workout_log: log, weight: 60.0,  reps: 15)

      scope = WorkoutSet.joins(:workout_log).where(workout_logs: { exercise_id: exercise.id })
      result = WorkoutSet.one_rm_by_date(scope)

      expect(result.first[:date]).to eq("2026-04-10")
      expect(result.first[:one_rm]).to eq(100.0 * (1 + 5 / 30.0))
    end
  end
end
