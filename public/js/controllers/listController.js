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

    this.create = () => {
        this.userService.create(this.user).then(() => {
            this.user = '';
            this.load();
        });
    };

    this.update = (user) => {
        this.userService.update(user._id, user.description).then(() => {
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
