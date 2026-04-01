FactoryBot.define do
  factory :workout_log do
    association :exercise
    date { Faker::Date.backward(days: 30) }
  end
end
