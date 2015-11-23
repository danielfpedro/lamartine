angular.module('starter.controllers', [])
.directive('fillContentHeight', function($window){
    return {
        restrict: 'C',
        link: function(scope, element){
            function fillHeight() {
                var windowH = $window.innerHeight;
                var content = document.getElementsByClassName('scroll-content');
                var scrollBar = document.getElementsByClassName('scroll-bar');
                console.log(scrollBar.length);
                if (scrollBar.length > 1) {
                  // content[0].removeChild(scrollBar[0]);
                }
                var finalH = (windowH - 44);
                finalH = (ionic.Platform.isIOS()) ? finalH - 15 : finalH;
                element[0].style.height = finalH + 'px';
            }
            fillHeight();
            $window.addEventListener("resize", fillHeight);

            // document.getElementsByClassName('scroll')[0].remove();
            ///document.getElementsByClassName('scroll-bar-v')[0].style.visibility = 'hidden';
        }
    };
})
.filter('badgeMax', function(){
    return function(value, max){
        return (value > max) ? max + '+' : value;
    };
})
.directive('myNetworkAlert', function(){
    return {
        templateUrl:  'templates/Element/network_alert.html',
    };
})
.controller('AppCtrl', function(
    $scope,
    $rootScope,
    $cordovaToast,
    $ionicSideMenuDelegate,
    Notification,
    CustomState,
    Login,
    store
) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    

    $scope.$on('$ionicView.beforeEnter', function(e) {
        Login.authData().then(function(data){
            console.log(data);
            $rootScope.authData = data;
        });
        /**
         * Registra em todas as views e caso não tenha salvo no banco, salvo.
         * OBS.: Sabemos se salvou no banco através do cache local que informa
         */
        Notification.register();
    });

    /**
     * Deve ser rootScope pois é acessdo em .run no app.js
     */
    $rootScope.doLoginFacebook = function(go){
        if (prod) {
            Login
                .doLoginFacebook()
                .then(function(){
                    Login
                        .authData()
                        .then(function(data){
                            $rootScope.authData = data;
                            if (go) {
                                CustomState.goRoot(go);
                            }
                        });
                });
        } else {
            Login
                .doLoginFake()
                .then(function(){
                    Login
                        .authData()
                        .then(function(data){
                            $rootScope.authData = data;
                        });
                });
        }
    };
    $scope.doLogout = function() {
        Login
            .doLogout()
            .then(function(){
                Login
                    .authData()
                    .then(function(data){
                        $rootScope.authData = data;
                    });
            });
    };
})

