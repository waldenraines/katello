object @resource

attributes :uuid => :id
attributes :title, :errata_id
attributes :issued, :updated
attributes :severity, :description, :solution, :summary, :reboot_suggested
attributes :_href

attributes :errata_type => :type

node(:systems_available_count) { |m| m.systems_available.count }

node :packages do |e|
  e.packages.pluck(:nvrea)
end

child :systems_applicable => :systems_applicable do
  attributes :uuid, :name, :distribution, :environment, :content_view, :created, :checkin_time
  node(:id) { |resource| resource.uuid }

  node :errata_counts do |system|
    {
      :security => system.applicable_errata.security.count,
      :bugfix => system.applicable_errata.bugfix.count,
      :enhancement => system.applicable_errata.enhancement.count,
      :total => system.applicable_errata.count
    }
  end
end
