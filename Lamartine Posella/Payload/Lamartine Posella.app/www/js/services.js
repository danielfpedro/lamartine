angular.module('starter.services', [])

.factory('Testes', function(
    $q,
    $http,
    CONFIG,
    $timeout,
    $rootScope,
    store
){
    return {
        data: {
            modelName: 'teste',
            posts: []
        },
        getLoading: function(){
            return this.loading;
        },
        getPostsWithLoading: function() {
            var defer = $q.defer();
            var _this = this;

            $rootScope.loading.posts = true;

            $timeout(function(){
                _this
                    .getPostsFromServer()
                    .then(function(){
                        defer.resolve();
                    }, function(){
                        defer.reject();
                    })
                    .finally(function(){
                        $rootScope.loading.posts = false;
                    });
                }, 3000);
            return defer.promise;            
        },
        refresh: function() {
            var defer = $q.defer();

            this
                .getPostsFromServer()
                .then(function(){
                    defer.resolve();
                }, function(){
                    defer.reject();
                });
            return defer.promise;            
        },
        getPostsFromCache: function() {
            var defer = $q.defer();
            this.data.posts = (this.data.posts.length > 0) ? this.data.posts : store.get('posts') || [];
            defer.resolve(this.data.posts);
            return defer.promise;
        },
        getPostsFromServer: function(){
            var defer = $q.defer();
            var _this = this;
            // this.data.posts.push({titulo: 'tey'});
            // defer.resolve();
            // return defer.promise; 
            $http
                .get(CONFIG.WEBSERVICE_URL + 'posts.php')
                .then(function(data){
                    _this.add(_this.data.posts, data.data.data);
                    
                    //store.set('posts', _this.data.posts);
                    defer.resolve();
                }, function(){
                    defer.reject();
                });
            return defer.promise; 
        },
        add: function(data, newData) {
            angular.forEach(newData, function(value){
                data.push(value);
            });
        }
    };
})

