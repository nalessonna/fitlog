class Api::V1::Me::WorkoutLogsController < ApplicationController
  before_action :set_exercise
  before_action :set_log, only: [ :destroy ]

  def update
    if params[:sets].empty?
      render json: { error: "setsは1件以上必要です" }, status: :unprocessable_content
      return
    end

    log = SaveWorkoutSetsService.call(exercise: @exercise, date: params[:date], sets_params: params[:sets])
    render json: workout_log_json(log)
  end

  def destroy
    @log.destroy
    head :no_content
  end

  private

  def set_exercise
    @exercise = current_user.exercises.find_by(id: params[:exercise_id])
    render json: { error: "Not found" }, status: :not_found if @exercise.nil?
  end

  def set_log
    @log = @exercise.workout_logs.find_by(date: params[:date])
    render json: { error: "Not found" }, status: :not_found if @log.nil?
  end

  def workout_log_json(log)
    {
      date: log.date,
      sets: log.workout_sets.order(:set_number).map { |s|
        { set_number: s.set_number, weight: s.weight.to_f, reps: s.reps }
      }
    }
  end
end
