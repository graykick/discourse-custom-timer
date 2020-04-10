module DiscourseCustomTimer
  class Engine < ::Rails::Engine
    engine_name "DiscourseCustomTimer".freeze
    isolate_namespace DiscourseCustomTimer

    config.after_initialize do
      Discourse::Application.routes.append do
        mount ::DiscourseCustomTimer::Engine, at: "/discourse-custom-timer"
      end
    end
  end
end
