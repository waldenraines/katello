class UpdatePromoteErrataEmailDescription < ActiveRecord::Migration
  def up
    MailNotification.find_by_name(:katello_promote_errata).update_attribute :description,  "A post-promotion summary of hosts with installable errata"
  end

  def down
    MailNotification.find_by_name(:katello_promote_errata).update_attribute :description,  "A post-promotion summary of hosts with available errata"
  end
end
