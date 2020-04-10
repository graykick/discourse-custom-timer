require_dependency "discourse_custom_timer_constraint"

DiscourseCustomTimer::Engine.routes.draw do
  get "/" => "discourse_custom_timer#index", constraints: DiscourseCustomTimerConstraint.new
  get "/actions" => "actions#index", constraints: DiscourseCustomTimerConstraint.new
  get "/actions/:id" => "actions#show", constraints: DiscourseCustomTimerConstraint.new
end
