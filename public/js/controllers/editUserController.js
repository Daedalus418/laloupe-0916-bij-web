function updateUserController(userService, $routeParams) {

    this.userService = userService;
    this.userId = $routeParams.id;

    this.load = () => {
        this.userService.getOne(this.userId).then((res) => {
            this.user = res.data;
        });
    };

    this.update = (user) => {
        this.userService.update(user._id, user).then(() => {
            this.load();
        });
    };

    this.load();
}
