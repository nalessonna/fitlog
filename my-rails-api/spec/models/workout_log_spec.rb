require "rails_helper"

RSpec.describe WorkoutLog, type: :model do
  describe "バリデーション" do
    it "exercise, dateがあれば有効であること" do
      workout_log = build(:workout_log)
      expect(workout_log).to be_valid
    end

    it "dateがなければ無効であること" do
      workout_log = build(:workout_log, date: nil)
      expect(workout_log).not_to be_valid
      expect(workout_log.errors[:date]).to include("can't be blank")
    end

    it "同じexerciseで同じdateは無効であること" do
      exercise = create(:exercise)
      create(:workout_log, exercise: exercise, date: "2026-04-01")
      workout_log = build(:workout_log, exercise: exercise, date: "2026-04-01")
      expect(workout_log).not_to be_valid
      expect(workout_log.errors[:date]).to include("has already been taken")
    end

    it "異なるexerciseなら同じdateでも有効であること" do
      create(:workout_log, date: "2026-04-01")
      workout_log = build(:workout_log, date: "2026-04-01")
      expect(workout_log).to be_valid
    end
  end
end
