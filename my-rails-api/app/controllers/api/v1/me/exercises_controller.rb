class Api::V1::Me::ExercisesController < ApplicationController
  before_action :set_exercise, only: [ :update, :destroy ]

  def index
    exercises = current_user.exercises.includes(:body_part).order(:name)
    render json: exercises.map { |e| exercise_json(e) }
  end

  def create
    exercise = current_user.exercises.build(exercise_params)
    if exercise.save
      render json: exercise_json(exercise), status: :created
    else
      render json: { errors: exercise.errors.full_messages }, status: :unprocessable_content
    end
  end

  def update
    if @exercise.update(exercise_params)
      render json: exercise_json(@exercise)
    else
      render json: { errors: @exercise.errors.full_messages }, status: :unprocessable_content
    end
  end

  def destroy
    @exercise.destroy
    head :no_content
  end

  private

  def set_exercise
    @exercise = current_user.exercises.find_by!(id: params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Not found" }, status: :not_found
  end

  def exercise_params
    params.require(:exercise).permit(:name, :body_part_id)
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
