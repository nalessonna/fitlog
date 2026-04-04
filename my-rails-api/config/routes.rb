Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      # セッション
      get    "/auth/google/callback", to: "sessions#create"
      delete "/sessions",             to: "sessions#destroy"

      namespace :me do
        get :calendar
        get :volume
        resource  :profile, only: [ :show, :update, :destroy ]
        resources :body_parts, only: [ :index, :create, :update, :destroy ] do
          member do
            get :volume
          end
          resources :exercises, only: [ :index, :create, :update, :destroy ]
        end
        resources :exercises, only: [] do
          member do
            get :one_rm_history
            get :volume
          end
        end
        resources :workout_logs, param: :date, only: [ :show, :update, :destroy ]
        resources :friendships, only: [ :create, :update, :destroy ] do
          collection do
            get :friends
            get :requests
          end
        end
      end

      scope '/friends/:account_id', module: 'friends', as: 'friend' do
        get :calendar, to: 'friends#calendar'
        get :volume,   to: 'friends#volume'
        resources :body_parts, only: [ :index ] do
          member { get :volume }
          resources :exercises, only: [ :index ]
        end
        resources :exercises, only: [] do
          member do
            get :volume
            get :one_rm_history
          end
        end
        resources :workout_logs, only: [ :index ]
      end

    end
  end
end
