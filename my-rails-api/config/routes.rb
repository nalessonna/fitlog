Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      # セッション
      get    "/auth/google/callback", to: "sessions#create"
      delete "/sessions",             to: "sessions#destroy"

      namespace :me do
        resource :profile, only: [ :show, :update, :destroy ]
      end
    end
  end
end
