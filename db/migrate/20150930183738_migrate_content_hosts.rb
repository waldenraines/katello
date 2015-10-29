class MigrateContentHosts < ActiveRecord::Migration
  class Katello::HostCollectionAssociation < ActiveRecord::Base
    self.table_name = "katello_system_host_collections"
  end

  class Katello::ErrataAssociation < ActiveRecord::Base
    self.table_name = "katello_system_errata"
  end

  class Katello::RepositoryAssociation < ActiveRecord::Base
    self.table_name = "katello_system_repositories"
  end

  class Katello::System < ActiveRecord::Base
    def backend_data
      @data ||= ::Katello::Resources::Candlepin::Consumer.get(uuid)
    end

    def facts
      backend_data[:facts]
    end

    self.table_name = "katello_systems"

    has_many :system_activation_keys, :class_name => "Katello::SystemActivationKey", :dependent => :destroy
    has_many :activation_keys,
             :through => :system_activation_keys,
             :after_add    => :add_activation_key,
             :after_remove => :remove_activation_key
    belongs_to :content_view, :inverse_of => :systems
    belongs_to :environment, :class_name => "Katello::KTEnvironment", :inverse_of => :systems
    has_many :errata_associations, :class_name => "Katello::ErrataAssociation", :dependent => :destroy
    has_many :repository_associations, :class_name => "Katello::RepositoryAssociation", :dependent => :destroy
    has_many :host_collections, :class_name => "Katello::HostCollectionAssociation", :dependent => :destroy
  end

  def logger
    Rails.logger
  end

  def create_content_aspect(host, system)
    logger.info("Creating content aspect for host #{host.name}.")
    host.content_aspect = ::Katello::Host::ContentAspect.new(:content_view => system.content_view, :lifecycle_environment => system.environment)
  end

  def create_subscription_aspect(host, system)
    logger.info("Creating subscription aspect for host #{host.name}.")
    subscription_aspect = host.subscription_aspect = Katello::Host::SubscriptionAspect.new
    subscription_aspect.activation_keys = system.activation_keys
  end

  def get_systems_with_facts(systems)
    systems_to_remove = []

    systems.each do |system|
      begin
        facts = system.facts
        unless facts
          systems_to_remove.push(system)
        end
      rescue RestClient::Exception
        systems_to_remove.push(system)
      end
    end

    systems_to_remove.each do |system|
      logger.info("Content Host #{system.uuid} doesn't have candlepin information, unregistering.")
      systems.delete(system)
      unregister_system(system)
    end

    systems
  end

  def group_systems_by_hostname(systems)
    system_hostnames = {}

    systems.each do |system|
      hostname = system.facts['network.hostname']

      if system_hostnames[hostname]
        system_hostnames[hostname].push(system)
      else
        system_hostnames[hostname] = [system]
      end
    end

    system_hostnames
  end

  def ensure_one_system_per_hostname(systems)
    # ensure only one system exists per hostname and unregister all except the last registered
    systems = get_systems_with_facts(systems)
    system_hostnames = group_systems_by_hostname(systems)

    system_hostnames.each do |system|
      hostname = system.facts['network.hostname']

      if system_hostnames[hostname].count > 1
        logger.warn("Multiple content hosts with the hostname #{hostname} found, unregistering all except last registered.")
        unregister_all_but_last_system(system_hostnames[hostname])
      end
    end
  end

  def unregister_system(system)
    logger.warn("Unregistering content host with UUID: #{system.uuid}")

    begin
      logger.info("Removing Candlepin consumer #{system.uuid}")
      Katello::Resources::Candlepin::Consumer.destroy(system.uuid)
    rescue RestClient::Exception => e
      logger.warn("Exception when destroying candlepin consumer #{system.uuid}:#{e.inspect}")
    end

    begin
      logger.info("Removing Pulp consumer #{system.uuid}")
      Katello.pulp_server.extensions.consumer.delete(system.uuid)
    rescue RestClient::ResourceNotFound
      logger.warn("Pulp consumer not found for consumer #{system.uui} proceeding.")
      #do nothing
    rescue RestClient::Exception => e
      logger.warn("Exception when destroying pulp consumer #{system.uuid}:#{e.inspect}")
    end

    logger.info("Removing system #{system.uuid}")
    system.destroy
  end

  def unregister_all_but_last_system(systems)
    systems_by_created_date = systems.sort_by(&:created_at)
    system = systems_by_created_date.pop

    systems_by_created_date.each do |system_to_remove|
      unregister_system(system_to_remove)
    end

    system
  end

  # rubocop:disable MethodLength
  def up
    if User.where(:login => User::ANONYMOUS_API_ADMIN).first.nil?
      logger.warn("Foreman anonymous admin does not exist, skipping content host migration.")
      return
    end

    User.current = User.anonymous_api_admin

    systems = ensure_one_system_per_hostname(Katello::System.all)

    systems.each do |system|
      hostname = system.facts['network.hostname']

      logger.info("Processing content host #{system.uuid} #{hostname}")

      if hostname.nil?
        logger.warn("Content host #{system.uuid} does not have a hostname, removing.")
        unregister_system(system)
        break
      end

      hosts = ::Host.where(:name => hostname)
      if hosts.empty? # no host exists
        logger.info("No host exists with hostname #{hostname}, creating new host.")
        params = system.attributes.to_options
        params[:facts] = system.facts
        host = Katello::Host::SubscriptionAspect.new_host_from_rhsm_params(params, system.environment.organization, Location.default_location)
        host.save!

        create_content_aspect(host, system)
        create_subscription_aspect(host, system)

      elsif hosts.where(:organization_id => system.environment.organization.id).empty? # host is not in the correct org
        logger.warn("Found host with hostname #{hostname} but it's in org #{hosts[0].org.name} instead of #{system.environment.organization.name}.")
        host = hosts.first

        create_content_aspect(host, system)
        unregister_system(system)

      else #host exists in the correct org
        logger.info("Found host with hostname #{hostname}.")
        host = hosts.first

        create_content_aspect(host, system)
        create_subscription_aspect(host, system)
      end

      system.host_id = host.id
      system.save!
    end
  end
end
