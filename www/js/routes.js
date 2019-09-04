routes = [
  {
    path: '/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      app.request.getJSON( app.data.endpoint + 'dashboard', function(res) {

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
              banner: res.banner,
              data: res.categories,
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
        
          var phone = $$('input [name="phone"]').val();
          if (phone == '') {
              app.dialog.alert('Masukkan nomor handphone anda.', 'Daftar');
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
          
          app.request.post( app.data.endpoint + 'register', formData, function (res) {
            
            app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              
              // simpan data nomor handphone
              localStorage.setItem('email', email);
              // localStorage.setItem('phone', phone);
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
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;
      
      if (app.data.total_items == 0) {
        app.dialog.alert('Keranjang belanja anda masih kosong!');
        reject();
        return;
      }

      if (!app.data.bLogedIn) {
        
        app.data.lastURL = app.views.main.router.url;

        resolve(
          {
            componentUrl: './pages/login.html',
          }
        );
        return;
      }

      // Show Preloader
      app.preloader.show();

      app.request.get( app.data.endpoint + 'cart', function(res) {

        // Hide Preloader
        app.preloader.hide();

        // console.log(res)
        var data = JSON.parse(res)
        
        app.data.total  = data.total;
        app.data.gtotal = data.total;
        // $$('#spangt').text(app.data.gtotal.toLocaleString());

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
    path: '/settings/',
    url: './pages/settings.html',
  },
  {
    path: '/profile/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // console.log('bLogedIn: '+app.data.bLogedIn)
      if (!app.data.bLogedIn) {
        
        app.data.lastURL = '/profile/';

        resolve(
          {
            componentUrl: './pages/login.html',
          }
        );
        return;
      }

      // Show Preloader
      app.preloader.show();
        
      app.request.getJSON( app.data.endpoint + 'member/'+app.data.mbrid, function(res) {
          
        // var data = JSON.parse(res);

        resolve (
          { componentUrl: './pages/profile.html' },
          { context: { data: res } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/chat/',
    componentUrl: './pages/chat.html',
  },
  {
    path: '/notifications/',
    componentUrl: './pages/notifications.html',
  },
  // {
  //   path: '/wish-list/',
  //   componentUrl: './pages/wish-list.html',
  // },
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

      app.request.get( app.data.endpoint + 'categories/sample/'+kode, function(res) {
          
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
        
        if (app.data.total_items > 0) {
          $$('.badge').text(app.data.total_items);
          $$('.badge').css("display", "block");
        } else {
          $$('.badge').css("display", "none");
        }
      }
    }
  },
  {
    path: '/product/:kode/:page',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode golongan
      var kode = routeTo.params.kode;
      // var nama = routeTo.params.nama;
      var page = routeTo.params.page;
      var next_page = parseInt(routeTo.params.page)+1;

      app.request.getJSON( app.data.endpoint + 'products/'+kode+'?p='+page, function(res) {

        // total rows
        var total = res.total;
        
        // var url = '/product/' + kode + '/' + nama + '/'
        
        var total_page = Math.ceil(total/10)
        var pages = [];

        for (var i=0; i < total_page; i++)
          pages.push({page : i+1, kode: kode, nama: res.title})
        
        resolve(
          { componentUrl: './pages/product.html' },
          { context: { data: res.data, title: res.title, pages: pages, total: total, total_page: total_page, curr_page: page, next_page: next_page, kode: kode } }
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
      
      app.request.getJSON( app.data.endpoint + 'items/'+kode, function(res) {
        
        app.preloader.hide();

        resolve(
          { componentUrl: './pages/detail.html' },
          { context: { data: res.data } }
        );
      });
    },
  },
  {
    path: '/checkout/',
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
        
      app.request.get( app.data.endpoint + 'cart', function(res) {
          
        var data = JSON.parse(res);

        resolve (
          { componentUrl: './pages/checkout.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/about-us/',
    url: './pages/about-us.html',
  },
  {
    path: '/term/',
    url: './pages/term.html',
  },
  {
    path: '/faq/',
    url: './pages/faq.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
