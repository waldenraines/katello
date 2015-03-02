{
  :docker_image => object.docker_images.count,
  :docker_tag => object.docker_tags.count,
  :rpm => object.package_count,
  :package => object.package_count,
  :package_group => object.package_group_count,
  :erratum => object.errata.count,
  :puppet_module => object.puppet_module_count
}