.factory('DadosGerais', function($q){
    return {
        dados: {
            loja: {
                url: 'http://www.lamartineposella.com.br/loja/'
            },
            biografia: [
                {
                    titulo: null,
                    texto: 'Lamartine Posella nasceu em 03 de maio de 1961 em Campinas, interior de São Paulo. Ainda menino, foi para Olímpia com os pais, onde passou toda a infância. Mais tarde, foi para São Paulo para estudar Engenharia Civil na Universidade Mackenzie. Ao ser despertado pelo chamado pastoral, trocou a engenharia pela teologia. Casado desde 29 de dezembro de 1983 com Lylian Tavares Marques Posella, tem uma filha, Érica, um genro, Ramon, e um neto, Enzo. Atualmente, é apóstolo e pastor presidente da Igreja Batista Palavra Viva em São Paulo e atua como pregador, músico, pianista, violonista, compositor, escritor e conferencista. Lamartine faz da leitura hábito e lazer. Ele lê de dois a três livros por semana e a cada dia se aprofunda nos idiomas que domina e nos assuntos variados que mais o interessam. Um deles é a neurociência. Já foram lidos mais de 20 livros do tema, inclusive de médicos, com o objetivo de passar as informações para o público leigo de forma mais prática.'
                },
                {
                    titulo: 'Ministério pastoral',
                    texto: 'O chamado pastoral de Lamartine aconteceu logo após sua conversão durante uma viagem com os Vencedores por Cristo (um grupo muito famoso na década de 80).'
                },
                {
                    titulo: 'Carreira Política',
                    texto: 'Em 1992 surgiu o interesse de Lamartine em ingressar na carreira política. E já no ano de 1994 disputou sua primeira eleição para o cargo de deputado federal em São Paulo. O resultado foi uma suplência, assumindo o cargo dois anos depois da eleição.  Na segunda eleição disputada, em 1998, foi reeleito deputado federal de São Paulo. Logo em seguida, no ano de 2000, candidatou-se a vice-prefeito em São Paulo e depois, em 2002, a governador, também em São Paulo, mas não foi eleito. Lamartine foi representante de sete comissões permanentes da Câmara dos Deputados, são elas: Ciência e Tecnologia; Comunicação e Informática; Direitos Humanos; Economia, Indústria e Comércio; Relações Exteriores e de Defesa Nacional; Seguridade Social e Família e de Trabalho, de Administração e Serviço Público. Ele também participou de comissões especiais e avaliou cinco PECs e dois projetos de lei. Além disso, participou de duas comissões externas e da investigação de uma CPI. Representante da Câmara dos Deputados: na Reunião da Comissão de Desarmamento da ONU, Nova Iorque, EUA, 1998; no XXVIII Programa Brasil/Miami de Política e Administração Pública, Governo Municipal de Miami, EUA, 1998.'
                },
                {
                    titulo: 'Carreira Musical',
                    texto: 'Músico, pianista, violonista. Lamartine é o quinto filho de uma concertista de piano. Assim, cresceu em uma casa onde todos tocavam o instrumento. Lamartine descobriu nessa época que tem ouvido absoluto e por isso não precisava ler as notas para tocar, bastava apenas ouvi-las para reproduzir. Isso o fez chegar ao quinto ano de piano sem que soubesse ler as notas musicais. Com a musicalidade como herança familiar, na época da faculdade tocou em bares e, depois da conversão ao evangelho, atuou como pianista e tecladista do grupo Vencedores por Cristo e gravou vários discos.'
                }
            ],
            // linhaDoTempo: [
            //     {
            //         ano: '1961',
            //         texto: 'Nasceu em 03 de Maio'
            //     },
            //     {
            //         ano: '1979',
            //         texto: 'Iniciou o curso de Engenharia Civil no Mackenzie'
            //     },
            //     {
            //         ano: '1981',
            //         texto: 'Converteu-se a Jesus'
            //     },
            //     {
            //         ano: '1987',
            //         texto: 'Formou em Teologia, Consagrado ao Ministério Pastoral'
            //     },
            //     {
            //         ano: '1989',
            //         texto: 'Fundou a Igreja Batista Palavra Viva'
            //     },
            //     {
            //         ano: '1996',
            //         texto: 'Deputado Federal por São Paulo'
            //     },
            //     {
            //         ano: '1998',
            //         texto: 'Reeleição do cargo de Deputado Federal, lançou o livro \'O Céu na terra \' e o CD \'Sonho Brasil\''
            //     },
            //     {
            //         ano: '2000',
            //         texto: 'Concorreu a Prefeitura de São Paulo e lançou o livro \'Reflexões para o Terceiro Milênio\''
            //     },
            //     {
            //         ano: '2002',
            //         texto: 'Foi candidato a Governardor de São Paulo e lançou o livro \'Jeová Jireh - No monte do senhor se proverá\''
            //     },
            //     {
            //         ano: '2002',
            //         texto: 'Lançou o livro \'Segredos da Alma\' e o CD \'Nos montes do Senhor\''
            //     },
            //     {
            //         ano: '2003',
            //         texto: 'Lançou o livro \'Maravilha Provisão\' e \'Temer ou não temer\''
            //     },
            //     {
            //         ano: '2006',
            //         texto: 'Foi consagrado ao Apostolado, lançou o livro \'O que não me contaram sobre Jesus\''
            //     },
            //     {
            //         ano: '2010',
            //         texto: 'Lançou o CD \'Até que todo mundo ouça\''
            //     },
            //     {
            //         ano: '2011',
            //         texto: 'Lançou o livro \'O Arsenal de guerra do Cristão\''
            //     },
            //     {
            //         ano: '2014',
            //         texto: 'Lança a série de palavras \'O maravilhoso cérebro e uma mente renovada\''
            //     },
            //     {
            //         ano: '2015',
            //         texto: 'Atualmente Lamartine Posella é presidente da igreja Batista da Palavra Viva'
            //     },
            // ],
            contato: {
                'telefone': '+55 11 3641-3322',
                'email': 'contato@lamartineposella.com.br',
                'comunicado': 'Atenção: Ninguem além dos contatos aqui especificados podem falar em nome de Lamartine Posella.',
                'redesSociais' : [
                    {
                        'nome': 'Facebook',
                        'image': 'facebook_icon.png',
                        'url': 'https://www.facebook.com/lamartineposella'
                    },
                    {
                        'nome': 'Youtube',
                        'image': 'youtube_icon.png',
                        'url': 'https://www.youtube.com/user/aplamartineposella'
                    },
                    {
                        'nome': 'Instagram',
                        'image': 'instagram_icon.png',
                        'url': 'https://instagram.com/LamartinePosella'
                    },
                    {
                        'nome': 'Twitter',
                        'image': 'twitter_icon.png',
                        'url': 'https://twitter.com/Lamartineposell'
                    },
                    {
                        'nome': 'Wikipedia',
                        'url': 'https://pt.wikipedia.org/wiki/Lamartine_Posella',
                        'image': 'wikipedia_icon.png'
                    },
                    {
                        'nome': 'Soundcloud',
                        'url': 'https://soundcloud.com/lamartine-posella',
                        'image': 'soundcloud_icon.png'
                    }
                ]
            },
            sobre:
            {
                interagirFacebook: {
                    label: '/interagir',
                    url: 'https://www.facebook.com/interagir'
                },
                interagirSite: {
                    label: 'www.agenciainteragir.com.br',
                    url: 'http://www.agenciainteragir.com.br'
                },
                interagirTelefone: '+55 (24) 3336-1566',
                interagirLocalizacao: 'Volta Redonda / RJ'
            }
        },
        get: function(data){
            var defer = $q.defer();
            defer.resolve(this.dados[data]);
            return defer.promise;
        },
        getSobre: function(){
            var defer = $q.defer();
            defer.resolve(this.dados.sobre);
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
        },
        getLoja: function(){
            var defer = $q.defer();
            defer.resolve(this.dados.loja);
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

.factory('Notification', function(
    $q,
    $http,
    $ionicPlatform,
    $rootScope,
    $cordovaLocalNotification,
    $ionicHistory,
    $cordovaToast,
    $timeout,
    $cordovaDevice,
    $cordovaDialogs,
    CustomState,
    CONFIG,
    store
){
    return {
        register: function(){

            var defer = $q.defer();
            var _this = this;
            ionic.Platform.ready(function(){
                alert('Entrou em registrar notificação');
                
                var uuid = (prod) ? $cordovaDevice.getUUID() : '123';
                var platform = (prod) ? $cordovaDevice.getPlatform() : 'android';
                
                alert('UUID: ' + uuid);
                alert('Platform: ' + platform);

                _this
                    .getRegIdAndWatchNotification(platform)
                    .then(function(regId){
                        alert('Resolveu pegar o id');
                        var registeredBefore = store.get('regIdRegistered') || false;

                        alert('Registrado before?');
                        alert(registeredBefore);

                        if (!registeredBefore) {
                            // alert('Salvando o regid');
                            _this
                                .saveRegId(uuid, regId, platform)
                                .then(function(result){
                                    alert('Salvou regid', result);
                                    console.log(result);
                                    defer.resolve(result);
                                }, function (err){
                                    alert('Não salvou regid', err);
                                    //alert(err);
                                    console.log(err);
                                    defer.reject();
                                });
                        }
                    }, function(){
                        defer.reject();
                    });

            });

            return defer.promise;
        },
        getRegIdAndWatchNotification: function(platform){
            var defer = $q.defer();
            var _this = this;
            if (!prod) {
                defer.resolve('123regid');
                return defer.promise;
            }

            ionic.Platform.ready(function(){
                var push = PushNotification.init({
                    "android": {
                        "senderID": "1004540944791"
                    },
                    "ios": {
                        "alert": "true",
                        "badge": "true",
                        "sound": "true"
                    }
                });
                push.on('registration', function(data) {

                    alert('Registrado:');
                    alert(data.registrationId);

                    defer.resolve(data.registrationId);
                });
                push.on('notification', function(data) {
                    var customData = data.additionalData;
                    if (platform.toLowerCase() == 'ios') {
                        customData = data.additionalData.custom;
                    }
                    console.log('Data da notificação');
                    console.log(data);
                    /**
                     * Incrementa badge
                     * OBS.: Da uns bugs se nao enrolar no timeout
                     */
                    $timeout(function(){
                        _this.incrementBadge(customData.tipo);    
                    });
                    /**
                     * Se for notificacao_avulsa faz a mesma coisa em 
                     * foreground ou background
                     */
                    if (customData.tipo == 'notificacao_avulsa') {
                        $cordovaDialogs.beep(1);
                        $cordovaDialogs.alert(data.message, data.title, 'OK');
                    } else {
                        if (data.additionalData.foreground) {
                            $cordovaDialogs.beep(1);

                            if (_this.getStateByTipo(customData.tipo) == $ionicHistory.currentStateName()) {
                                $timeout(function(){
                                    $rootScope.btnsRefresh[customData.tipo] = true;
                                }, 1000);
                                // $cordovaToast.show('Conteúdo novo disponível, atualize para visualizar.', 'long', 'bottom');
                            } else {
                                $cordovaToast.show('Conteúdo novo adicionado em ' + customData.tipo + '.', 'short', 'bottom');
                            }
                            console.log($ionicHistory.currentStateName());
                            //$cordovaToast();
                        } else {
                            CustomState.goRoot(_this.getStateByTipo(customData.tipo));
                        }
                    }
                    // data.message,
                    // data.title,
                    // data.count,
                    // data.sound,
                    // data.image,
                    // data.additionalData
                });
                push.on('error', function(e) {
                    console.log(e.message);
                    // alert(e.message);
                    defer.reject();
                });
            });
            return defer.promise;
        },
        saveRegId: function(uuid, regId, platform){

            var defer = $q.defer();
            console.log('Indo no servidor salvar o regid');
            $http
                .post(CONFIG.WEBSERVICE_URL + 'salva_regid.php', {uuid: uuid, regid: regId, platform: platform})
                .then(function(result){
                    console.log('Foi no servidor e voltou jóia');
                    /**
                     * Garanto que realmente salvou
                     */
                    if (result.data.data == 'lamartine') {
                        store.set('regIdRegistered', true);   
                    }
                    defer.resolve(result);
                }, function(){
                    console.log('FOi no servidor e voltou reuim, deu erro rsrsrs');
                    defer.reject();
                });

            return defer.promise;
        },
        incrementBadge: function(tipo){
            var currentValue = (typeof $rootScope.badges[tipo] == 'undefined') ? 0 : $rootScope.badges[tipo];
            console.log('CurrentValue de badges["videos"]');
            console.log(currentValue);
            var newValue = currentValue + 1;
            console.log('Novo valor para badges.' + tipo + ' é ' + newValue );
            $rootScope.badges[tipo] = newValue;
            store.set('badges', $rootScope.badges);
        },
        resetBadge: function(tipo){
            var badges = store.get('badges');
            $rootScope.badges[tipo] = 0;
            store.set('badges', $rootScope.badges);
        },
        hideBtnsRefresh: function(tipo){
            $rootScope.btnsRefresh[tipo] = false;
        },
        getStateByTipo: function(tipo){
            return 'app.' + tipo;
        },
        // getLocalNotificationIdByTipo: function(tipo){
        //     var out = '';
        //     switch(tipo){
        //         case 'videos':
        //             out = 1;
        //             break;
        //     }
        //     return out;
        // },
    };
})

.factory('Login', function(    
    $cordovaFacebook,
    $cordovaToast,
    $http,
    $ionicBackdrop,
    $ionicLoading,
    $ionicPlatform,
    $ionicSideMenuDelegate,
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
            defer.resolve(store.get('authData') || null);
            return defer.promise;
        },
        doLogout: function(){
            var defer = $q.defer();

            var delay = 2000;

            $ionicLoading.show({template: 'Saindo, aguarde...'});

            store.remove('authData');

            if (prod) {
                $ionicPlatform.ready(function() {
                    $cordovaFacebook
                        .logout()
                        .then(function(){
                            // $ionicSideMenuDelegate.toggleLeft();
                        }, function() {
                            // $cordovaToast
                            //     .show('Olá, você entrou como ' + data.name + '.', 'long', 'bottom');
                            // defer.reject();
                        })
                        .finally(function(){
                            $timeout(function(){
                                $ionicLoading.hide();
                                /**
                                 * Importante ir para a default view pois ele pode estar em 
                                 * uma area restrita e deslogar e continuar aessando está área deslogado.
                                 */
                                CustomState.goRoot(CONFIG.DEFAULT_VIEW);
                                defer.resolve();
                            }, delay);
                        });
                });
            } else {
                $timeout(function(){
                    $ionicLoading.hide();
                    defer.resolve();
                }, delay);
            }

            return defer.promise;
        },
        doLoginFacebook: function(){
            var defer  = $q.defer();
            
            $ionicBackdrop.retain();

            facebookConnectPlugin.login(["public_profile", "email"], function(data) {
                console.log('Valor do data');
                console.log(data);
                console.log('Access Token');
                console.log(data.authResponse.accessToken);
                $http
                    // .get(CONFIG.WEBSERVICE_URL + 'save_user.php?access_token=' + data.authResponse.accessToken)
                    .get(CONFIG.WEBSERVICE_URL + 'save_user.php?access_token=' + data.authResponse.accessToken)
                    .success(function(result){
                        // console.log(accessToken);
                        // console.log(result);
                        store.set('authData', result.data);
                        
                        // $cordovaToast
                        //     .show('Olá, você entrou como ' + data.name + '.', 'long', 'center');

                        //$ionicSideMenuDelegate.toggleLeft();

                        defer.resolve(data);
                    })
                    .error(function(){
                        $cordovaToast.show('Ocorreu um erro de comunicação com os nossos servidores. Por favor, tente novamente', 'long', 'bottom');
                        defer.reject();
                    })
                    .finally(function(){
                        $ionicBackdrop.release();
                    });
            }, function (error) {
                $ionicBackdrop.release();
                console.log('erro ao logar');
                console.error(error);
                defer.reject();
            });
            return defer.promise;
        },
        doLoginFake: function(){
            var defer  = $q.defer();
            
            $ionicBackdrop.retain();

            $timeout(function(){
                var data = {name: 'Daniel Pedro', id: '979654248764283'};
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
                .then(function(success) {
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
.factory('LinhaDoTempo', function(
    $q,
    $http,
    CONFIG,
    store
){
    return {
        all: function() {

            var defer = $q.defer();

            $http
                .get(CONFIG.WEBSERVICE_URL + 'linha_do_tempo.php')
                .success(function(data){
                    store.set('linha_do_tempo', data.data);
                    defer.resolve(data.data);
                })
                .error(function(){
                    defer.reject();
                });
                
            return defer.promise;
        },
        getCache: function(){
            var defer = $q.defer();
            defer.resolve(store.get('linha_do_tempo') || []);
            return defer.promise;
        }
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
})
.factory('Destaques', function(
    $q,
    $http,
    CONFIG,
    store
) {
    return {
        all: function() {

            var defer = $q.defer();

            $http
                .get(CONFIG.WEBSERVICE_URL + 'destaques.php')
                .success(function(destaques){
                    store.set('destaques', destaques.data);
                    defer.resolve(destaques.data);
                })
                .error(function(){
                    defer.reject();
                });
            return defer.promise;
        },
        getCache: function(){
            var defer = $q.defer();
            defer.resolve(store.get('destaques') || []);
            return defer.promise;
        }
    };
})
.factory('CustomState', function(
    $ionicHistory,
    $ionicLoading,
    $cordovaInAppBrowser,
    $ionicPlatform,
    $rootScope,
    $state,
    $ionicSideMenuDelegate
) {
    return {
        goExternal: function (url) {
            $ionicPlatform.ready(function() {
                var options = {
                    location: 'yes',
                    clearcache: 'yes',
                    toolbar: 'yes',
                    closebuttoncaption: 'Voltar'
                };
                // $ionicLoading.show({template: 'Abrindo, aguarde...'});
                $cordovaInAppBrowser.open(url, '_system', options)
                    .then(function(event) {
                    // success
                    })
                    .catch(function(event) {
                        // $ionicLoading.hide();
                    });
            });

            $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event){
                $ionicLoading.hide();
            });

            $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
                $ionicLoading.hide();
            });

            // if (ionic.Platform.isIOS()) {
            //     alert('Aqui');
            //     window.open(url, '_blank', 'location=yes');    
            // } else {
            //     window.open(url, '_system', 'location=yes');
            // }
            
            return false;
        },
        goRoot: function(url, params){
            params = (typeof params == 'undefined') ? {} : params;
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            if ($ionicSideMenuDelegate.isOpenLeft()) {
                $ionicSideMenuDelegate.toggleLeft();    
            }
            $state.go(url, params);
        }
    };
});
