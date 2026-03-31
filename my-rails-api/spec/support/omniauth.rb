OmniAuth.config.test_mode = true

OmniAuth.config.mock_auth[:google] = OmniAuth::AuthHash.new(
  provider: "google",
  uid: "123456789",
  info: {
    email: "test@example.com",
    name: "テストユーザー",
    image: "https://example.com/avatar.jpg"
  }
)

RSpec.configure do |config|
  config.before(:each) do
    OmniAuth.config.test_mode = true
  end
end