.controller('TestesController', function(
    $scope,
    $cordovaSocialSharing
) {
    $scope.share = function(){
        document.addEventListener("deviceready", function () {
            $cordovaSocialSharing
                .share('Aqui a mensagem e tal', 'Assunto aqui', null, 'http://google.com')
                .then(function(result) {
                // Success!
                }, function(err) {
                    alert('deu ruim');
                });
        }, false);
    };

    $scope.goExternal = function(url){
        window.open(url, '_blank', 'location=no');
    };
})
.controller('ContatoController', function(
    $scope,
    Contato,
    dadosGerais,
    $timeout
) {
    $scope.contato = {};

    $scope.dadosGerais = dadosGerais;

    $scope.enviaContato = function(){
        Contato
            .envia($scope.contato)
            .then(function(){
                $scope.contato = {};
            });
    };
})
.controller('AgendaController', function(
    $scope,
    $rootScope,
    $timeout,
    $ionicScrollDelegate,
    Notification,
    Agenda,
    Sharing,
    eventos,
    store
) {

    $scope.eventos = eventos;

    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        
        if (eventos.length < 1 || $rootScope.badges.agenda > 0) {
            $scope.loading = true;
            $scope.getRefreshed();
        } else {
            $scope.modeDataCanBeLoaded = true;
        }

    });

    $scope.refreshByButton = function() {
        $scope.loading = true;
        $scope.getRefreshed();
    };

    $scope.loadMore = function(){
        Agenda
            .all()
            .then(function(data){
                console.log(data);
                if (data.length < 1) {
                    $scope.moreDataCanBeLoaded = false;
                }
                $scope.eventos = $scope.eventos.concat(data);
            }, function(){
                /**
                 * Importante pois se der problema no retorno ele fica um loop infinito buscando
                 * dados de algo que está retornando erro
                 */
                $scope.moreDataCanBeLoaded = false;
            })
            .finally(function(){
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };
    $scope.getRefreshed = function(){
        $ionicScrollDelegate.scrollTop();
        Notification.hideBtnsRefresh('blog');
        $scope.moreDataCanBeLoaded = false;
        $timeout(function(){
            Agenda
                .all(true)
                .then(function(data){
                    Notification.resetBadge('agenda');
                    $scope.agenda = data;
                })
                .finally(function(){
                    $scope.moreDataCanBeLoaded = true;
                    $scope.loading = false;
                    $scope.$broadcast('scroll.refreshComplete');
                });  
        }, 2000);
    };
    $scope.doRefresh = function() {
        $scope.moreDataCanBeLoaded = false;
        $scope.getRefreshed();
    };
    $scope.share = function(evento){
        Sharing.share('Evento "'+ evento.titulo +'" dia ' + moment(event.data).format('DD/MMMM') + '', 'Agenda Lamartine Posella', null, null);
    };
})
.controller('AudiosController', function(
    $scope,
    CustomState,
    Notification,
    $ionicScrollDelegate,
    $timeout,
    $rootScope,
    Sharing,
    audios,
    Audios
) {
    $scope.audios = audios;

    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        
        if (audios.length < 1 || $rootScope.badges.audios > 0) {
            $scope.loading = true;
            $scope.getRefreshed();
        } else {
            $scope.modeDataCanBeLoaded = true;
        }
    });

    $scope.doRefresh = function() {
        $scope.getRefreshed();
    };

    $scope.refreshByButton = function() {
        $scope.loading = true;
        $scope.getRefreshed();
    };

    $scope.getRefreshed = function(){
        Notification.hideBtnsRefresh('audios');
        $ionicScrollDelegate.scrollTop();
        $scope.moreDataCanBeLoaded = false;
        $timeout(function(){
            Audios
                .all(true)
                .then(function(data){
                    Notification.resetBadge('audios');
                    $scope.audios = data;
                })
                .finally(function(){
                    $scope.moreDataCanBeLoaded = true;
                    $scope.loading = false;
                    $scope.$broadcast('scroll.refreshComplete');
                });  
        }, 2000);
    };

    $scope.loadMore = function(){
        Audios
            .all()
            .then(function(data){
                if (data.length < 1) {
                    $scope.moreDataCanBeLoaded = false;
                }
                $scope.audios = $scope.audios.concat(data);
            }, function(){
                /**
                 * Importante pois se der problema no retorno ele fica um loop infinito buscando
                 * dados de algo que está retornando erro
                 */
                $scope.moreDataCanBeLoaded = false;
            })
            .finally(function(){
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.goAudio = function(audio){
        CustomState.goExternal(audio.url);
    };
    $scope.share = function(audio){
        Sharing.share(null, 'Escute Lamartine Posella "' + audio.titulo + '" em ', audio.url);
    };
})
.controller('AovivoController', function(
    $scope,
    Sharing,
    CustomState,
    Aovivo
) {

    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $scope.aovivo = null;
        $scope.loading = true;

        $scope.get();
    });

    $scope.doRefresh = function() {
        $scope.get();  
    };

    $scope.get = function(){
        Aovivo
            .get()
            .then(function(data){
                $scope.aovivo = data;
            })
            .finally(function(){
                $scope.loading = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.goAovivo = function(){
        CustomState.goExternal($scope.aovivo.link);
    };
    $scope.share = function(evento){
        Sharing.share(null, 'Assista Lamartine Posella Ao vivo em ', null, $scope.aovivo.link);
    };
})
.controller('VideosController', function(
    $scope,
    $rootScope,
    $timeout,
    $ionicScrollDelegate,
    videos,
    Notification,
    CustomState,
    Sharing,
    store,
    Videos
) {
    var youtubeBaseUrl = 'https://www.youtube.com/watch?v=';
    var youtubeBaseUrlShort = 'https://youtu.be/';

    $scope.videos = videos;
    
    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        if (videos.length < 1 || $rootScope.badges.videos > 0) {
            $scope.loading = true;
            $scope.getRefreshed();    
        } else {
            $scope.moreDataCanBeLoaded = true;        
        }
    });
    $scope.refreshByButton = function() {
        $scope.loading = true;
        $scope.getRefreshed();
    };
    $scope.doRefresh = function() {
        $scope.getRefreshed();
    };
    $scope.getRefreshed = function(){
        $ionicScrollDelegate.scrollTop();
        Notification.hideBtnsRefresh('blog');
        $scope.moreDataCanBeLoaded = false;
        Videos
            .all(true)
            .then(function(data){
                Notification.resetBadge('videos');
                $scope.videos = data;
            })
            .finally(function(){
                $scope.moreDataCanBeLoaded = true;
                $scope.loading = false;
                $scope.$broadcast('scroll.refreshComplete');
            });  
    };

    $scope.loadMore = function(){
        Videos
            .all()
            .then(function(data){
                if (data.length < 1) {
                    $scope.moreDataCanBeLoaded = false;
                }
                $scope.videos = $scope.videos.concat(data);
            }, function(){
                /**
                 * Importante pois se der problema no retorno ele fica um loop infinito buscando
                 * dados de algo que está retornando erro
                 */
                $scope.moreDataCanBeLoaded = false;
            })
            .finally(function(){
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.goYoutube = function(youtubeId){
        var url = youtubeBaseUrl + youtubeId;
        CustomState.goExternal(url);
    };

    $scope.share = function(video){
        var url = youtubeBaseUrlShort + video.youtubeId;

        Sharing.share(null, 'Assista a "' + video.titulo + '" no Youtube', null, url);
    };

})
.controller('BlogController', function(
    $scope,
    $rootScope,
    posts,
    CONFIG,
    CustomState,
    Notification,
    $ionicScrollDelegate,
    $timeout,
    Sharing,
    Blog
) {

    $scope.posts = posts;

    $scope.$on( "$ionicView.beforeEnter", function(scopes, states) {
        $scope.imagemBaseUrl = CONFIG.BLOG_IMAGEM_BASEURL;

        if (posts.length < 1 || $rootScope.badges.blog > 0) {
            $scope.loading = true;
            $scope.all();
        }

    });

    $scope.doRefresh = function() {
        $scope.all();
    };

    $scope.refreshByButton = function() {
        $scope.loading = true;
        $scope.all();
    };

    $scope.all = function(){
        $ionicScrollDelegate.scrollTop();
        Notification.hideBtnsRefresh('blog');
        $timeout(function(){
            Blog
                .all()
                .then(function(data){
                    Notification.resetBadge('blog');
                    $scope.posts = data;
                })
                .finally(function(){
                    $scope.loading = false;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        });
    };

    $scope.goBlog = function(url){
        CustomState.goExternal(url);
    };
    $scope.goAllPosts = function(){
        window.open(CONFIG.BLOG_URL, '_system', 'location=yes');
    };
    $scope.share = function(post){
        Sharing.share(null, 'Leia "'+post.titulo+'" no blog de Lamartine Posella', null, post.link);
    };
})
.controller('LinhaDoTempoController', function(
    $scope,
    ocorrencias
) {
    console.log(ocorrencias);
    $scope.ocorrencias = ocorrencias;
})
.controller('BiografiaController', function(
    $scope,
    CustomState,
    contato
) {
    
    $scope.contato = contato;

    $scope.goSocial = function(url){
        CustomState.goExternal(url);
    };
})
.controller('BiografiaCompletaController', function(
    $scope,
    biografia
) {
    $scope.biografia = biografia;
})
.controller('SairController', function(
    $scope,
    CustomState,
    CONFIG,
    Login
) {
    Login.doLogout();
})
.controller('EntrarController', function(
    $scope,
    $cordovaToast,
    Login,
    CustomState,
    CONFIG
) {
});

// .controller('Proto', function(
// $scope
// ) {
// })