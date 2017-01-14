function listController(userService, $timeout) {


    this.userService = userService;

    this.load = () => {
        this.userService.getAll().then((res) => {
            this.users = res.data;
            $timeout(() => {
              $('.modal').modal();
            }, 0);
        });
    };

    this.update = (user) => {
        this.userService.update(user._id, user.first_name, user.last_name, user.bij, user.number, user.email).then(() => {
            this.load();
        });
    };

    this.delete = (user) => {
        this.userService.delete(user._id).then(() => {
            this.load();
        });
    };

    this.load();
}
