// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var prod = true;

angular.module('starter', [
    'ionic',
    'starter.controllers',
    'starter.services',
    'ngCordova',
    'angular-storage',
    'angularMoment',
    'angular-preload-image'
])

.constant('CONFIG', {
    // WEBSERVICE_URL: (prod) ? 'http://www.lamartineposella.com.br/api/' : 'http://192.168.254.200:8081/lamartine/api/',
    WEBSERVICE_URL: (prod) ? 'http://www.lamartineposella.com.br/api/' : 'http://www.lamartineposella.com.br/api/',
    DEFAULT_VIEW_URL: 'app/videos',
    DEFAULT_VIEW: 'app.videos',
    BLOG_URL: 'http://www.lamartineposella.com.br/blog/',
    BLOG_IMAGEM_BASEURL: 'http://www.lamartineposella.com.br/site/images/blog/',
    HTTP_TIMEOUT: 15000
})

.run(function(
    $ionicPlatform,
    $location,
    $cordovaNetwork,
    $state,
    $cordovaToast,
    $cordovaDialogs,
    $rootScope,
    $timeout,
    $cordovaStatusbar,
    Notification,
    store,
    CONFIG
) {
    /**
     * Criando a variavel no rootScope com os badges
     */
    $rootScope.badges = store.get('badges') || {};
    /**
     * Inicia a variavel no rootscope btnsRefresher
     */
    $rootScope.btnsRefresh = {};

    /**
     * Quando um view que requer auth é acessada sem estar logado
     * ela rejeita a promise e retorna "AUTH_REQUIRED", isso diferencia de outros erros
     * aqui testamos isso e redirecionamos para a tela de login com um toast informando
     * por que ele não conseguiu entrar e o que ele deve fazer.
     */
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        if (error === "AUTH_REQUIRED") {
            event.preventDefault();
            if (prod) {
                $cordovaDialogs.confirm('Você deve entrar para acessar esta área.', 'Área Restrita', ['Entrar com Facebook', 'Agora não'])
                    .then(function(buttonIndex) {
                        // no button = 0, 'OK' = 1, 'Cancel' = 2
                        var btnIndex = buttonIndex;
                        if (btnIndex == 1) {
                            $rootScope.doLoginFacebook(toState.name);
                        }
                    });
                // $cordovaToast.show('Você deve se logar para acessar esta área', 'short', 'center');    
            }
            //$state.go('app.entrar');
        }
    });
    /**
     * Código abaixo fica escutando a conexão para mostrar ou esconder 
     * o elemento que avisa que não tem conexão, através de $rootScope.isOnline
     * @type {Boolean}
     */
    $rootScope.isOnline = true;

    // $rootScope.buttonVideoRefresher = false;

    // $timeout(function(){
    //     console.log('Apareça botao meu filhao');
    //     //$rootScope.buttonVideoRefresher = true;
    //     // $rootScope.isOnline = false;
    // }, 3000);

    $ionicPlatform.ready(function() {

        if (prod) {

            $rootScope.isOnline = $cordovaNetwork.isOnline();
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                $rootScope.isOnline = true;
            });
            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                $rootScope.isOnline = false;
            });
        }

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})
/**
 * Interceptor que coloca um timeout configuravel atraves da constante CONFIG.HTTP_TIMEOUT
 * para todas as requisições do app
 */
.factory('myHttpInterceptor', function($q, CONFIG){
    return {
        request: function(config){
            config.timeout = CONFIG.HTTP_TIMEOUT;
            return config;
        }
    };
})  
.config(function(
    $httpProvider,
    $ionicConfigProvider,
    $stateProvider, 
    $urlRouterProvider, 
    CONFIG
) {
    /**
     * Ionic config
     */
    if (prod) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
    }
    if (ionic.Platform.isIOS()) {
        $ionicConfigProvider.backButton.text('Voltar');    
    }
    
    /**
     * Http interceptors
     */
    $httpProvider.interceptors.push('myHttpInterceptor');
    /**
     * Definição das rotas
     */
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.testes', {
            url: '/testes',
            views: {
                'menuContent': {
                    templateUrl: 'templates/testes.html',
                    controller: 'TestesController'
                }
            }
        })
        .state('app.blog', {
            url: '/blog',
            views: {
                'menuContent': {
                    templateUrl: 'templates/blog.html',
                    controller: 'BlogController'
                }
            },
            resolve: {
                posts: function(Blog){
                    return Blog.getCache();
                }
            }
        })
        .state('app.videos', {
            url: '/videos',
            views: {
                'menuContent': {
                    templateUrl: 'templates/videos.html',
                    controller: 'VideosController'
                }
            },
            resolve: {
                videos: function(Videos){
                    return Videos.getCache();
                }
            }
        })
        .state('app.audios', {
            url: '/audios',
            views: {
                'menuContent': {
                    templateUrl: 'templates/audios.html',
                    controller: 'AudiosController'
                }
            },
            resolve: {
                requireAuth: function(Login){
                    return Login.requireAuth();
                },
                audios: function(Audios){
                    return Audios.getCache();
                }
            }
        })
        .state('app.aovivo', {
            url: '/aovivo',
            views: {
                'menuContent': {
                    templateUrl: 'templates/aovivo.html',
                    controller: 'AovivoController'
                }
            },
            resolve: {
                requireAuth: function(Login){
                    return Login.requireAuth();
                },
            }
        })
        .state('app.contato', {
            url: '/contato',
            views: {
                'menuContent': {
                    templateUrl: 'templates/contato.html',
                    controller: 'ContatoController'
                }
            },
            resolve: {
                dadosGerais: function(DadosGerais){
                    return DadosGerais.getContato();
                }
            }
        })
        .state('app.biografia', {
            url: '/biografia',
            views: {
                'menuContent': {
                    templateUrl: 'templates/biografia.html',
                    controller: 'BiografiaController'
                }
            },
            resolve: {
                authData: function(Login){
                    return Login.authData();
                },
                contato: function(DadosGerais) {
                    return DadosGerais.getContato();
                }
            }
        })
        .state('app.biografia-completa', {
            url: '/biografia-completa',
            views: {
                'menuContent': {
                    templateUrl: 'templates/biografia_completa.html',
                    controller: 'BiografiaCompletaController'
                }
            },
            resolve: {
                biografia: function(DadosGerais){
                    return DadosGerais.getBiografia();
                }
            }
        })
        .state('app.linha-do-tempo', {
            url: '/linha-do-tempo',
            views: {
                'menuContent': {
                    templateUrl: 'templates/linha_do_tempo.html',
                    controller: 'LinhaDoTempoController'
                }
            },
            resolve: {
                ocorrencias: function(DadosGerais){
                    return DadosGerais.get('linhaDoTempo');
                }
            }
        })
        .state('app.entrar', {
            url: '/entrar',
            views: {
                'menuContent': {
                    templateUrl: 'templates/entrar.html',
                    controller: 'EntrarController'
                }
            }
        })
        .state('sair', {
            cache: false,
            url: '/sair',
            templateUrl: 'templates/sair.html',
            controller: 'SairController'
        })
        .state('app.agenda', {
            url: '/agenda',
            views: {
                'menuContent': {
                    templateUrl: 'templates/agenda.html',
                    controller: 'AgendaController'
                }
            },
            resolve: {
                eventos: function(Agenda){
                    return Agenda.getCache();
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(CONFIG.DEFAULT_VIEW_URL);
});
