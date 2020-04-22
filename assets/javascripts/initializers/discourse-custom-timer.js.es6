import { withPluginApi } from "discourse/lib/plugin-api";
import TopicTimer from "discourse/models/topic-timer";
import EditTopicTimer from "discourse/controllers/edit-topic-timer";
import TopicTimerStatus from "discourse/components/topic-timer-info"
import EmberObject, { setProperties } from "@ember/object";
import { h } from 'virtual-dom';
import { TimerTimeFromNow, TimerTimeWithSpecificMoment } from "discourse/plugins/DiscourseCustomTimer/core/timer_time";

function initializeDiscourseCustomTimer(api) {
  // https://github.com/discourse/discourse/blob/master/app/assets/javascripts/discourse/lib/plugin-api.js.es6
  api.createWidget('timer-dropdown-item', {
    tagName: 'div.timer_dropdown_item',

    timeForDisplay(timerTime) {
      return h('div.time-info-container', [
        h('h3.time-header-label', timerTime.label),
        h('p.time-detail-time', timerTime.formattedTime),
      ])
    },

    html(attrs) {
      return h('button.widget-button.btn.timer-item', this.timeForDisplay(attrs.timerTime))
    },

    click() {
      this.attrs.onClick(this.attrs.timerTime.time)
    }
  })

  api.createWidget('timer-dropdown', {
    tagName: 'div.timer_dropdown_container',

    times: [
      TimerTimeFromNow.createWithHour('1h', 1),
      TimerTimeFromNow.createWithHour('2h', 3),
      TimerTimeFromNow.createWithHour('4h', 4),
      TimerTimeFromNow.createWithHour('6h', 6),
      TimerTimeWithSpecificMoment.createWithNextDaysAndHour('1d', 1, 10),
      TimerTimeWithSpecificMoment.createWithNextDaysAndHour('2d', 2, 10),
      TimerTimeWithSpecificMoment.createWithNextDaysAndHour('3d', 3, 10),
    ],

    html(attrs) {
      console.log(this.times)
      return this.attach('menu-panel', {
        contents: () => this.times.map(time => this.attach("timer-dropdown-item", {
          timerTime: time,
          onClick: (time) => {
            attrs.setTimer(time)
              .then(result => {
                this.clickOutside()
                this.updateTimerStatusUI(time, result)
              })
          }
        }))
      });
    },

    updateTimerStatusUI(time, result) {
      setProperties("model.private_topic_timer", { execute_at: result.execute_at })
    },

    clickOutside() {
      this.sendWidgetAction('toggleTimerDropdown');
    }
  });

  api.decorateWidget('topic-admin-menu-button:after', function (helper) {
    function setTimer(time) {
      const REMINDER_TYPE = "reminder";
      const topicId = helper.attrs.topic.id
      const basedOnLastPost = false
      return TopicTimer.updateStatus(topicId, time, basedOnLastPost, REMINDER_TYPE)
    }

    const headerState = helper.widget.state;
    let contents = [];
    contents.push(helper.attach('button', {
      title: 'timer-dropdown',
      icon: 'far-clock',
      active: headerState.timerDropdownVisible,
      iconId: 'toggle-timer-dropdown',
      action: 'toggleTimerDropdown',
    }));
    if (headerState.timerDropdownVisible) {
      contents.push(helper.attach('timer-dropdown', {
        setTimer,
      }));
    }
    return contents;
  });

  api.attachWidgetAction('topic-admin-menu-button', 'toggleTimerDropdown', function () {
    this.state.timerDropdownVisible = !this.state.timerDropdownVisible;
  });
}

export default {
  name: "discourse-custom-timer",

  initialize() {
    withPluginApi("0.8.31", initializeDiscourseCustomTimer);
  }
};
