export default function() {
  this.route("discourse-custom-timer", function() {
    this.route("actions", function() {
      this.route("show", { path: "/:id" });
    });
  });
};
