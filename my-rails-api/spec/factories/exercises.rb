FactoryBot.define do
  factory :exercise do
    association :user
    name { "種目_#{SecureRandom.hex(4)}" }

    after(:build) do |exercise|
      exercise.body_part ||= build(:body_part, user: exercise.user)
    end
  end
end
