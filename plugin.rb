# frozen_string_literal: true

# name: DiscourseCustomTimer
# about: Notify post when you want
# version: 0.1
# authors: graykick
# url: https://github.com/graykick

register_asset 'stylesheets/common/discourse-custom-timer.scss'
register_asset 'stylesheets/desktop/discourse-custom-timer.scss', :desktop
register_asset 'stylesheets/mobile/discourse-custom-timer.scss', :mobile

enabled_site_setting :discourse_custom_timer_enabled

PLUGIN_NAME ||= 'DiscourseCustomTimer'

load File.expand_path('lib/discourse-custom-timer/engine.rb', __dir__)

after_initialize do
  # https://github.com/discourse/discourse/blob/master/lib/plugin/instance.rb
end
