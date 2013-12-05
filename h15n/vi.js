angular.module('h15n.vi', [])
    .value('$h15n-vi', {
        greetings: {
            hello: "Xin chao, {{name}}. Tui dang test {{app}} ne ^_^",
            bye: "Tam biet, {{name}}. Tui dang test {{app}} ne ^_^"
        }
    });