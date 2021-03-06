class UserView {
    constructor(wrapperSelector, mainContentSelector) {
        this._wrapperSelector = wrapperSelector;
        this._mainContentSelector = mainContentSelector;
    }

    /*Render login page*/
    showLoginPage(isLoggedIn) {
        let _that = this;
        let templateUrl;
        if (isLoggedIn) {
            templateUrl = "templates/form-user.html";
        } else {
            templateUrl = "templates/form-guest.html";
        }
        $.get(templateUrl, function (template) {
            let renderedWrapper = Mustache.render(template, null);
            $(_that._wrapperSelector).html(renderedWrapper);
            $.get('templates/login.html', function (template) {
                let rendered = Mustache.render(template, null);
                $(_that._mainContentSelector).html(rendered);
                /*Get login data on button click and trigger login event*/
                $('#login-request-button').on('click', function (ev) {
                    let username = $('#username').val();
                    let password = $('#password').val();
                    let data = {
                        username: username,
                        password: password
                    };
                    triggerEvent('login', data);
                });
            });
        });
    }

    /*Render register page*/
    showRegisterPage(isLoggedIn) {
        let _that = this;
        let templateUrl;
        if (isLoggedIn) {
            templateUrl = "templates/form-user.html";
        } else {
            templateUrl = "templates/form-guest.html";
        }
        $.get(templateUrl, function (template) {
            let renderedWrapper = Mustache.render(template, null);
            $(_that._wrapperSelector).html(renderedWrapper);
            $.get('templates/register.html', function (template) {
                let rendered = Mustache.render(template, null);
                $(_that._mainContentSelector).html(rendered);
                /*Perform actions on button click and trigger register event*/
                $('#register-request-button').on('click', function (ev) {
                    let username = $('#username').val();
                    let password = $('#password').val();
                    let fullname = $('#full-name').val();
                    let confirmPassword = $('#pass-confirm').val();
                    let interests = $('#interests').val();
                    let birthday = $('#birthday').val();

                    username = escapeHtml(username);
                    fullname = escapeHtml(fullname);
                    interests = escapeHtml(interests);

                    /*Calculate age based on birthday*/
                    let age = getAge(birthday);
                    let data = {
                        username: username,
                        password: password,
                        fullname: fullname,
                        interests: interests,
                        age: age,
                        confirmPassword: confirmPassword
                    };
                    triggerEvent('register', data);
                });
            });
        });
    }

    /*Render users page*/
    showUsersPage(sideBarData, mainData) {
        let _that = this;
        $.get('templates/welcome-user.html', function (template) {
            let renderedWrapper = Mustache.render(template, null);
            $(_that._wrapperSelector).html(renderedWrapper);
            $("#sort-selector").hide();
            document.getElementById("recentsName").innerHTML = "Recent Users";
            $.get('templates/recent-users.html', function (template) {
                let recentUsers = {
                    recentUsers: sideBarData
                };
                let renderedRecentUsers = Mustache.render(template, recentUsers);
                $('.recent-posts').html(renderedRecentUsers);
            });
            $.get('templates/users.html', function (template) {
                let blogUsers = {
                    blogUsers: mainData
                };
                let renderedUsers = Mustache.render(template, blogUsers);
                $('.articles').html(renderedUsers);

                /*
                  weird
                PAGINATION
                */

                /*Hide all users except first 5*/
                for (let i = 5; i < mainData.length; i++) {
                    $("#user-" + i).hide();
                }

                let first = 5;
                let second = first + 5;

                /*Handle events on forward button click*/
                $("#forward").on('click', function () {
                    if (first < mainData.length) {
                        for (let i = first; i < second; i++) {
                            $("#user-" + i).show();
                        }
                        for (let i = 0; i < first; i++) {
                            $("#user-" + i).hide();
                        }
                        first = second;
                        second = first + 5;
                    }
                });

                /*Handle events on backward button click*/
                $("#backward").on('click', function () {
                    if (first > 5) {
                        for (let i = 0; i < mainData.length; i++) {
                            $("#user-" + i).hide();
                        }
                        for (let i = first - 10; i < first - 5; i++) {
                            $("#user-" + i).show();
                        }
                        first = first - 5;
                        second = second - 5;
                    }
                });
            });
        });
    }
}