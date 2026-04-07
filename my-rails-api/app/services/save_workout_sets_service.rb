class SaveWorkoutSetsService
  def self.call(exercise:, date:, sets_params:)
    new(exercise: exercise, date: date, sets_params: sets_params).call
  end

  def initialize(exercise:, date:, sets_params:)
    @exercise    = exercise
    @date        = date
    @sets_params = sets_params
  end

  def call
    log = @exercise.workout_logs.find_or_create_by!(date: @date)
    log.workout_sets.destroy_all
    @sets_params.each do |set|
      log.workout_sets.create!(
        set_number: set[:set_number],
        weight:     set[:weight],
        reps:       set[:reps]
      )
    end
    log.reload
  end
end
