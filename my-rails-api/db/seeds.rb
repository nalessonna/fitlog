puts "Seeding..."

# ユーザー
taro = User.find_or_create_by!(google_uid: "seed_taro") do |u|
  u.name       = "たろう"
  u.avatar_url = "https://api.dicebear.com/7.x/avataaars/svg?seed=taro"
end

hanako = User.find_or_create_by!(google_uid: "seed_hanako") do |u|
  u.name       = "はなこ"
  u.avatar_url = "https://api.dicebear.com/7.x/avataaars/svg?seed=hanako"
end

kenta = User.find_or_create_by!(google_uid: "seed_kenta") do |u|
  u.name       = "けんた"
  u.avatar_url = "https://api.dicebear.com/7.x/avataaars/svg?seed=kenta"
end

puts "  Users: #{User.count}"

# フレンド関係（たろうとはなこは友達、けんたからたろうに申請中）
Friendship.find_or_create_by!(requester: taro, receiver: hanako) { |f| f.status = "accepted" }
Friendship.find_or_create_by!(requester: kenta, receiver: taro)  { |f| f.status = "pending" }

puts "  Friendships: #{Friendship.count}"

# 部位と種目の定義
WORKOUT_DATA = {
  "胸"         => [ "ベンチプレス", "インクラインダンベルプレス", "ペックデック" ],
  "背中"       => [ "デッドリフト", "懸垂", "ラットプルダウン", "シーテッドロウ" ],
  "肩"         => [ "ショルダープレス", "サイドレイズ", "フェイスプル" ],
  "腕"         => [ "バーベルカール", "トライセプスプレスダウン" ],
  "腹"         => [ "クランチ", "レッグレイズ" ],
  "足"         => [ "スクワット", "レッグプレス", "ルーマニアンデッドリフト" ],
  "有酸素運動" => [ "ランニング", "バイク" ],
}.freeze

WEIGHT_RANGE = {
  "胸"         => 60..100,
  "背中"       => 70..120,
  "肩"         => 20..50,
  "腕"         => 15..40,
  "腹"         => 10..30,
  "足"         => 60..120,
  "有酸素運動" => 1..1,
}.freeze

def seed_user(user)
  exercises_by_part = {}

  WORKOUT_DATA.each do |part_name, exercise_names|
    bp = BodyPart.find_or_create_by!(user: user, name: part_name)
    exercises_by_part[part_name] = exercise_names.map do |ex_name|
      Exercise.find_or_create_by!(user: user, name: ex_name) { |e| e.body_part = bp }
    end
  end

  # 過去90日間、週3回ペースでトレーニングログを生成
  base_date      = Date.today - 90
  workout_days   = (0..90).select { |i| [ 0, 2, 4 ].include?(i % 7) }.map { |i| base_date + i }
  rotating_parts = [ "胸", "背中", "肩", "足", "腕", "胸", "背中" ]

  workout_days.each_with_index do |date, index|
    part_name = rotating_parts[index % rotating_parts.size]
    exercises = exercises_by_part[part_name].first(2)
    range     = WEIGHT_RANGE[part_name]

    exercises.each do |exercise|
      log = WorkoutLog.find_or_create_by!(exercise: exercise, date: date)
      next if log.workout_sets.any?

      3.times do |i|
        WorkoutSet.create!(
          workout_log: log,
          set_number:  i + 1,
          weight:      rand(range).to_f,
          reps:        [ 6, 8, 10, 12 ].sample
        )
      end
    end
  end
end

seed_user(taro)
seed_user(hanako)

puts "  BodyParts: #{BodyPart.count}, Exercises: #{Exercise.count}"
puts "  WorkoutLogs: #{WorkoutLog.count}, WorkoutSets: #{WorkoutSet.count}"
puts "Done!"
