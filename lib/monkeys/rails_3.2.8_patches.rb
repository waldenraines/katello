
# Patch from https://github.com/rails/rails/issues/6865
module ActiveRecord
  module Calculations
    def perform_calculation(operation, column_name, options = {})
      operation = operation.to_s.downcase

      # If #count is used in conjuction with #uniq it is considered distinct. (eg. relation.uniq.count)
      distinct = options[:distinct] || self.uniq_value

      if operation == "count"
        column_name ||= (select_for_count || :all)

        unless arel.ast.grep(Arel::Nodes::OuterJoin).empty?
          distinct = true
        end

        column_name = primary_key if column_name == :all && distinct

        distinct = nil if column_name =~ /\s*DISTINCT\s+/i
      end

      if group_values.any?
        execute_grouped_calculation(operation, column_name, distinct)
      else
        execute_simple_calculation(operation, column_name, distinct)
      end
    end
  end
end

# Patch from https://github.com/rails/rails/issues/9678
module ActiveSupport
  class TimeZone
    def parse(str, now=now)
      parts = Date._parse(str, false)
      return if parts.empty?

      time = Time.utc(
          parts.fetch(:year, now.year),
          parts.fetch(:mon, now.month),
          parts.fetch(:mday, now.day),
          parts.fetch(:hour, 0),
          parts.fetch(:min, 0),
          parts.fetch(:sec, 0),
          parts.fetch(:sec_fraction, 0) * 1000000
      )

      if parts[:offset]
        TimeWithZone.new(time - parts[:offset], self)
      else
        TimeWithZone.new(nil, self, time)
      end
    end
  end
end