class Api::V1::Me::FriendshipsController < ApplicationController
  before_action :set_friendship, only: [ :update, :destroy ]

  def friends
    render json: current_user.friend_users.map { |u| user_json(u) }
  end

  def requests
    friendships = current_user.received_friendships.where(status: "pending").includes(:requester)
    render json: friendships.map { |f| request_json(f) }
  end

  def create
    receiver = User.find_by_account_id(params[:account_id])
    return render json: { error: "Not found" }, status: :not_found if receiver.nil?

    friendship = current_user.sent_friendships.build(receiver: receiver, status: "pending")
    if friendship.save
      render json: friendship_json(friendship), status: :created
    else
      render json: { errors: friendship.errors.full_messages }, status: :unprocessable_content
    end
  end

  def update
    if @friendship.update(status: params[:status])
      render json: friendship_json(@friendship)
    else
      render json: { errors: @friendship.errors.full_messages }, status: :unprocessable_content
    end
  end

  def destroy
    @friendship.destroy
    head :no_content
  end

  private

  def set_friendship
    @friendship = current_user.received_friendships.find_by(id: params[:id])

    if @friendship.nil? && action_name == "destroy"
      @friendship = current_user.sent_friendships.find_by(id: params[:id])
    end

    render json: { error: "Not found" }, status: :not_found if @friendship.nil?
  end

  def user_json(user)
    { id: user.id, name: user.name, account_id: user.account_id, avatar_url: user.avatar_url }
  end

  def request_json(friendship)
    { id: friendship.id, requester_id: friendship.requester_id, name: friendship.requester.name }
  end

  def friendship_json(friendship)
    { id: friendship.id, requester_id: friendship.requester_id, receiver_id: friendship.receiver_id, status: friendship.status }
  end
end
