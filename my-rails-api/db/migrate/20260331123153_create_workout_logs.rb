class CreateWorkoutLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :workout_logs do |t|
      t.references :exercise, null: false, foreign_key: true
      t.date :date, null: false
      t.timestamps
    end
    add_index :workout_logs, [ :exercise_id, :date ], unique: true
  end
end
