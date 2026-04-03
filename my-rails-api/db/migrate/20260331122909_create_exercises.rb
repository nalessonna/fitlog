class CreateExercises < ActiveRecord::Migration[8.1]
  def change
    create_table :exercises do |t|
      t.references :user,       null: false, foreign_key: true
      t.references :body_part,  null: false, foreign_key: true
      t.string :name, null: false
      t.timestamps
    end
    add_index :exercises, [ :user_id, :name ], unique: true
  end
end
