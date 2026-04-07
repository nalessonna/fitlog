class Api::V1::Users::UsersController < Api::V1::Users::BaseController
  include PeriodFilterable

  def calendar
    if params[:year].blank? || params[:month].blank?
      render json: { error: "year と month は必須です" }, status: :unprocessable_content
      return
    end

    render json: WorkoutLog.calendar_data(@target_user.id, params[:year].to_i, params[:month].to_i)
  end

  def volume
    base_scope = WorkoutSet.joins(workout_log: :exercise).where(exercises: { user_id: @target_user.id })
    filtered   = filter_by_period(base_scope, column: "workout_logs.date")
    render json: WorkoutSet.volume_by_date(filtered)
  end
end
