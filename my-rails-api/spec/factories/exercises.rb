FactoryBot.define do
  factory :exercise do
    association :user
    name      { Faker::Sports::Football.position }
    body_part { %w[chest back legs shoulders arms core other].sample }
  end
end
