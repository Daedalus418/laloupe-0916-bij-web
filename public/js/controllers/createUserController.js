function createUserController(userService, sessionFactory, $timeout, $location, $rootScope) {

    this.userService = userService;
    this.sessionFactory = sessionFactory;
    this.$timeout = $timeout;
    this.$location = $location;
    this.$rootScope = $rootScope;

    this.createAccount = () => {
        this.userService.create({
            last_name: this.last_name,
            first_name: this.first_name,
            email: this.email,
            password: this.password,
            bij: this.bij,
            isAdmin: this.isadmin
        }).then((res) => {
            this.sessionFactory.token = res.data.token;
            this.sessionFactory.user = res.data.user;
            this.sessionFactory.isLogged = true;
            this.$rootScope.$emit('loginStatusChanged', true);
            this.loginMessage = {};
            this.loginMessage.type = "success";
            this.loginMessage.title = "Account created !";
            this.loginMessage.message = "Redirecting...";
            this.$timeout(() => {
                this.loginMessage = null;
                this.$location.path('/');
            }, 2000);
        }).catch((res) => {
            this.sessionFactory.isLogged = false;
            this.$rootScope.$emit('loginStatusChanged', false);
            this.loginMessage = {};
            this.loginMessage.type = "error";
            this.loginMessage.title = "Sign up error";
            this.loginMessage.message = res.data;
        });
    };
}
