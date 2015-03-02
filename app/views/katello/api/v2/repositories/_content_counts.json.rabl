{
  :docker_image => repo.docker_images.count,
  :docker_tag => repo.docker_tags.count,
  :rpm => repo.package_count,
  :package => repo.package_count,
  :package_group => repo.package_group_count,
  :erratum => repo.errata.count,
  :puppet_module => repo.puppet_module_count
}
