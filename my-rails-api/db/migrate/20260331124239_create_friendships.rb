class CreateFriendships < ActiveRecord::Migration[8.1]
  def change
    create_table :friendships do |t|
      t.references :requester, null: false, foreign_key: { to_table: :users }
      t.references :receiver,  null: false, foreign_key: { to_table: :users }
      t.string :status, null: false, default: "pending"
      t.timestamps
    end
    add_index :friendships, [ :requester_id, :receiver_id ], unique: true
  end
end
