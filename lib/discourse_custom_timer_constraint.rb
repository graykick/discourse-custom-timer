class DiscourseCustomTimerConstraint
  def matches?(request)
    SiteSetting.discourse_custom_timer_enabled
  end
end
