class MoveHostDescriptionToHostComment < ActiveRecord::Migration
  class System < ActiveRecord::Base
    self.table_name = "katello_systems"
  end

  def up
    System.find_each do |system|
      if system.foreman_host.comment.empty?
        system.foreman_host.comment = system.foreman_host.description
      else
        system.foreman_host.comment = [system.foreman_host.comment, system.foreman_host.description].join("\n")
      end

      system.foreman_host.save!
    end

    remove_column :hosts, :description
  end

  def down
    add_column :hosts, :description, :text

    System.find_each do |system|
      system.foreman_host.description = system.foreman_host.comment
      system.foreman_host.comment = nil
      system.foreman_host.save!
    end
  end
end
