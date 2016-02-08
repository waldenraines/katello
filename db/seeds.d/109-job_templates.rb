return unless Katello.with_remote_execution?
User.as_anonymous_admin do
  JobTemplate.without_auditing do
    Dir[File.join("#{Katello::Engine.root}/app/views/foreman/job_templates/**/*.erb")].each do |template|
      JobTemplate.import(File.read(template), :default => true, :locked => true)
    end
  end
end
