namespace :katello do
  task :upgrade_check => ['environment'] do
    desc "Task that can be run before upgrading Katello to check if system is upgrade ready"
    deprecation_warning = "DEPRECATION WARNING: katello:upgrade_check is being replaced " \
                          "with 'foreman-maintain upgrade check' and will be removed in 6.4\n"
    CP_LISTEN_ACTION = Actions::Candlepin::ListenOnCandlepinEvents.to_s
    EVENT_QUEUE_ACTION = Actions::Katello::EventQueue::Monitor.to_s
    INSIGHTS_EMAIL_POLLER_ACTION = Actions::Insights::EmailPoller.to_s

    success = "PASS"
    fail = "FAIL"

    puts "This script makes no modifications and can be re-run multiple times for the most up to date results."
    puts "Checking upgradeability...\n\n"

    # check for any running tasks
    task_count = ::ForemanTasks::Task.active.where("label NOT IN (?)", [CP_LISTEN_ACTION, EVENT_QUEUE_ACTION, INSIGHTS_EMAIL_POLLER_ACTION]).count
    task_status = task_count > 0 ? fail : success
    puts "Checking for running tasks..."
    puts "[#{task_status}] - There are #{task_count} active tasks. "
    if task_count > 0
      puts "         Please wait for these to complete or cancel them from the Monitor tab.\n\n"
    else
      puts "         You may proceed with the upgrade.\n\n"
    end

    print deprecation_warning
  end
end
