Rails.application.routes.draw do

  root 'pages#root'

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  resource :users, only: [:create, :new] #Users controller
  resource :session, only: [:new, :create, :destroy] #sessions controller

  
  # get 'auth/facebook/callback', to: 'sessions#omniauth_facebook'

  namespace :api, defaults: { format: :json } do
     resources :institutions
     resources :accounts
     resources :transactions
     resources :users
     resource :session
    get "search", to: "utils#search"
  end

end
