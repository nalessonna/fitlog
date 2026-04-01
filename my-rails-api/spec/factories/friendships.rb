FactoryBot.define do
  factory :friendship do
    requester { create(:user) }
    receiver  { create(:user) }
    status { "pending" }
  end
end
