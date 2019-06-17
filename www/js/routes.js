routes = [
  {
    path: '/',
    // templateUrl: './pages/home.html',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      app.request.getJSON("http://localhost/askitchenweb/api/v1/categories", function(res) {

        // Hide Preloader
        app.preloader.hide();

        // console.log(res)
        // var data = JSON.parse(res)
        
        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/home.html',
          },
          {
            context: {
              data: res.data,
            }
          }
        );

      });
    },
  },
  {
    path: '/search',
    componentUrl: './pages/search.html',
  },
  {
    path: '/login/',
    componentUrl: './pages/login.html',
    // on: {
    //   pageInit: function (event, page) {
        
    //     $$('i.icon.icon-back').on('click', function () {
    //       // app.dialog.alert('Tes.', 'Login');
    //       var view = app.views.current;
    //       view.router.back(view.history[0], { force: true });
    //     });

    //     $$('.login-button').on('click', function () {
          
    //       var email = $$('input [name="email"]').val();
    //       if (email == '') {
    //           app.dialog.alert('Masukkan alamat email anda.', 'Login');
    //           return;
    //       }
        
    //       var password = $$('input [name="password"]').val();
    //       if (password == '') {
    //           app.dialog.alert('Masukkan password anda.', 'Login');
    //           return;
    //       }
          
    //       app.preloader.show();
        
    //       var formData = app.form.convertToData('.login-form');
        
    //       // var regId = localStorage.getItem('RegId');
    //       // formData.gcmid = regId;
        
          
    //       // http://localhost/
    //       app.request.post('http://localhost/askitchenweb/api/v1/auth/login', formData, function (res) {
            
    //         app.preloader.hide();
            
    //         var data = JSON.parse(res);
        
    //         if (data.status) {
            
    //           localStorage.setItem('email', email);
    //           localStorage.setItem('password', password);
              
    //           app.data.bLogedIn = true;
    //           app.data.mbrid = data.mbrid;
    //           app.data.email = email;
    //           app.data.pwd   = password;
    //           app.data.token = data.token;
              
    //           // kosongkan isian nomor pin
    //           $$('input [name="password"]').val('');
        
    //           // app.loginScreen.close('#my-login-screen');
    //           if (app.data.lastURL) {
                
    //             app.router.navigate(app.data.lastURL, {
    //               reloadCurrent: true,
    //               ignoreCache: true,
    //             });
    //           }
        
    //         } else {
    //           app.dialog.alert(data.message, 'Login');
    //         }
    //       });
    //     });
        
    //   }
    // }
  },
  {
    path: '/register/',
    url: './pages/register.html',
    on: {
      pageInit: function (event, page) {
        
        $$('i.icon.icon-back').on('click', function () {
          var view = app.views.current;
          view.router.back(view.history[0], { force: true });
        });
        
        $$('.register-button').on('click', function () {
  
          var first_name = $$('input [name="first_name"]').val();
          if (first_name == '') {
              app.dialog.alert('Masukkan nama depan anda.', 'Daftar');
              return;
          }
          
          var last_name = $$('input [name="last_name"]').val();
          if (last_name == '') {
              app.dialog.alert('Masukkan nama belakang anda.', 'Daftar');
              return;
          }
          
          // var rgx_nama = /^[a-zA-Z]'?([a-zA-Z]|\,|\.| |-)+$/;
          // var namax = nama.trim().match(rgx_nama);
          // if (!namax) {
          //   app.dialog.alert('Input data nama belum benar.', 'Daftar');
          //   return;
          // }
        
          var email = $$('input [name="email"]').val();
          if (email == '') {
              app.dialog.alert('Masukkan email anda.', 'Daftar');
              return;
          }
        
          var password = $$('input [name="password"]').val();
          if (password == '') {
            app.dialog.alert('Masukkan password anda.', 'Daftar');
            return;
          }
        
          var pconfirm = $$('input [name="password_confirm"]').val();
          if (pconfirm == '') {
            app.dialog.alert('Masukkan password confirm anda.', 'Daftar');
            return;
          }
        
          app.preloader.show();
          
          // var regId = localStorage.getItem('RegId');
          var formData = app.form.convertToData('.register-form');
        
          // formData.gcmid = regId;
          
          app.request.post('http://localhost/askitchenweb/api/v1/register', formData, function (res) {
            
            app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              
              // simpan data nomor handphone
              localStorage.setItem('email', email);
              localStorage.setItem('password', password);
        
              app.data.email    = email;
              app.data.password = password;
        
              // set data ke form login
              $$('input [name="email"]').val(email);
        
              // app.loginScreen.close('#my-reg-screen');
            
              // setTimeout(function () {
                app.dialog.alert(data.message, 'Daftar');
              // }, 2000);
        
            } else {
              app.dialog.alert(data.message, 'Daftar');
            }
          });
        });

        $$('.login-button').on('click', function () {
  
          var view = app.views.current;
          view.router.back(view.history[0], { force: true });
        });
        
      }
    }
  },
        
  {
    path: '/cart/',
    // componentUrl: './pages/cart.html',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      if (!app.data.bLogedIn) {
        
        resolve(
          {
            componentUrl: './pages/login.html',
          }
        );
        return;
      }

      // Show Preloader
      app.preloader.show();

      app.request.get("http://localhost/askitchenweb/api/v1/cart", function(res) {

        // Hide Preloader
        app.preloader.hide();

        // console.log(res)
        var data = JSON.parse(res)
        
        app.data.total  = data.total;
        app.data.gtotal = data.total;

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/cart.html',
          },
          {
            context: {
              data: data.data,
            }
          }
        );

      });
    },
  },
  {
    path: '/profile/',
    url: './pages/profile.html',
    on: {
      
      pageInit: function (event, page) {
        
        var db = app.data.db;
        // $$('#nama').val('NAMA USAHA');

        if (db) {
          //app.dialog.alert('db not initialized!');
          db.transaction(function(tx) {
            tx.executeSql('select nama, alamat, kota, kodepos, telepon, fax, email, npwp from setup;',
            [], function(ignored, res) {
              $$('#nama').val(res.rows.item(0).nama);  
              $$('#alamat').val(res.rows.item(0).alamat);  
              $$('#kota').val(res.rows.item(0).kota);  
              $$('#kodepos').val(res.rows.item(0).kodepos);  
              $$('#telepon').val(res.rows.item(0).telepon);  
              $$('#fax').val(res.rows.item(0).fax);  
              $$('#email').val(res.rows.item(0).email);  
              $$('#npwp').val(res.rows.item(0).npwp);              
            });
          }, function(error) {
            app.dialog.alert('insert error: ' + error.message);
          });      
        }
        
        $$('.take-photo').on('click', function () {
          
          app.dialog.alert('Take photo!')
          
          // var options = {
          //   quality: 50,
          //   destinationType: destinationType.DATA_URL,
          //   sourceType: pictureSource.CAMERA,
          //   encodingType: Camera.EncodingType.JPEG,
          //   mediaType: Camera.MediaType.PICTURE,
          //   targetWidth: 150, // 360
          //   targetHeight: 75, // 360
          //   // allowEdit: true,
          //   correctOrientation: true  //Corrects Android orientation quirks
          //   // popoverOptions: CameraPopoverOptions,
          //   // saveToPhotoAlbum: false
          // };
        
          // // update camera image directive
          // navigator.camera.getPicture(function cameraSuccess(imageData) {
          //   $$('.responsive.profile2').attr('src', "data:image/jpeg; base64," + imageData);
          //   localStorage.setItem('profile', imageData);
          // }, function cameraError(err) {
          //   // console.log('Failed because: ');
          //   app.dialog.alert(err);
          // }, options);
        });

        $$('.btnSimpan').on('click', function () {
          
          var nama = $$('#nama').val();
          
          // validasi input
          if (nama === "") {
            app.dialog.alert("Masukkan nama perusahaan.","Profil Perusahaan");
            $$('.page-content').scrollTop($$('#nama').offset().top);
            //$$('#nama').focus();
            return;
          }

          var alamat = $$('alamat').val();
          var kota = $$('#kota').val();
          var kodepos = $$('#kodepos').val();
          var telepon = $$('#telepon').val();
          var fax = $$('#fax').val();
          var email = $$('#email').val();
          var npwp = $$('#npwp').val();

          var db = app.data.db;
          
          // app.dialog.alert(nama, 'Profil Perusahaan');

          if (db) {
            db.transaction(function(tx) {
              tx.executeSql('update setup set nama = ?, alamat = ?, kota = ?, kodepos = ?, ' +
              'telepon = ?, fax = ?, email = ?, npwp = ?;',
              [nama, alamat, kota, kodepos, telepon, fax, email, npwp]);
            }, function(error) {
              app.dialog.alert('insert error: ' + error.message);
            });      
          }
          
        });
      }
    }
  },
  {
    path: '/notifications/',
    componentUrl: './pages/notifications.html',
  },
  {
    path: '/wish-list/',
    componentUrl: './pages/wish-list.html',
  },
  {
    path: '/category/:kode/:nama',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode golongan
      var kode = routeTo.params.kode;
      var nama = routeTo.params.nama;

      // var db = app.data.db;
      var data = null;
      
      // app.request.get("http://localhost/askitchenweb/api/v1/category/sample/"+kode, function(res) {
      app.request.get("https://askitchen.com/api/v1/category/sample/"+kode, function(res) {
          
        var data = JSON.parse(res);

        resolve(
          { componentUrl: './pages/category.html' },
          { context: { data: data.data, title: nama } }
        );
        app.preloader.hide();
      });
    },
    on: {
      pageBeforeIn: function (event, page) {
        
        if (app.data.total_items > 0)
          $$('.badge').text(app.data.total_items);
      }
    }
  },
  {
    path: '/subcategory/:kode/:nama',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode golongan
      var kode = routeTo.params.kode;
      var nama = routeTo.params.nama;
      // console.log('kode: '+kode)

      // var db = app.data.db;
      var data = null;
      
      // app.request.get("http://localhost/askitchenweb/api/v1/subcategory/sample/"+kode, function(res) {
      app.request.get("https://askitchen.com/api/v1/subcategory/sample/"+kode, function(res) {
        
        var data = JSON.parse(res);
        // console.log(data)

        resolve(
          { componentUrl: './pages/subcategory.html' },
          { context: { data: data.data, title: nama } }
        );
        app.preloader.hide();
      });
    },
    on: {
      pageBeforeIn: function (event, page) {
        
        if (app.data.total_items > 0)
          $$('.badge').text(app.data.total_items);
      }
    }
  },
  {
    path: '/product/:kode/:nama',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode golongan
      var kode = routeTo.params.kode;
      var nama = routeTo.params.nama;

      // var db = app.data.db;
      var data = null;
      
      app.request.getJSON("http://localhost/askitchenweb/api/v1/products/"+kode, function(res) {
      // app.request.getJSON("https://askitchen.com/api/v1/products/"+kode, function(res) {
          
        // console.log('products:'+res)

        resolve(
          { componentUrl: './pages/product.html' },
          { context: { data: res.data, title: nama } }
        );
        app.preloader.hide();
      });
    },
  },
  {
    path: '/detail/:kode',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode item
      var kode = routeTo.params.kode;
      // var nama = routeTo.params.nama;

      // var db = app.data.db;
      var data = null;
      
      app.request.getJSON("http://localhost/askitchenweb/api/v1/items/"+kode, function(res) {
      // app.request.getJSON("https://askitchen.com/api/v1/items/"+kode, function(res) {
        
        console.log('detail:'+res.data.kdbar)
        app.preloader.hide();

        resolve(
          { componentUrl: './pages/detail.html' },
          { context: { data: res.data } } //, hjual: res.data.hjualf, stok: res.data.stok, title: res.data.nama
        );
      });
    },
    on: {
      pageBeforeIn: function (event, page) {
        
        app.request.get("http://localhost/askitchenweb/api/v1/cart/total_items", function(res) {
          
          var data = JSON.parse(res);
          
          if (data.status)
          {
            app.data.total_items = data.totqty;
            $$('.badge').text(app.data.total_items);
          }
        });
        
        // if (app.data.total_items > 0)
        //   $$('.badge').text(app.data.total_items);
      }
    }
  },
  {
    path: '/checkout/',
    // componentUrl: './pages/checkout.html',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      if (!app.data.bLogedIn) {
        
        app.data.lastURL = '/checkout/';

        app.router.navigate('/login/', {
          reloadCurrent: true,
          ignoreCache: true,
        });
      }

      // Show Preloader
      app.preloader.show();
        
      app.request.get("http://localhost/askitchenweb/api/v1/cart", function(res) {
      // app.request.get("https://askitchen.com/api/v1/cart", function(res) {
          
        var data = JSON.parse(res);
        // console.log(res)
        app.data.total  = data.total;
        app.data.gtotal = data.total;

        resolve (
          { componentUrl: './pages/checkout.html' },
          { context: { data: data.data } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/histori/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
        
      if (!app.data.currentDate) {
      
        var now = new Date();
        
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        
        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
        app.data.currentDate = today;
      }
        
      // console.log('app.data.currentDate: ',app.data.currentDate);
      
      var formData = [];

      formData.tgltrx = app.data.currentDate;
      formData.Authorization = app.data.token;
      
      // app.request.post("http://localhost/askitchenweb/api/v1/member/histori", formData, function(res) {
      app.request.post("https://askitchen.com/api/v1/member/histori", formData, function(res) {
          
        var data = JSON.parse(res);

        resolve (
          { componentUrl: './pages/histori.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      });
    },
    
    on: {
      pageInit: function (event, page) {
        
        // console.log('#tgltrx_val: ', $$('#tgltrx').val());
        $$('#tgltrx').val(app.data.currentDate);
      
        $$('#tgltrx').on('change', function(e){

          app.data.currentDate = $$('#tgltrx').val();
          app.router.navigate('/histori/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
      },
      pageAfterOut: function (event, page) {
      
        app.data.currentDate = null;
      }
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
