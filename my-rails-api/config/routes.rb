Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      # セッション
      get    "/auth/google/callback", to: "sessions#create"
      delete "/sessions",             to: "sessions#destroy"

      namespace :me do
        resource  :profile,    only: [ :show, :update, :destroy ]
        resources :body_parts, only: [ :index, :create, :destroy ]
        resources :exercises,  only: [ :index, :create, :update, :destroy ] do
          member do
            get :one_rm_history
          end
        end
      end
    end
  end
end
