module DiscourseCustomTimer
  class DiscourseCustomTimerController < ::ApplicationController
    requires_plugin DiscourseCustomTimer

    before_action :ensure_logged_in

    def index
    end
  end
end
