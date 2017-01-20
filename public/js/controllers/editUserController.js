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
            this.loginMessage = {};
            this.loginMessage.type = "success";
            this.loginMessage.title = "Compte actualisé !";
            this.loginMessage.message = "Avec succès et gloire !";
        }).catch((res) => {
            this.loginMessage = {};
            this.loginMessage.type = "error";
            this.loginMessage.title = "Erreur lors de l'actualisation";
            this.loginMessage.message = res.data;
        });
    };

    this.load();
}
