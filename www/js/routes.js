routes = [
  {
    path: '/',
    url: './index.html',
    on: {
      pageBeforeIn: function (event, page) {
        
        if (app.data.total_items > 0)
          $$('.badge').text(app.data.total_items);

          // app.request.get('http://localhost/abc/member/saldo/'+ app.data.mbrid, function (res) {
          
          //   var data = JSON.parse(res);
        
          //   if (data.status) {
          //     $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
          //     app.data.saldo = parseInt(data.saldo);
          //     $$('.bonus').text(parseInt(data.bonus).toLocaleString('ID'));
          //     app.data.bonus = parseInt(data.bonus);
          //   } else {
          //     app.dialog.alert(data.message, 'ABC');
          //   }
          // });
      },
      pageInit: function (event, page) {
        
        app.request.get("http://localhost/askitchenweb/api/v1/cart/total_items", function(res) {
          
          var data = JSON.parse(res);
          
          if (data.status)
          {
            app.data.total_items = data.totqty;
            $$('.badge').text(app.data.total_items);
          }
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
        $$('#nama').val('CV. ELANG PERKASA');

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
    path: '/stock/',
    url: './pages/stock.html',
    on: {
      pageInit: function (event, page) {

        $$('.barcode').on('click', function(e){

          cordova.plugins.barcodeScanner.scan(
            function (result) {
                $$('#barcode').val(result.text);
                // alert("We got a barcode\n" +
                      // "Result: " + result.text + "\n" +
                      // "Format: " + result.format + "\n" +
                      // "Cancelled: " + result.cancelled);
            },
            function (error) {
                app.dialog.alert("Scanning failed: " + error);
            },
            {
                preferFrontCamera : false, // iOS and Android
                showFlipCameraButton : false, // iOS and Android
                showTorchButton : true, // iOS and Android
                torchOn: true, // Android, launch with the torch switched on (if available)
                saveHistory: false, // Android, save scan history (default false)
                prompt : "Place a barcode inside the scan area", // Android
                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                formats : "EAN_13,CODE_128,QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations : true, // iOS
                disableSuccessBeep: false // iOS and Android
            }
          );
        });
        
        $$('#awal').on('blur', function(e){
          var awal = parseFloat($$('#awal').val());
          $$('#saldo').val(awal)
        });
      
        $$('#mstock').on('change', function(e){
          //e.preventDefault();
          if ($$(this).prop('checked')){
            $$('#awal').prop('disabled', false);
          } else {
            $$('#awal').prop('disabled', true);
            $$('#awal').val('0');
          }
        });
      
        $$('.btnSimpan').on('click', function(e){
          //e.preventDefault();
          
          var nama = $$('#nama').val();
          if (nama === '') {
            app.dialog.alert('Masukkan data nama barang.', 'Item Barang');
            return;
          }
          
          var barcode = $$('#barcode').val();
          if (barcode === '') {
            app.dialog.alert('Masukkan data kode barang.', 'Item Barang');
            return;
          }
          
          var satuan = $$('#satuan').val();
          if (satuan === '') {
            app.dialog.alert('Masukkan data satuan.', 'Item Barang');
            return;
          }
          
          var mstock = 'Y';
          if ($$('#mstock').prop('checked')){
            mstock = 'M';
          }
          
          var awal = parseFloat($$('#awal').val());
          // if (awal === 0) {
          //   app.dialog.alert('Masukkan data saldo awal barang.', 'Item Barang');
          //   return;
          // }
          
          var hpokok = parseFloat($$('#hpokok').val());
          if (hpokok === 0) {
            app.dialog.alert('Masukkan data harga pokok.', 'Item Barang');
            return;
          }
          
          var hjual = parseFloat($$('#hjual').val());
          if (hjual === 0) {
            app.dialog.alert('Masukkan data harga jual.', 'Item Barang');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);
          
          var db = app.data.db;
          
          if (db) {

            db.transaction(function(tx) {
              tx.executeSql('insert into stock (kdbar, nama, satuan, hbeli, hpokok, hpokok2, hjual, stawal, saldo, mstock) ' +
              'values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [barcode, nama, satuan, hpokok, hpokok, hpokok, hjual, awal, awal, mstock]);
            }, function(error) {
              app.dialog.alert('insert error: ' + error.message);
            });
          }

          /*var formData = app.form.convertToData('.stock');
          formData.Authorization = app.data.token;
          
          app.request.post('http://localhost/askitchenweb/api/v1/pulsa', formData, function (res) {
            
            // app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Pulsa HP');
              }
            }
          });*/
        });            
      
        if ( AdMob ) {
          AdMob.hideBanner();
        }
      },
      pageAfterOut: function (event, page) {
      
        if ( AdMob ) {
          AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        }
      }
    }
  },
  {
    path: '/stock/:kode/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode barang
      var kode = routeTo.params.kode;

      var db = app.data.db;
      var data = null;
      
      if (db) {
        db.transaction(function(tx) {
          tx.executeSql('select kdbar, nama, satuan, hbeli, hpokok, hpokok2, hjual, stawal, saldo, mstock from stock where kdbar = ?;', [kode], function(ignored, res) {

            data = { kdbar: res.rows.item(0).kdbar,
                        nama: res.rows.item(0).nama,
                        satuan: res.rows.item(0).satuan,
                        hbeli: res.rows.item(0).hbeli,
                        hpokok: res.rows.item(0).hpokok,
                        hpokok2: res.rows.item(0).hpokok2,
                        hjual: res.rows.item(0).hjual,
                        stawal: res.rows.item(0).stawal,
                        saldo: res.rows.item(0).saldo,
                        mstock: res.rows.item(0).mstock };
          });
        }, function(error) {
          app.dialog.alert('select error: ' + error.message);
        });
      }

      resolve(
        { componentUrl: './pages/stock2.html' },
        { context: { data: data } }
      );
      app.preloader.hide();
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
      
      // app.request.get("http://localhost/askitchenweb/api/v1/products/"+kode, function(res) {
      app.request.get("https://askitchen.com/api/v1/products/"+kode, function(res) {
          
        var data = JSON.parse(res);
        // console.log('products:'+res)

        resolve(
          { componentUrl: './pages/product.html' },
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
    path: '/detail/:kode/:nama',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode item
      var kode = routeTo.params.kode;
      var nama = routeTo.params.nama;
      // console.log('kode:'+kode)
      // console.log('nama:'+nama)

      // var db = app.data.db;
      var data = null;
      
      app.request.get("http://localhost/askitchenweb/api/v1/items/"+kode, function(res) {
      // app.request.get("https://askitchen.com/api/v1/items/"+kode, function(res) {
        
        var data = JSON.parse(res);
        console.log('detail:'+res)

        resolve(
          { componentUrl: './pages/detail.html' },
          { context: { data: data.data, hjual: data.hjualf, stok: data.stok, title: nama } }
        );
        app.preloader.hide();
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
        
        // var tglval = $$('#tgltrx').val();
        
        // if (tglval == '') {
          // $$('#tgltrx').val(app.data.currentDate);
          // var now = new Date();
          
          // var day = ("0" + now.getDate()).slice(-2);
          // var month = ("0" + (now.getMonth() + 1)).slice(-2);
          
          // var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
          
          // $$('#tgltrx').val(today);
        // }
      
        $$('#tgltrx').on('change', function(e){

          app.data.currentDate = $$('#tgltrx').val();
          app.router.navigate('/histori/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
        // if ( AdMob ) {
          // AdMob.hideBanner();
        // }
      },
      pageAfterOut: function (event, page) {
      
        app.data.currentDate = null;

        // if ( AdMob ) {
          // AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        // }
      }
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
