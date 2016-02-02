class MoveSystemDescriptionToHost < ActiveRecord::Migration
  class Host < ActiveRecord::Base
    self.table_name = "hosts"
  end

  class System < ActiveRecord::Base
    self.table_name = "katello_systems"
  end

  def up
    add_column :hosts, :description, :text

    System.all.each do |system|
      system.foreman_host.description = system.description
    end

    remove_column :katello_systems, :description
  end

  def down
    add_column :katello_systems, :description, :text

    System.all.each do |system|
      system.description = system.foreman_host.description
    end

    remove_column :hosts, :description
  end

end
