FactoryBot.define do
  factory :body_part do
    association :user
    name { BodyPart::DEFAULT_NAMES.sample + "_#{SecureRandom.hex(4)}" }
  end
end
