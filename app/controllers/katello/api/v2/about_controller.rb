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

module Katello
class Api::V2::AboutController < Api::V2::ApiController

  include Api::V2::Rendering

  before_filter :authenticate
  skip_before_filter :authorize # ok - anyone authenticated can ask for status

  resource_description do
    api_version 'v2'
    api_base_url "#{Katello.config.url_prefix}/api"
  end

  api :GET, "/about", N_("Shows status of system and it's subcomponents")
  description N_("This service is only available for authenticated users")
  def index
    @packages = Ping.packages
    @system_info = {  "Application" => Katello.config.app_name,
                      "Version"     => Katello.config.katello_version,
                      "Packages"    => Ping.packages,
    }
    if current_user && current_user.allowed_to?(:view_organizations)
      @system_info.merge!("Environment" => Rails.env,
                          "Directory"   => Rails.root,
                          "Authentication" => Katello.config.warden,
                          "Ruby" => RUBY_VERSION
      )
    end

    @resource = OpenStruct.new(@system_info)
    respond_for_show :resource => @resource
  end

end
end
