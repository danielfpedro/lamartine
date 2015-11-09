angular.module('starter.services', [])

.factory('DadosGerais', function($q){
    return {
        dados: {
            biografia: {
                textos: [
                    {
                        titulo: null,
                        texto: 'Lamartine Posella nasceu em 03 de maio de 1961 em Campinas, interior de São Paulo.'
                    },
                    {
                        titulo: 'Ministério pastoral',
                        texto: 'O chamado pastoral de Lamartine aconteceu logo após sua conversão durante uma viagem com os Vencedores por Cristo (um grupo muito famoso na década de 80).'
                    },
                ]
            },
            linhaDoTempo: [
                {
                    ano: '1963',
                    texto: 'Nasceu.'
                },
                {
                    ano: '1969',
                    texto: 'Cresceu.'
                }
            ],
            contato: {
                'telefone': '+55 11 3641-3322',
                'email': 'contato@lamartineposella.com.br',
                'comunicado': 'Atenção: Ninguem além dos contatos aqui especificados podem falar em nome de Lamartine Posella.',
                'redesSociais' : [
                    {
                        'nome': 'Facebook',
                        'icon': 'ion-social-facebook',
                        'url': 'https://www.facebook.com/lamartineposella'
                    },
                    {
                        'nome': 'Youtube',
                        'icon': 'ion-social-youtube',
                        'url': 'https://www.youtube.com/user/aplamartineposella'
                    },
                    {
                        'nome': 'Instagram',
                        'icon': 'ion-social-instagram',
                        'url': 'https://instagram.com/LamartinePosella'
                    },
                    {
                        'nome': 'Twitter',
                        'icon': 'ion-social-twitter',
                        'url': 'https://twitter.com/Lamartineposell'
                    },
                    {
                        'nome': 'Wikipedia',
                        'icon': 'ion-social-instagram',
                        'url': 'https://pt.wikipedia.org/wiki/Lamartine_Posella'
                    }
                ]
            }
        },
        get: function(data){
            var defer = $q.defer();
            defer.resolve(this.dados[data]);
            return defer.promise;
        },
        getContato: function(){
            var defer = $q.defer();
            defer.resolve(this.dados.contato);
            return defer.promise;
        },
        getBiografia: function(){
            var defer = $q.defer();
            defer.resolve(this.dados.biografia);
            return defer.promise;
        }
    };
})
.factory('Sharing', function(
    $q,
    $ionicBackdrop,
    $cordovaSocialSharing
){
    return {
        share: function(subject, text, file, url){
            var defer  = $q.defer();

            $ionicBackdrop.retain();

            document.addEventListener("deviceready", function () {
                $cordovaSocialSharing
                    .share(subject,text, file, url)
                    .then(function(result) {
                        defer.resolve();
                        $ionicBackdrop.release();
                    }, function(){
                        defer.reject();
                        $ionicBackdrop.release();
                    });
            }, false);

            return defer.promise;
        }
    };
})
.factory('Login', function(    
    $cordovaFacebook,
    $cordovaToast,
    $http,
    $ionicBackdrop,
    $ionicLoading,
    $ionicPlatform,
    $q,
    $state,
    $timeout,
    CONFIG,
    CustomState,
    store
){
    return {
        requireAuth: function(){
            var defer  = $q.defer();
            if (store.get('authData')) {
                defer.resolve();
            } else {
                defer.reject('AUTH_REQUIRED');
            }
            return defer.promise;
        },
        authData: function(){
            var defer  = $q.defer();
            defer.resolve(store.get('authData'));
            return defer.promise;
        },
        doLogout: function(){
            var delay = 2000;

            $ionicLoading.show({template: 'Saindo, aguarde...'});

            store.remove('authData');
            if (prod) {
                $ionicPlatform.ready(function() {
                    $cordovaFacebook
                        .logout()
                        .finally(function(){
                            $timeout(function(){
                                $ionicLoading.hide();
                                CustomState.goRoot(CONFIG.DEFAULT_VIEW);
                            }, delay);
                        });
                });
            } else {
                $timeout(function(){
                    $ionicLoading.hide();
                    CustomState.goRoot(CONFIG.DEFAULT_VIEW);
                }, delay);
            }
        },
        doLoginFacebook: function(){
            var defer  = $q.defer();
            
            $ionicBackdrop.retain();
            $ionicPlatform.ready(function() {
                $cordovaFacebook
                    .login(["public_profile", "email"])
                    .then(function(success) {

                        console.log(success);

                        var accessToken = success.authResponse.accessToken;

                        $cordovaFacebook.api("me", ["public_profile"])
                            .then(function(data) {
                                $http
                                    .get(CONFIG.WEBSERVICE_URL + 'save_user.php?access_token=' + accessToken)
                                    .success(function(result){
                                        console.log(accessToken);
                                        console.log(result);
                                        store.set('authData', data);
                                        defer.resolve(data);
                                    })
                                    .error(function(){
                                        $cordovaToast.show('Ocorreu um erro de comunicação com os nossos servidores. Por favor, tente novamente', 'long', 'bottom');
                                        defer.reject();
                                    });
                            }, function (error) {
                                console.log(error);
                                defer.reject();
                            })
                            .finally(function(){
                                $ionicBackdrop.release();
                            });
                    }, function (error) {
                        console.log(error);
                        defer.reject();
                        $ionicBackdrop.release();
                    });
            });

            return defer.promise;
        },
        doLoginFake: function(){
            var defer  = $q.defer();
            
            $ionicBackdrop.retain();

            $timeout(function(){
                var data = {name: 'Daniel Pedro', id: '08974045'};
                store.set('authData', data);
                $ionicBackdrop.release();
                defer.resolve(data);
            }, 2000);

            return defer.promise;
        }
    };
})
.factory('Aovivo', function(
    $q,
    $http,
    CONFIG
){
    return {
        get: function(){
            var defer = $q.defer();
            
            $http
                .get(CONFIG.WEBSERVICE_URL + 'aovivo.php')
                .success(function(result){
                    defer.resolve(result.data);
                })
                .error(function(){
                    defer.reject();
                });

            return defer.promise;
        }
    };
})
.factory('Audios', function(
    $q,
    $timeout,
    InfiniteScroll,
    store
){
    return {
        all: function(refreshed){
            var defer = $q.defer();

            InfiniteScroll
                .all('audios', 'audios.php', refreshed)
                .then(function(success){
                    defer.resolve(success);
                }, function(error){
                    defer.reject();
                });

            return defer.promise;
        },
        getCache: function(){
            var defer = $q.defer();
            defer.resolve(store.get('audios') || []);
            return defer.promise;
        },
    };
})
.factory('Videos', function(
    $http,
    $q,
    $timeout,
    InfiniteScroll,
    store
){
    return {
        // allFromServer: function(){
        //     var defer = $q.defer();
        //     $timeout(function(){
        //         var data = [
        //             {
        //                 titulo: 'Conquistadores da mente',
        //                 chamada: 'Conquistadores da mente. Sexta mensagem da série "Conquistadores" pregada pelo Apóstolo Lamartine Posella na Igreja Batista Palavra Viva em 25 de Outubro de 2015.',
        //                 youtubeId: '6N_wj2sMP5o'
        //             },
        //             {
        //                 titulo: 'Conquistadores se mantém conectados ao rio',
        //                 chamada: 'Conquistadores se mantém conectados ao rio. Quinta mensagem da série "Conquistadores" pregada pelo Apóstolo Lamartine Posella na Igreja Batista Palavra Viva em 18 de Outubro de 2015.',
        //                 youtubeId: '3rHsDOhDC5s'
        //             },
        //         ];
        //         store.set('videos', data);
        //         defer.resolve(data);
        //     }, 2000);
        //     return defer.promise;
        // },
        getCache: function(){
            var defer = $q.defer();
            defer.resolve(store.get('videos') || []);
            return defer.promise;
        },
        all: function(refreshed){
            var defer = $q.defer();

            InfiniteScroll
                .all('videos', 'videos.php', refreshed)
                .then(function(success){
                    defer.resolve(success);
                }, function(error){
                    defer.reject();
                });

            return defer.promise;
        }
    };
})
.factory('InfiniteScroll', function(
    $http,
    $q,
    CONFIG,
    store
){
    return {
        getPage: function(key){
            return store.get(key);
        },
        setPage: function(key, value){
            store.set(key, value);
        },
        all: function(name, url, refreshed) {
            var _this = this;
            
            var pageName = name + 'Page';

            refreshed = (typeof refreshed == 'undefined') ? false : refreshed;

            var page = this.getPage(pageName);

            if (refreshed) {
                page = 0;
            }

            var defer = $q.defer();

            $http
                .get(CONFIG.WEBSERVICE_URL + url + '?page=' + page)
                .success(function(result){
                    var nextPage = page + 1;

                    _this.setPage(pageName, nextPage);

                    if (refreshed) {
                        store.set(name, result.data);
                    } else {
                        var dataCache = store.get(name) || [];
                        store.set(name, dataCache.concat(result.data));
                    }
                    defer.resolve(result.data);
                })
                .error(function(){
                    defer.reject();
                });
            return defer.promise;
        },
    };
})
.factory('Blog', function(
    $q,
    $http,
    store,
    CONFIG
){
    return {
        all: function() {

            var defer = $q.defer();

            $http
                .get(CONFIG.WEBSERVICE_URL + 'posts.php')
                .success(function(posts){
                    store.set('posts', posts.data);
                    defer.resolve(posts.data);
                })
                .error(function(){
                    defer.reject();
                });
            return defer.promise;
        },
        getCache: function(){
            var defer = $q.defer();
            defer.resolve(store.get('posts') || []);
            return defer.promise;
        }
    };
})
.factory('Agenda', function(
    $q,
    $timeout,
    InfiniteScroll,
    store
){
    return {
        all: function(refreshed){
            var defer = $q.defer();

            InfiniteScroll
                .all('eventos', 'eventos.php', refreshed)
                .then(function(success){
                    defer.resolve(success);
                }, function(error){
                    defer.reject();
                });

            return defer.promise;
        },
        // allFromServer: function(){
        //     var defer = $q.defer();
        //     $timeout(function(){
        //         var data = [
        //             {
        //                 titulo: 'Palestra sobre a Vida',
        //                 texto: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
        //                 data: '2015-11-21'
        //             },
        //             {
        //                 titulo: 'Workshop spre empreendedorismo ',
        //                 texto: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
        //                 data: '2015-11-29'
        //             },
        //         ];
        //         store.set('eventos', data);
        //         defer.resolve(data);
        //     }, 2000);
        //     return defer.promise;
        // },
        getCache: function(){
            var defer = $q.defer();
            defer.resolve(store.get('eventos') || []);
            return defer.promise;
        },
        // all: function(from){
        //     switch(from){
        //         case 'server':
        //             return this.allFromServer();
        //         default:
        //             return this.allFromLocal();
        //     }
        // }
    };
})
.factory('Contato', function(
    $cordovaToast,
    $http,
    $ionicLoading,
    $q,
    $timeout,
    CONFIG
) {
    return {
        envia: function(contato){
            var defer = $q.defer();
            var delay = 2000;

            $ionicLoading.show({template: 'Enviando, aguarde...'});
            /**
             * Da um delay antes de mandar pq se o envio for muito rapido
             * da um efeito estranho caso ele envie com o teclado do smatphone aberto
             */
            $timeout(function(){
                $http
                    .post(CONFIG.WEBSERVICE_URL + 'contato_add.php', contato)
                    .success(function(){
                        $cordovaToast.show('Contato enviado com sucesso, obrigado.', 'long', 'bottom');
                        defer.resolve();
                    })
                    .error(function(){
                        $cordovaToast.show('Ocorreu um erro ao tentar salvar o contato. Por favor tente novamente.', 'long', 'bottom');  
                        defer.reject();
                    })
                    .finally(function(){
                        $ionicLoading.hide();
                    });
                }, delay);

            return defer.promise;
        }
    };
}).factory('CustomState', function(
    $ionicHistory,
    $state
) {
    return {
        goRoot: function(url){
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            $state.go(url);
        }
    };
});
