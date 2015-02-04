class UpdatePromoteErrataEmailDescription < ActiveRecord::Migration
  def up
    notification = MailNotification.find_by_name(:satellite_promote_errata)

    if notification
      notification.update_attribute :description,  "A post-promotion summary of hosts with installable errata"
    end
  end

  def down
    notification = MailNotification.find_by_name(:satellite_promote_errata)

    if notification
      notification.update_attribute :description,  "A post-promotion summary of hosts with installable errata"
    end
  end
end
