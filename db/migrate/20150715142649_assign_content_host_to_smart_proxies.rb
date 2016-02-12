class AssignContentHostToSmartProxies < ActiveRecord::Migration
  class System < ActiveRecord::Base
    self.table_name = "katello_systems"
  end
  
  def up
    SmartProxy.reset_column_information

    SmartProxy.all.each do |proxy|
      content_host = System.where(:name => proxy.name).order("created_at DESC").first

      if content_host
        proxy.content_host_id = content_host.id
        proxy.save!
      end
    end
  end

  def down
    SmartProxy.all.each do |proxy|
      proxy.content_host_id = nil
      proxy.save!
    end
  end
end
