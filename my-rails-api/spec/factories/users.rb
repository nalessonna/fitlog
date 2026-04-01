FactoryBot.define do
  factory :user do
    name       { Faker::Name.name }
    google_uid { Faker::Alphanumeric.unique.alphanumeric(number: 20) }
    avatar_url { Faker::Internet.url }
  end
end
