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
end
