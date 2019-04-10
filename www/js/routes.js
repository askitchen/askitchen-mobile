routes = [
  {
    path: '/',
    url: './index.html',
    on: {
      pageBeforeIn: function (event, page) {
        
        $$('.gtotal').text(app.data.gtotal.toLocaleString('ID'));
        
        var virtualList = app.virtualList.create({
          // List Element
          el: '.virtual-list',
          // Pass array with items
          items: items,
          // Custom search function for searchbar
          searchAll: function (query, items) {
            var found = [];
            for (var i = 0; i < items.length; i++) {
              if (items[i].nama.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
            }
            return found; //return array with mathced indexes
          },
          // List item Template7 template
          itemTemplate:
            '<li><input type="hidden" value="{{kdbar}}">' +
              '<a href="#" class="item-link item-content item-basket">' +
                '<div class="item-media"><img class="material-icons" src="img/stock.png" /></div>' +
                '<div class="item-inner">' +
                  '<div class="item-title-row">' +
                    '<div class="item-title">{{nama}}</div>' +
                  '</div>' +
                  //'<div class="item-subtitle">{{subtitle}}</div>' +
                '</div>' +
                '<div class="item-after">Rp {{hjual.toLocaleString("ID")}}<br>{{saldo}} {{satuan}}</div>' +
              '</a>' +
            '</li>',
          // Item height
          //height: app.theme === 'ios' ? 63 : 73,
        });

        $$('.item-basket').on('click', function () {
          var li = $$(this).parents("li");
          var kode = li.find('input').val();
          // console.log(kode)
          app.methods.addSalesItem(kode)
        });
        
        // call ajax request to update
        // setTimeout(function () {

          // // http://localhost/
          // app.request.get('http://localhost/askitchenweb/api/v1/member/saldo/'+ app.data.mbrid, function (res) {
          
            // var data = JSON.parse(res);
        
            // if (data.status) {
              // $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
              // app.data.saldo = parseInt(data.saldo);
              // app.data.bonus = parseInt(data.bonus);
            // } else {
              // app.dialog.alert(data.message, 'Redagro');
            // }
          // });
        // }, 11000);
      }
    }
        
  },
  {
    path: '/cart/',
    componentUrl: './pages/cart.html',
  },
  {
    path: '/diskon-item/:kode/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode barang
      var kdbar = routeTo.params.kode;
      var hjual = 0;
      var disc = 0;
      var discrp = 0;

      // cari kode barang
      for(var i=0; i < details.length; i++) {

        if(details[i].kdbar == kdbar)
        {
          hjual = details[i].hjual;
          disc = details[i].disc;
          discrp = details[i].discrp;
        }
      }

      resolve(
        { componentUrl: './pages/diskon.html' },
        { context: { 
          kdbar: kdbar,
          hjual: hjual,
          disc: disc,
          discrp: discrp } }
      );
      app.preloader.hide();
    }
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
    path: '/group/',
    url: './pages/group.html',
    on: {
      pageInit: function (event, page) {
      
        $$('.btnSimpan').on('click', function(e){
          //e.preventDefault();
          
          var nama = $$('#nama').val();
          if (nama === '') {
              app.dialog.alert('Masukkan data nama grup.', 'Grup');
              return;
          }
          // app.preloader.show();
          $$(this).prop("disabled", true);
        
          var db = app.data.db;
      
          if (db) {
            
            db.transaction(function(tx) {
              tx.executeSql('SELECT nama FROM grup WHERE nama = ?', [nama], function(ignored, res) {
                //app.dialog.alert('RECORD COUNT: ' + res.rows.item(0).recordCount);

                if (res.rows.length > 0) {
                  app.dialog.alert('Nama grup item sudah ada.', 'Grup');
                  return;
                }
          
                db.transaction(function(tx) {
                  tx.executeSql('insert into grup (nama) values (?);', [nama]);
                  app.router.back();
                }, function(error) {
                  app.dialog.alert('insert error: ' + error.message);
                });

              });
            }, function(error) {
              app.dialog.alert('SELECT data error: ' + error.message);
            });      
          
          }
          
          /*var formData = app.form.convertToData('.grup');
          formData.Authorization = app.data.token;
          
          app.request.post('http://localhost/askitchenweb/api/v1/group', formData, function (res) {
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Group');
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
    path: '/supplier-list/',
    componentUrl: './pages/supplier-list.html',
  },
  {
    path: '/supplier/',
    url: './pages/supplier.html',
    on: {
      pageInit: function (event, page) {
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#nama').val(contact.name.givenName);
              $$('#telepon').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              $$('#email').val(contact.emails[0].value);
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
          });
        });
        
        $$('#awal').on('blur', function(e){
          var awal = parseFloat($$('#awal').val());
          $$('#saldo').val(awal)
        });
      
        $$('.btnSimpan').on('click', function(e){
          //e.preventDefault();
          
          var nama = $$('#nama').val();
          if (nama === '') {
            app.dialog.alert('Masukkan data nama supplier.', 'Supplier');
            return;
          }

          var awal = parseFloat($$('#awal').val());

          var alamat = $$('#alamat').val();
          var telepon = $$('#telepon').val();
          var email = $$('#email').val();
          var notes = $$('#notes').val();
          
          // app.preloader.show();
          $$(this).prop("disabled", true);
          
          var db = app.data.db;
          
          if (db) {

            db.transaction(function(tx) {
              tx.executeSql('insert into supplier (nama, alamat, telepon, email, awal, saldo, notes) ' +
              'values (?, ?, ?, ?, ?, ?, ?);', [nama, alamat, telepon, email, awal, awal, notes]);
            }, function(error) {
              app.dialog.alert('insert error: ' + error.message);
            });
          }
          
          /*var formData = app.form.convertToData('.trxdata');
          formData.Authorization = app.data.token;
          
          app.request.post('http://localhost/askitchenweb/api/v1/data', formData, function (res) {
            
            // app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Paket Data');
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
    path: '/supplier/:kode',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode supplier
      var kode = routeTo.params.kode;

      var db = app.data.db;
      var data = null;
      
      if (db) {
        db.transaction(function(tx) {
          tx.executeSql('select kdsup, nama, alamat, telepon, email, awal, saldo, notes from supplier where kdsup = ?;', [kode], function(ignored, res) {

            data = { kdsup: res.rows.item(0).kdsup,
                        nama: res.rows.item(0).nama,
                        alamat: res.rows.item(0).alamat,
                        telepon: res.rows.item(0).telepon,
                        email: res.rows.item(0).email,
                        awal: res.rows.item(0).awal,
                        saldo: res.rows.item(0).saldo,
                        notes: res.rows.item(0).notes };
          });
        }, function(error) {
          app.dialog.alert('select error: ' + error.message);
        });
      }

      resolve(
        { componentUrl: './pages/supplier2.html' },
        { context: { data: data } }
      );
      app.preloader.hide();
    }
  },
  {
    path: '/void-jual/',
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
        
      // var formData = [];

      // formData.tgltrx = app.data.currentDate;
      // formData.Authorization = app.data.token;
      
      // app.request.post("http://localhost/askitchenweb/api/v1/void-jual", formData, function(res) {
          
      //   var data = JSON.parse(res);

        resolve(
          { componentUrl: './pages/void-jual.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      // });
    },
    
    on: {
      pageInit: function (event, page) {
        
        $$('#tglinput').val(app.data.currentDate);
      
        // $$('#tglinput').on('change', function(e){

        //   app.data.currentDate = $$('#tglinput').val();
        //   app.router.navigate('/histori/', {
        //     reloadCurrent: true,
        //     ignoreCache: true,
        //   });
        // });
      
        if ( AdMob ) {
          AdMob.hideBanner();
        }
      },
      pageAfterOut: function (event, page) {
      
        app.data.currentDate = null;

        if ( AdMob ) {
          AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        }
      }
    },
  },
  {
    path: '/beli/',
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
        console.log(app.data.currentDate)
      }
      
      var db = app.data.db;
      var supplier = //[];
      [
        {
           "kdsup": "AJC",
           "nama": "ABADI JAYA CAMILAN"
        },
        {
           "kdsup": "AS",
           "nama": "AGUNG SMS"
        },
        {
           "kdsup": "AM",
           "nama": "AMBAR BIR"
        },
        {
           "kdsup": "AR",
           "nama": "ARIZONA KARYA MITRA"
        },
        {
           "kdsup": "AB",
           "nama": "ARTA BOGA CEMERLANG"
        }
     ];
      
      if (db) {
        db.transaction(function(tx) {
          tx.executeSql('select kdsup, nama from supplier order by nama;', [kode], function(ignored, res) {

            for (var i = 0; i < res.rows.length; i++) {
              supplier.push({ kode: res.rows.item(i).kdsup,
                        nama: res.rows.item(i).nama });
            }
            
          });
        }, function(error) {
          app.dialog.alert('select error: ' + error.message);
        });
      }
        
      // console.log('app.data.currentDate: ',app.data.currentDate);
      
      // var formData = [];

      // formData.tgltrx = app.data.currentDate;
      // formData.Authorization = app.data.token;
      
      // app.request.post("http://localhost/askitchenweb/api/v1/beli", formData, function(res) {
          
      var data = { supplier: supplier }; //JSON.parse(res);

        resolve(
          { componentUrl: './pages/beli.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      // });
    },
    
    on: {
      pageBeforeIn: function (event, page) {
        
        $$('#total').val(app.data.total);
        var disc = parseFloat($$('#disc').val());
        var discrp = disc / 100 * app.data.total;
        $$('#discrp').val(discrp);
        var gtotal = app.data.total - discrp;
        $$('#gtotal').val(gtotal);

        if (!app.data.currentDate) {
        
          var now = new Date();
          
          var day = ("0" + now.getDate()).slice(-2);
          var month = ("0" + (now.getMonth() + 1)).slice(-2);
          
          var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
          app.data.currentDate = today;
        }
      },  
      pageInit: function (event, page) {
        
        // console.log('#tgltrx_val: ', $$('#tgltrx').val());
        $$('#tglinput').val(app.data.currentDate);
        $$('#tgljto').val(app.data.currentDate);
      
        // $$('#tglinput').on('change', function(e){

        //   app.data.currentDate = $$('#tglinput').val();
        //   app.router.navigate('/histori/', {
        //     reloadCurrent: true,
        //     ignoreCache: true,
        //   });
        // });

        $$('#tunai').on('change', function(e){
          //e.preventDefault();
          if ($$(this).prop('checked')){
            $$('#tgljto').prop('disabled', true);
            $$('#tgljto').val(app.data.currentDate);
          } else {
            $$('#tgljto').prop('disabled', false);
            $$('#tgljto').val(app.data.currentDate);
          }
        });
      
        $$('.batal').on('click', function(e){

          app.dialog.confirm('Yakin ingin membatalkan transaksi?', function () {
            details = [];
            app.methods.calcPTotal();
            mainView.router.back();
          },  function () {
            //
          });
        });
        
        $$('#disc').on('blur', function(e){
          var disc = parseFloat($$('#disc').val());
          var discrp = disc / 100 * app.data.total;
          $$('#discrp').val(discrp);
          var gtotal = app.data.total - discrp;
          $$('#gtotal').val(gtotal);
        });
        
        $$('#discrp').on('blur', function(e){
          var discrp = parseFloat($$('#discrp').val());
          var disc = discrp * 100 / app.data.total;
          $$('#disc').val(disc);
          var gtotal = app.data.total - discrp;
          $$('#gtotal').val(gtotal);
        });

        $$('.btnSimpan').on('click', function(e){
          //e.preventDefault();
          
          var nofak = $$('#nofak').val();
          if (nofak === '') {
            app.dialog.alert('Masukkan data nomor faktur pembelian.', 'Input Pembelian');
            return;
          }
          
          var tglfak = $$('#tglfak').val();
          var tgljto = $$('#tgljto').val();
          
          var kdsup = $$('#kdsup').val();
          var bTunai = $$('#tunai').prop('checked');

          var total = parseFloat($$('#total').val());
          if (total === 0) {
            app.dialog.alert('Masukkan detail barang.', 'Input Pembelian');
            return;
          }
          var disc = parseFloat($$('#disc').val());
          var discrp = parseFloat($$('#discrp').val());
          var gtotal = parseFloat($$('#gtotal').val());

          var tgllunas = null;
          var cash = 'N';
          var saldo = gtotal;

          if (bTunai) {
            tgllunas = tglfak;
            saldo = 0;
            cash = 'Y';
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);
          
          var db = app.data.db;
          
          if (db) {

            db.transaction(function(tx) {

              tx.executeSql('insert into beli (nofak, tglfak, kdsup, tgljto, total, disc, discrp, gtotal, tgllunas, saldo, cash) ' +
              'values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [nofak, tglfak, kdsup, tgljto, total, disc, discrp, gtotal, tgllunas, saldo, cash]);

              if (!bTunai) {
                // update saldo hutang
                tx.executeSql('update supplier set saldo = saldo + ? where kdsup = ?;', [details[i].qty, details[i].hbeli, details[i].hpokok2, details[i].kdbar]);
              }
              
              for (var i = 0; i < details.length; i++) {
                
                // update jumlah perssediaan
                tx.executeSql('update stock set saldo = saldo + ?, hbeli = ROUND(?,2), ' +
                  'hpokok2 = ROUND(?,2), used = "Y" where kdbar = ?;', [details[i].qty, details[i].hbeli, details[i].hpokok2, details[i].kdbar]);

                // simpan detail transaksi
                tx.executeSql('insert into dtrans (nofak, tglfak, tgl_t, jenis, urut, kdbar, qty, satuan, hpokok, harga, disc, discrp, net, jumlah, ket) ' +
                  'values (?, ?, :tgl_t, :kduser, :jenis, :urut, :kdbar, :qty, ' +
                  ':satuan, :hpokok, :harga, :disc, :discrp, :net, :jumlah, :ket);',
                  [nofak, tglfak, tglfak, 'BELI', i+1, details[i].kdbar, details[i].qty, details[i].satuan, details[i].hpokok2, details[i].hjual,
                  details[i].disc, details[i].discrp, details[i].net, details[i].jumlah, 'Pembelian']);
                    
              }
            }, function(error) {
              app.dialog.alert('insert error: ' + error.message);
            });
          }

          /*var formData = app.form.convertToData('.stock');
          formData.Authorization = app.data.token;
          
          app.request.post('http://localhost/dagang/pulsa', formData, function (res) {
            
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
      
        app.data.currentDate = null;

        if ( AdMob ) {
          AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        }
      }
    },
  },
  {
    path: '/item-beli/',
    componentUrl: './pages/item-beli.html',
  },
  {
    path: '/cart-beli/',
    componentUrl: './pages/cart-beli.html',
  },
  {
    path: '/bayar-supp/',
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
        
      // var formData = [];

      // formData.tgltrx = app.data.currentDate;
      // formData.Authorization = app.data.token;
      
      // app.request.post("http://localhost/askitchenweb/api/v1/bayar-supp", formData, function(res) {
          
      //   var data = JSON.parse(res);

        resolve(
          { componentUrl: './pages/bayar-supp.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      // });
    },
    
    on: {
      pageInit: function (event, page) {
        
        $$('#tgltrx').val(app.data.currentDate);
      
        $$('#tgltrx').on('change', function(e){

          app.data.currentDate = $$('#tgltrx').val();
          app.router.navigate('/histori/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });

        $$('.item-basket').on('click', function () {
          var li = $$(this).parents("li");
          var kode = li.find('input').val();
          // console.log(kode)
          app.methods.addPurchaseItem(kode)
        });
      
        if ( AdMob ) {
          AdMob.hideBanner();
        }
      },
      pageAfterOut: function (event, page) {
      
        app.data.currentDate = null;

        if ( AdMob ) {
          AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        }
      }
    },
  },
  {
    path: '/retur-beli/',
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
        
      // var formData = [];

      // formData.tgltrx = app.data.currentDate;
      // formData.Authorization = app.data.token;
      
      // app.request.post("http://localhost/askitchenweb/api/v1/retur-beli", formData, function(res) {
          
      //   var data = JSON.parse(res);

        resolve(
          { componentUrl: './pages/retur-beli.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      // });
    },
    
    on: {
      pageInit: function (event, page) {
        
        $$('#tgltrx').val(app.data.currentDate);
      
        $$('#tgltrx').on('change', function(e){

          app.data.currentDate = $$('#tgltrx').val();
          app.router.navigate('/histori/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
        if ( AdMob ) {
          AdMob.hideBanner();
        }
      },
      pageAfterOut: function (event, page) {
      
        app.data.currentDate = null;

        if ( AdMob ) {
          AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        }
      }
    },
  },
  {
    path: '/adjustment/',
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
      
      // var formData = [];

      // formData.tgltrx = app.data.currentDate;
      // formData.Authorization = app.data.token;
      
      // app.request.post("http://localhost/askitchenweb/api/v1/adjustment", formData, function(res) {
          
      //   var data = JSON.parse(res);

        resolve(
          { componentUrl: './pages/adjustment.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      // });
    },
    
    on: {
      pageInit: function (event, page) {
        
        $$('#tgltrx').val(app.data.currentDate);
        
        $$('#tgltrx').on('change', function(e){

          app.data.currentDate = $$('#tgltrx').val();
          app.router.navigate('/histori/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
        if ( AdMob ) {
          AdMob.hideBanner();
        }
      },
      pageAfterOut: function (event, page) {
      
        app.data.currentDate = null;

        if ( AdMob ) {
          AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        }
      }
    },
  },
  {
    path: '/saldo-hutang/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
        
      // var formData = [];

      // formData.Authorization = app.data.token;
      
      // app.request.post("http://localhost/askitchenweb/api/v1/adjustment", formData, function(res) {
          
        var db = app.data.db;
        var supplier = [];
        var total = 0;
        
        if (db) {
          db.transaction(function(tx) {
            tx.executeSql('select nama, saldo from supplier where saldo > 1 order by nama;', [], function(ignored, res) {
  
              for (var i = 0; i < res.rows.length; i++) {
                supplier.push({ nama: res.rows.item(i).nama,
                                saldo: res.rows.item(i).saldo.toLocaleString('ID') });
                total += res.rows.item(i).saldo;
              }
              
            });
          }, function(error) {
            app.dialog.alert('select error: ' + error.message);
          });
        }

        var data = {
          supplier: supplier,
          total: total
        };

        resolve(
          { componentUrl: './pages/saldo-hutang.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      // });
    },
    on: {
      pageInit: function (event, page) {
      
      }
    }
  },
  {
    path: '/lap-jual/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
        
      if (!app.data.tglAwal) {
      
        var now = new Date();
        
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        
        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
        app.data.tglAwal  = today;
        app.data.tglAkhir = today;
      }
        
      // var formData = [];

      // formData.Authorization = app.data.token;
      
      // app.request.post("http://localhost/askitchenweb/api/v1/adjustment", formData, function(res) {
          
        var db = app.data.db;
        var data = [];
        var total = 0;
        var discrp = 0;
        var gtotal = 0;
        
        if (db) {
          db.transaction(function(tx) {
            tx.executeSql('select nofak, tglfak, total, disc, discrp, gtotal from jual ' +
              'where tglfak between ? and ? order by tglfak, nofak;', [app.data.tglAwal, app.data.tglAkhir], function(ignored, res) {
  
              for (var i = 0; i < res.rows.length; i++) {
                data.push({ nofak: res.rows.item(i).nofak,
                            tglfak: res.rows.item(i).tglfak,
                            total: res.rows.item(i).total,
                            disc: res.rows.item(i).disc,
                            discrp: res.rows.item(i).discrp,
                            gtotal: res.rows.item(i).gtotal
                          });
                total += res.rows.item(i).total;
                discrp += res.rows.item(i).discrp;
                gtotal += res.rows.item(i).gtotal;
              }
              
            });
          }, function(error) {
            app.dialog.alert('select error: ' + error.message);
          });
        }

        resolve(
          { componentUrl: './pages/lap-jual.html' },
          { context: { data: data, total: total, discrp: discrp, gtotal: gtotal } }
        );
        app.preloader.hide();
      // });
    },
    on: {
      pageInit: function (event, page) {
        
        $$('#tgl1').val(app.data.tglAwal);
        $$('#tgl2').val(app.data.tglAkhir);
      
        $$('#tgl1').on('change', function(e){

          app.data.tglAwal = $$('#tgl1').val();
          app.router.navigate('/lap-jual/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
        $$('#tgl2').on('change', function(e){

          app.data.tglAkhir = $$('#tgl2').val();
          app.router.navigate('/lap-jual/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
      },
      pageAfterOut: function (event, page) {
      
        app.data.tglAwal  = null;
        app.data.tglAkhir = null;

        if ( AdMob ) {
          AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        }
      }
    }
  },
  {
    path: '/lap-voidjual/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
        
      if (!app.data.tglAwal) {
      
        var now = new Date();
        
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        
        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
        app.data.tglAwal  = today;
        app.data.tglAkhir = today;
      }
        
      // var formData = [];

      // formData.Authorization = app.data.token;
      
      // app.request.post("http://localhost/askitchenweb/api/v1/adjustment", formData, function(res) {
          
        var db = app.data.db;
        var data = [];
        var total = 0;
        var discrp = 0;
        var gtotal = 0;
        
        if (db) {
          db.transaction(function(tx) {
            tx.executeSql('select tglret, noret, nofak, tglfak, total, disc, discrp, gtotal from voidjual ' +
              'where tglret between ? and ? order by tglret, noret;', [app.data.tglAwal, app.data.tglAkhir], function(ignored, res) {
  
              for (var i = 0; i < res.rows.length; i++) {
                data.push({ noret: res.rows.item(i).noret,
                            tglret: res.rows.item(i).tglret,
                            nofak: res.rows.item(i).nofak,
                            tglfak: res.rows.item(i).tglfak,
                            total: res.rows.item(i).total,
                            disc: res.rows.item(i).disc,
                            discrp: res.rows.item(i).discrp,
                            gtotal: res.rows.item(i).gtotal
                          });

              total += res.rows.item(i).total;
              discrp += res.rows.item(i).discrp;
              gtotal += res.rows.item(i).gtotal;
    }
              
            });
          }, function(error) {
            app.dialog.alert('select error: ' + error.message);
          });
        }

        resolve(
          { componentUrl: './pages/lap-voidjual.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      // });
    },
    on: {
      pageInit: function (event, page) {
        
        $$('#tgl1').val(app.data.tglAwal);
        $$('#tgl2').val(app.data.tglAkhir);
      
        $$('#tgl1').on('change', function(e){

          app.data.tglAwal = $$('#tgl1').val();
          app.router.navigate('/lap-voidjual/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
        $$('#tgl2').on('change', function(e){

          app.data.tglAkhir = $$('#tgl2').val();
          app.router.navigate('/lap-voidjual/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
      },
      pageAfterOut: function (event, page) {
      
        app.data.tglAwal  = null;
        app.data.tglAkhir = null;

        if ( AdMob ) {
          AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        }
      }
    }
  },
  {
    path: '/untung-jual/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
        
      if (!app.data.tglAwal) {
      
        var now = new Date();
        
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        
        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
        app.data.tglAwal  = today;
        app.data.tglAkhir = today;
      }
        
      // var formData = [];

      // formData.Authorization = app.data.token;
      
      // app.request.post("http://localhost/askitchenweb/api/v1/adjustment", formData, function(res) {
          
        var db = app.data.db;
        var data = [];
        var total = 0;
        var discrp = 0;
        var gtotal = 0;
        var profit = 0;
        
        if (db) {
          db.transaction(function(tx) {
            tx.executeSql('select nofak, tglfak, total, disc, discrp, gtotal from jual ' +
              'where tglfak between ? and ? order by tglfak, nofak;', [app.data.tglAwal, app.data.tglAkhir], function(ignored, res) {
  
              for (var i = 0; i < res.rows.length; i++) {
                data.push({ nofak: res.rows.item(i).nofak,
                            tglfak: res.rows.item(i).tglfak,
                            total: res.rows.item(i).total,
                            disc: res.rows.item(i).disc,
                            discrp: res.rows.item(i).discrp,
                            gtotal: res.rows.item(i).gtotal
                          });
                total += res.rows.item(i).total;
                discrp += res.rows.item(i).discrp;
                gtotal += res.rows.item(i).gtotal;
              }
              
            });
          }, function(error) {
            app.dialog.alert('select error: ' + error.message);
          });
        }

        resolve(
          { componentUrl: './pages/untung-jual.html' },
          { context: { data: data, total: total, discrp: discrp, gtotal: gtotal, profit: profit } }
        );
        app.preloader.hide();
      // });
    },
    on: {
      pageInit: function (event, page) {
        
        $$('#tgl1').val(app.data.tglAwal);
        $$('#tgl2').val(app.data.tglAkhir);
      
        $$('#tgl1').on('change', function(e){

          app.data.tglAwal = $$('#tgl1').val();
          app.router.navigate('/untung-jual/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
        $$('#tgl2').on('change', function(e){

          app.data.tglAkhir = $$('#tgl2').val();
          app.router.navigate('/untung-jual/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
      },
      pageAfterOut: function (event, page) {
      
        app.data.tglAwal  = null;
        app.data.tglAkhir = null;

        if ( AdMob ) {
          AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        }
      }
    }
  },
  {
    path: '/lap-beli/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
        
      if (!app.data.tglAwal) {
      
        var now = new Date();
        
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        
        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
        app.data.tglAwal  = today;
        app.data.tglAkhir = today;
      }
        
      // var formData = [];

      // formData.Authorization = app.data.token;
      
      // app.request.post("http://localhost/askitchenweb/api/v1/adjustment", formData, function(res) {
          
        var db = app.data.db;
        var data = [];
        var total = 0;
        var discrp = 0;
        var gtotal = 0;
        
        if (db) {
          db.transaction(function(tx) {
            tx.executeSql('select b.nofak, b.tglfak, s.nama, b.total, b.disc, b.discrp, b.gtotal from beli b, supplier s ' +
              'where b.kdsup = s.kdsup and b.tglfak between ? and ? order by tglfak, nofak;', [app.data.tglAwal, app.data.tglAkhir], function(ignored, res) {
  
              for (var i = 0; i < res.rows.length; i++) {
                data.push({ nofak: res.rows.item(i).nofak,
                  tglfak: res.rows.item(i).tglfak,
                  nama: res.rows.item(i).nama,
                  total: res.rows.item(i).total,
                  disc: res.rows.item(i).disc,
                  discrp: res.rows.item(i).discrp,
                  gtotal: res.rows.item(i).gtotal
                });

                total += res.rows.item(i).total;
                discrp += res.rows.item(i).discrp;
                gtotal += res.rows.item(i).gtotal;
              }
              
            });
          }, function(error) {
            app.dialog.alert('select error: ' + error.message);
          });
        }

        resolve(
          { componentUrl: './pages/lap-beli.html' },
          { context: { data: data, total: total, discrp: discrp, gtotal: gtotal } }
        );
        app.preloader.hide();
      // });
    },
    on: {
      pageInit: function (event, page) {
        
        $$('#tgl1').val(app.data.tglAwal);
        $$('#tgl2').val(app.data.tglAkhir);
      
        $$('#tgl1').on('change', function(e){

          app.data.tglAwal = $$('#tgl1').val();
          app.router.navigate('/lap-beli/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
        $$('#tgl2').on('change', function(e){

          app.data.tglAkhir = $$('#tgl2').val();
          app.router.navigate('/lap-beli/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
      },
      pageAfterOut: function (event, page) {
      
        app.data.tglAwal  = null;
        app.data.tglAkhir = null;

        if ( AdMob ) {
          AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        }
      }
    }
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
      
      app.request.get("http://localhost/askitchenweb/api/v1/category/sample/"+kode, function(res) {
          
        var data = JSON.parse(res);
        // console.log(data)

        resolve(
          { componentUrl: './pages/category.html' },
          { context: { data: data.data, title: nama } }
        );
        app.preloader.hide();
      });
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
      
      app.request.get("http://localhost/askitchenweb/api/v1/subcategory/sample/"+kode, function(res) {
          
        var data = JSON.parse(res);
        // console.log(data)

        resolve(
          { componentUrl: './pages/subcategory.html' },
          { context: { data: data.data, title: nama } }
        );
        app.preloader.hide();
      });
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
      
      app.request.get("http://localhost/askitchenweb/api/v1/products/"+kode, function(res) {
          
        var data = JSON.parse(res);
        // console.log(data)

        resolve(
          { componentUrl: './pages/product.html' },
          { context: { data: data.data, title: nama } }
        );
        app.preloader.hide();
      });
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

      // var db = app.data.db;
      var data = null;
      
      app.request.get("http://localhost/askitchenweb/api/v1/items/"+kode, function(res) {
          
        var data = JSON.parse(res);
        // console.log(res)

        resolve(
          { componentUrl: './pages/detail.html' },
          { context: { data: data.data, title: nama } }
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
      
      app.request.post("http://localhost/askitchenweb/api/v1/member/histori", formData, function(res) {
          
        var data = JSON.parse(res);

        resolve(
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
