class ContentFacetApplicableRpmsIndex < ActiveRecord::Migration
  def change
    add_index :katello_content_facet_applicable_rpms, :content_facet_id
  end
end
