class Api::V1::Me::ProfilesController < ApplicationController
  def show
    render json: profile_json(current_user)
  end

  def update
    if current_user.update(profile_params)
      render json: profile_json(current_user)
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    current_user.destroy
    response.delete_cookie(:auth_token, path: "/")
    head :no_content
  end

  private

  def profile_params
    params.require(:user).permit(:name)
  end

  def profile_json(user)
    {
      account_id: user.account_id,
      name:       user.name,
      avatar_url: user.avatar_url
    }
  end
end
