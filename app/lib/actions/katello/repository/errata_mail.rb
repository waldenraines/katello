#
# Copyright 2014 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Actions
  module Katello
    module Repository
      class ErrataMail < Actions::EntryAction
        def plan(repo, last_updated = nil)
          last_updated ||= repo.repository_errata.order('updated_at ASC').last.try(:updated_at) || Time.now
          plan_self(:repo => repo.id, :last_updated => last_updated.to_s)
        end

        def run
          ::User.current = ::User.anonymous_admin

          repo = ::Katello::Repository.find(input[:repo])
          users = ::User.select { |user| user.receives?(:satellite_sync_errata) && user.can?(:view_products, repo.product) }.compact
          errata = ::Katello::Erratum.where(:id => repo.repository_errata.where('katello_repository_errata.updated_at > ?', input[:last_updated].to_datetime).pluck(:erratum_id))

          MailNotification[:satellite_sync_errata].deliver(:users => users, :repo => repo, :errata => errata) unless users.blank?
        end

        def finalize
          ::User.current = nil
        end
      end
    end
  end
end
