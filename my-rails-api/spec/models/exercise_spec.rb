require "rails_helper"

RSpec.describe Exercise, type: :model do
  describe "バリデーション" do
    it "user, name, body_partがあれば有効であること" do
      exercise = build(:exercise)
      expect(exercise).to be_valid
    end

    it "nameがなければ無効であること" do
      exercise = build(:exercise, name: nil)
      expect(exercise).not_to be_valid
      expect(exercise.errors[:name]).to include("can't be blank")
    end

    it "body_partがなければ無効であること" do
      exercise = build(:exercise)
      exercise.body_part = nil
      expect(exercise).not_to be_valid
      expect(exercise.errors[:body_part]).to include("must exist")
    end

    it "同じユーザーで同じnameは無効であること" do
      user = create(:user)
      create(:exercise, user: user, name: "ベンチプレス")
      exercise = build(:exercise, user: user, name: "ベンチプレス")
      expect(exercise).not_to be_valid
      expect(exercise.errors[:name]).to include("has already been taken")
    end

    it "異なるユーザーなら同じnameでも有効であること" do
      create(:exercise, name: "ベンチプレス")
      exercise = build(:exercise, name: "ベンチプレス")
      expect(exercise).to be_valid
    end
  end
end
