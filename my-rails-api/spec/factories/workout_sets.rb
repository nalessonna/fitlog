FactoryBot.define do
  factory :workout_set do
    association :workout_log
    set_number { 1 }
    weight     { 60.0 }
    reps       { 10 }
  end
end
