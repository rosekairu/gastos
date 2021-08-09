class Api::SessionsController < ApplicationController

  def show
    if current_user
      @user = current_user
      render "api/users/show"
    else
      render json: {}
    end
  end

  def create
    @user = User.find_by_credentials(
      params[:email],
      params[:password]
    )

    if @user.nil?
      render json: ["Incorrect email/password combination."], status: 401
    else
      log_in_user!(@user)
      render "api/users/show"
    end
  end

  def destroy
    logout!
    render json: ["Logged out."], status: 200
  end


end
