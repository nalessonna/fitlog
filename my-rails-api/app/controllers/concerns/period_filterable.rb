module PeriodFilterable
  extend ActiveSupport::Concern

  def filter_by_period(scope, column: "date")
    today = Date.today
    base  = scope.where("#{column} <= ?", today)

    case params[:period]
    when "month"   then base.where("#{column} >= ?", 1.month.ago.to_date)
    when "3months" then base.where("#{column} >= ?", 3.months.ago.to_date)
    when "6months" then base.where("#{column} >= ?", 6.months.ago.to_date)
    when "year"    then base.where("#{column} >= ?", 1.year.ago.to_date)
    else base
    end
  end
end
