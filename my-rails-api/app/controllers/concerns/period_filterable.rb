module PeriodFilterable
  extend ActiveSupport::Concern

  def filter_by_period(scope, column: "date")
    today = Date.today
    col   = scope.klass.arel_table[column]
    base  = scope.where(col.lteq(today))

    case params[:period]
    when "month"   then base.where(col.gteq(1.month.ago.to_date))
    when "3months" then base.where(col.gteq(3.months.ago.to_date))
    when "6months" then base.where(col.gteq(6.months.ago.to_date))
    when "year"    then base.where(col.gteq(1.year.ago.to_date))
    else base
    end
  end
end
