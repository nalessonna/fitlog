class CreateWorkoutSets < ActiveRecord::Migration[8.1]
  def change
    create_table :workout_sets do |t|
      t.references :workout_log, null: false, foreign_key: true
      t.integer :set_number, null: false
      t.decimal :weight, precision: 5, scale: 1, null: false
      t.integer :reps, null: false
      t.timestamps
    end
  end
end
