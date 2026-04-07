class Api::V1::Users::BaseController < ApplicationController
  before_action :set_target_user

  private

  def set_target_user
    target = User.find_by_account_id(params[:account_id])
    return render json: { error: "Not found" }, status: :not_found if target.nil?

    if target.id == current_user.id
      @target_user = current_user
    elsif current_user.friends_with?(target)
      @target_user = target
    else
      render json: { error: "Forbidden" }, status: :forbidden
    end
  end
end
