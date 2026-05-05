module PeriodFilterable
  extend ActiveSupport::Concern

  def filter_by_period(scope, column:)
    today = Date.today
    table_name, col_name = column.split(".", 2)
    col  = Arel::Table.new(table_name)[col_name]
    base = scope.where(col.lteq(today))

    case params[:period]
    when "month"   then base.where(col.gteq(1.month.ago.to_date))
    when "3months" then base.where(col.gteq(3.months.ago.to_date))
    when "6months" then base.where(col.gteq(6.months.ago.to_date))
    when "year"    then base.where(col.gteq(1.year.ago.to_date))
    else base
    end
  end
end
