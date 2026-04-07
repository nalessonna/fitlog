require "rails_helper"

RSpec.describe SaveWorkoutSetsService do
  let(:exercise) { create(:exercise) }

  let(:sets_params) do
    [
      { set_number: 1, weight: 80.0, reps: 10 },
      { set_number: 2, weight: 75.0, reps: 12 }
    ]
  end

  describe ".call" do
    it "ワークアウトログとセットを作成すること" do
      expect {
        SaveWorkoutSetsService.call(exercise: exercise, date: "2026-04-01", sets_params: sets_params)
      }.to change(WorkoutLog, :count).by(1).and change(WorkoutSet, :count).by(2)
    end

    it "既存のセットを全置き換えすること" do
      log = create(:workout_log, exercise: exercise, date: "2026-04-01")
      create(:workout_set, workout_log: log, set_number: 1, weight: 100.0, reps: 5)

      SaveWorkoutSetsService.call(exercise: exercise, date: "2026-04-01", sets_params: sets_params)

      expect(WorkoutSet.count).to eq(2)
      expect(WorkoutSet.find_by(set_number: 1).weight).to eq(80.0)
    end

    it "更新されたWorkoutLogを返すこと" do
      log = SaveWorkoutSetsService.call(exercise: exercise, date: "2026-04-01", sets_params: sets_params)

      expect(log).to be_a(WorkoutLog)
      expect(log.workout_sets.count).to eq(2)
    end
  end
end
