module Actions
  module Katello
    module Host
      module Package
        class Install < Actions::EntryAction
          include Helpers::Presenter

          def plan(host, packages)
            Type! host, ::Host::Managed

            action_subject(host, :packages => packages)
            plan_action(Pulp::Consumer::ContentInstall,
                        consumer_uuid: host.content_facet.uuid,
                        type:          'rpm',
                        args:          packages)
          end

          def humanized_name
            _("Install package")
          end

          def humanized_input
            [input[:packages].join(", ")] + super
          end

          def resource_locks
            :content_update
          end

          def presenter
            Helpers::Presenter::Delegated.new(self, planned_actions(Pulp::Consumer::ContentInstall))
          end
        end
      end
    end
  end
end
