class Friendship < ApplicationRecord
  belongs_to :requester, class_name: "User"
  belongs_to :receiver,  class_name: "User"

  validates :status, inclusion: { in: %w[pending accepted] }
  validates :requester_id, uniqueness: { scope: :receiver_id }
  validate  :cannot_friend_self

  private

  def cannot_friend_self
    errors.add(:base, "自分自身にフレンド申請はできません") if requester_id == receiver_id
  end
end
