import { withPluginApi } from "discourse/lib/plugin-api";
import TopicTimer from "discourse/models/topic-timer";
import EditTopicTimer from "discourse/controllers/edit-topic-timer";
import TopicTimerStatus from "discourse/components/topic-timer-info"
import EmberObject, { setProperties } from "@ember/object";


function initializeDiscourseCustomTimer(api) {
  // https://github.com/discourse/discourse/blob/master/app/assets/javascripts/discourse/lib/plugin-api.js.es6

  function dateToYYYYMMDDHHMM(date) {
    const targetDate = new Date(date)
    return (targetDate.getFullYear() + '-' + ('0' + (targetDate.getMonth() + 1)).slice(-2) + '-' + ('0' + targetDate.getDate()).slice(-2) + ' ' + targetDate.getHours() + ':' + ('0' + (targetDate.getMinutes())).slice(-2))
  }

  api.createWidget('timer-dropdown-item', {
    tagName: 'div.timer_dropdown_item',

    calcTimerTime(hour) {
      const addingSeconds = hour * 60 * 60 * 1000
      const targetSeconds = (new Date()).getTime() + addingSeconds
      const targetDate = new Date(targetSeconds)

      return targetDate
    },

    getTime(hour) {
      const targetDate = this.calcTimerTime(hour)
      return [`${hour}h`, dateToYYYYMMDDHHMM(targetDate)]
    },

    html(attrs) {
      return this.attach("menu-links", {
        name: "timer_hour_item",
        contents: () => this.getTime(attrs.hour)
      })
    },

    click() {
      const targetTime = this.calcTimerTime(this.attrs.hour)
      this.attrs.onClick(targetTime)
    }
  })

  api.createWidget('timer-dropdown', {
    tagName: 'div.timer_dropdown_container',

    items: [1, 2, 4, 6],

    html(attrs) {
      return this.attach('menu-panel', {
        contents: () => this.items.map(item => this.attach("timer-dropdown-item", {
          hour: item,
          onClick: async (time) => {
            const result = await attrs.setTimer(time)
            console.log(result)
            this.clickOutside()
            this.updateTimerStatusUI(time, result)
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
