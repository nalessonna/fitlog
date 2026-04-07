class Api::V1::Users::BodyPartsController < Api::V1::Users::BaseController
  include PeriodFilterable

  before_action :set_body_part, only: [ :volume ]

  def index
    render json: @target_user.body_parts.order(:name).map { |bp| body_part_json(bp) }
  end

  def volume
    base_scope = WorkoutSet.joins(workout_log: :exercise).where(exercises: { body_part_id: @body_part.id })
    filtered   = filter_by_period(base_scope, column: "workout_logs.date")
    render json: WorkoutSet.volume_by_date(filtered)
  end

  private

  def set_body_part
    @body_part = @target_user.body_parts.find_by(id: params[:id])
    render json: { error: "Not found" }, status: :not_found if @body_part.nil?
  end

  def body_part_json(body_part)
    { id: body_part.id, name: body_part.name }
  end
end
