class Api::V1::Users::ExercisesController < Api::V1::Users::BaseController
  include PeriodFilterable

  before_action :set_body_part, only: [ :index ]
  before_action :set_exercise,  only: [ :volume, :one_rm_history ]

  def index
    render json: @body_part.exercises.order(:name).map { |e| exercise_json(e) }
  end

  def volume
    base_scope = WorkoutSet.joins(:workout_log).where(workout_logs: { exercise_id: @exercise.id })
    filtered   = filter_by_period(base_scope, column: "workout_logs.date")
    render json: WorkoutSet.volume_by_date(filtered)
  end

  def one_rm_history
    base_scope = WorkoutSet.joins(:workout_log).where(workout_logs: { exercise_id: @exercise.id })
    filtered   = filter_by_period(base_scope, column: "workout_logs.date")
    render json: WorkoutSet.one_rm_by_date(filtered)
  end

  private

  def set_body_part
    @body_part = @target_user.body_parts.find_by(id: params[:body_part_id])
    render json: { error: "Not found" }, status: :not_found if @body_part.nil?
  end

  def set_exercise
    @exercise = @target_user.exercises.find_by(id: params[:id])
    render json: { error: "Not found" }, status: :not_found if @exercise.nil?
  end

  def exercise_json(exercise)
    {
      id:           exercise.id,
      name:         exercise.name,
      body_part_id: exercise.body_part_id,
      body_part:    exercise.body_part.name
    }
  end
end
