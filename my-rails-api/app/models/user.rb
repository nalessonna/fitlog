class User < ApplicationRecord
  has_many :body_parts, dependent: :destroy
  has_many :exercises,  dependent: :destroy
  has_many :sent_friendships,     class_name: "Friendship", foreign_key: :requester_id, dependent: :destroy
  has_many :received_friendships, class_name: "Friendship", foreign_key: :receiver_id,  dependent: :destroy

  validates :name,       presence: true
  validates :google_uid, presence: true, uniqueness: true

  def account_id
    Hashids.new(ENV.fetch("SECRET_KEY_BASE")[0..15]).encode(id)
  end

  def self.find_by_account_id(account_id)
    id = Hashids.new(ENV.fetch("SECRET_KEY_BASE")[0..15]).decode(account_id).first
    find_by(id: id)
  end
end
