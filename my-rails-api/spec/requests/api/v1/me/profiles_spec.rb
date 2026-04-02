require "rails_helper"

RSpec.describe "Api::V1::Me::Profiles", type: :request do
  let(:user) { create(:user) }

  describe "GET /api/v1/me/profile" do
    context "未認証の場合" do
      it "401を返すこと" do
        get "/api/v1/me/profile"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "認証済みの場合" do
      before { cookies[:auth_token] = JwtService.encode(user.id) }

      it "プロフィールを返すこと" do
        get "/api/v1/me/profile"

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["name"]).to eq(user.name)
        expect(json["account_id"]).to eq(user.account_id)
        expect(json["avatar_url"]).to eq(user.avatar_url)
      end
    end
  end

  context "認証済みユーザーとして" do
    before { cookies[:auth_token] = JwtService.encode(user.id) }

    describe "PATCH /api/v1/me/profile" do
      it "nameを更新できること" do
        patch "/api/v1/me/profile", params: { user: { name: "新しい名前" } }

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["name"]).to eq("新しい名前")
      end

      it "nameが空の場合は422を返すこと" do
        patch "/api/v1/me/profile", params: { user: { name: "" } }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    describe "DELETE /api/v1/me/profile" do
      it "アカウントを削除してCookieを削除し204を返すこと" do
        expect {
          delete "/api/v1/me/profile"
        }.to change(User, :count).by(-1)

        expect(response).to have_http_status(:no_content)
        expect(response.cookies["auth_token"]).to be_nil
      end
    end
  end
end
