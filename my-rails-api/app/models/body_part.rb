class BodyPart < ApplicationRecord
  DEFAULT_NAMES = %w[胸 背中 肩 腕 腹 足 有酸素運動].freeze

  belongs_to :user
  has_many :exercises, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: { scope: :user_id }
end
