Dir["#{File.expand_path('../permissions', __FILE__)}/*.rb"].each do |file|
  load file
end
