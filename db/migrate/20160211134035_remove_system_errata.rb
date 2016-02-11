class RemoveSystemErrata < ActiveRecord::Migration
  class System < ActiveRecord::Base
    self.table_name = "katello_systems"

    has_many :system_errata, :class_name => "Katello::SystemErratum", :dependent => :destroy, :inverse_of => :system
  end

  class SystemErratum < ActiveRecord::Base
    self.table_name = "katello_system_errata"
    belongs_to :system, :inverse_of => :system_errata, :class_name => 'Katello::System'

  end

  def up
    drop_table "katello_system_errata"
  end

  def down
    create_table "katello_system_errata" do |t|
      t.references :erratum, :null => false
      t.references :system, :null => false
    end

    add_index :katello_system_errata, [:erratum_id, :system_id], :unique => true,
              :name => :katello_system_errata_eid_sid

    add_foreign_key "katello_system_errata", "katello_errata",
                    :name => "katello_system_errata_errata_id", :column => "erratum_id"
    add_foreign_key "katello_system_errata", "katello_systems",
                    :name => "katello_system_errata_system_id", :column => "system_id"
    
  end
end
