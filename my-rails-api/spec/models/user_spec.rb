require "rails_helper"

RSpec.describe User, type: :model do
  describe "バリデーション" do
    it "name, google_uidがあれば有効であること" do
      user = build(:user)
      expect(user).to be_valid
    end

    it "nameがなければ無効であること" do
      user = build(:user, name: nil)
      expect(user).not_to be_valid
      expect(user.errors[:name]).to include("can't be blank")
    end

    it "google_uidがなければ無効であること" do
      user = build(:user, google_uid: nil)
      expect(user).not_to be_valid
      expect(user.errors[:google_uid]).to include("can't be blank")
    end

    it "google_uidが重複していれば無効であること" do
      create(:user, google_uid: "duplicate_uid")
      user = build(:user, google_uid: "duplicate_uid")
      expect(user).not_to be_valid
      expect(user.errors[:google_uid]).to include("has already been taken")
    end
  end

  describe "#account_id" do
    it "IDをエンコードした文字列を返すこと" do
      user = create(:user)
      expect(user.account_id).to be_a(String)
      expect(user.account_id).not_to eq(user.id.to_s)
    end
  end

  describe ".find_by_account_id" do
    it "account_idからユーザーを取得できること" do
      user = create(:user)
      expect(User.find_by_account_id(user.account_id)).to eq(user)
    end
  end

  describe "#friend_users" do
    let(:user) { create(:user) }

    it "acceptedのフレンドを返すこと（自分がrequester）" do
      friend = create(:user)
      create(:friendship, requester: user, receiver: friend, status: "accepted")
      expect(user.friend_users).to include(friend)
    end

    it "acceptedのフレンドを返すこと（自分がreceiver）" do
      friend = create(:user)
      create(:friendship, requester: friend, receiver: user, status: "accepted")
      expect(user.friend_users).to include(friend)
    end

    it "pendingのフレンドは含まないこと" do
      stranger = create(:user)
      create(:friendship, requester: user, receiver: stranger, status: "pending")
      expect(user.friend_users).not_to include(stranger)
    end
  end

  describe "#friends_with?" do
    let(:user)  { create(:user) }
    let(:other) { create(:user) }

    it "acceptedのフレンド関係があればtrueを返すこと" do
      create(:friendship, requester: user, receiver: other, status: "accepted")
      expect(user.friends_with?(other)).to be true
    end

    it "逆方向でもtrueを返すこと" do
      create(:friendship, requester: other, receiver: user, status: "accepted")
      expect(user.friends_with?(other)).to be true
    end

    it "pendingの場合はfalseを返すこと" do
      create(:friendship, requester: user, receiver: other, status: "pending")
      expect(user.friends_with?(other)).to be false
    end

    it "フレンド関係がなければfalseを返すこと" do
      expect(user.friends_with?(other)).to be false
    end
  end
end
