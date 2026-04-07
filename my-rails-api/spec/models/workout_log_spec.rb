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

  describe ".calendar_data" do
    let(:user)     { create(:user) }
    let(:exercise) { create(:exercise, user: user) }

    it "指定月のトレーニング日と種目名を返すこと" do
      create(:workout_log, exercise: exercise, date: "2026-04-10")
      create(:workout_log, exercise: exercise, date: "2026-03-10") # 別月

      result = WorkoutLog.calendar_data(user.id, 2026, 4)

      expect(result.length).to eq(1)
      expect(result.first[:date]).to eq("2026-04-10")
      expect(result.first[:exercise_names]).to include(exercise.name)
    end

    it "他ユーザーのログは含まないこと" do
      other_exercise = create(:exercise)
      create(:workout_log, exercise: other_exercise, date: "2026-04-10")

      result = WorkoutLog.calendar_data(user.id, 2026, 4)

      expect(result).to be_empty
    end

    it "同日に複数種目がある場合まとめて返すこと" do
      exercise2 = create(:exercise, user: user)
      create(:workout_log, exercise: exercise,  date: "2026-04-10")
      create(:workout_log, exercise: exercise2, date: "2026-04-10")

      result = WorkoutLog.calendar_data(user.id, 2026, 4)

      expect(result.length).to eq(1)
      expect(result.first[:exercise_names]).to include(exercise.name, exercise2.name)
    end
  end
end
