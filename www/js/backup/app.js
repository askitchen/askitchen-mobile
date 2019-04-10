// Dom7
var $$ = Dom7;
var AdMob = null;

var details = [];
var items = //[];
[
  {
     "kdbar": 8999999035839,
     "nama": " CITRA HBL ADVANCED WHITE 250 ML",
     "satuan": "PCS",
     "hbeli": 18900,
     "hpokok2": 18900,
     "hjual": 21000,
     "stawal": "0",
     "saldo": 4,
     "mstock": "Y"
  },
  {
     "kdbar": 522,
     "nama": "838T / D5 GELAS SET",
     "satuan": "PCS",
     "hbeli": 16800,
     "hpokok2": 16800,
     "hjual": 19000,
     "stawal": "0",
     "saldo": 1,
     "mstock": "Y"
  },
  {
     "kdbar": 711844162426,
     "nama": "ABC ASAM JAWA 250 ML",
     "satuan": "PCS",
     "hbeli": 3309,
     "hpokok2": 3309,
     "hjual": 4000,
     "stawal": 6,
     "saldo": 7,
     "mstock": "Y"
  },
  {
     "kdbar": 517,
     "nama": "ABC BATRAI BIRU BESAR",
     "satuan": "PCS",
     "hbeli": 8500,
     "hpokok2": 8500,
     "hjual": 10000,
     "stawal": "0",
     "saldo": 8,
     "mstock": "Y"
  },
  {
     "kdbar": 8991002101333,
     "nama": "ABC INSTANT WHITE COFFEE 20 GR",
     "satuan": "PCS",
     "hbeli": 981,
     "hpokok2": 981,
     "hjual": 1300,
     "stawal": "0",
     "saldo": 30,
     "mstock": "Y"
  }
];

var bScan = false;

// Framework7.use(Framework7Keypad);

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.pos', // App bundle ID
  name: 'Sistem POS', // App name
  theme: 'auto', // Automatic theme detection
  init: true,
  initOnDeviceReady: true,
  
  touch: {
    disableContextMenu: false,
  },
  
  // App root data
  data: function () {
    return {
      db: null,

      // periode berjalan
      bulan: 0,
      tahun: 0,

      //detail: [],
      total: 0,
      disc: 0,
      discrp: 0,
      gtotal: 0,
      cash: 0,
      card: 0,
      kembali: 0,

      kdbar: null,
      kdsup: null,
      bEdit: false,

      currentGroup: 0,
      currentDate: null,
      
      // for editing
      currentCode: null,
      currentPos: null,
      currentNom: 0,
      
      token: null,
      push: null,
      admobid: {}
    };
  },
  // App root methods
  methods: {
    // helloWorld: function () {
      // app.dialog.alert('Hello World!');
    // },
    addItem: function(kode) {
      
      function cekKode(xkode) {
        return xkode.kdbar == kode;
      }
      // console.log('kode: ', kode)
      var found = items.filter(cekKode);
      // console.log('found: ', found)
      var found2 = details.filter(cekKode);
      // console.log('found2: ', found2)

      if (found2.length) {
        found2[0].qty++;
        found2[0].jumlah = found2[0].qty * found2[0].hjual;
      } else
      {
        details.push({ kdbar: found[0].kdbar,
                                nama: found[0].nama,
                                qty: 1,
                                hpokok: found[0].hpokok2,
                                hjual: found[0].hjual,
                                disc: 0,
                                discrp: 0.0,
                                jumlah: found[0].hjual })
        // console.log(details)
       }
      app.data.total = 0;
      for (var l = 0; l < details.length; l++) {
        app.data.total += details[l].jumlah;
      }
      app.data.gtotal = app.data.total;
      $$('.gtotal').text(app.data.gtotal.toLocaleString('ID'));

    },
    editItem: function(kode) {
      var db = app.data.db;
      
      db.transaction(function(tx) {
        tx.executeSql('select kdbar from stock where kdbar = ?;', [kode], function(ignored, res) {

          if (res.rows.length > 0) {

          }
        }, function(error) {
          app.dialog.alert('select error: ' + error.message);
        });
      });
  }
  },
  on: {
    init: function () {

      //*
      function copyDatabaseFile(dbName) {

        var sourceFileName = cordova.file.applicationDirectory + 'www/' + dbName;
        var targetDirName = cordova.file.dataDirectory;

        return Promise.all([
          new Promise(function (resolve, reject) {
            resolveLocalFileSystemURL(sourceFileName, resolve, reject);
          }),
          new Promise(function (resolve, reject) {
            resolveLocalFileSystemURL(targetDirName, resolve, reject);
          })
        ]).then(function (files) {
          var sourceFile = files[0];
          var targetDir = files[1];
          return new Promise(function (resolve, reject) {
            targetDir.getFile(dbName, {}, resolve, reject);
          }).then(function () {
            console.log("file already copied");
          }).catch(function () {
            console.log("file doesn't exist, copying it");
            return new Promise(function (resolve, reject) {
              sourceFile.copyTo(targetDir, dbName, resolve, reject);
            }).then(function () {
              console.log("database file copied");
            });
          });
        });
      }//*/

      //*
      copyDatabaseFile('dagang.db').then(function () {
        // // success! :)
        app.data.db = window.sqlitePlugin.openDatabase({name: 'dagang.db'});
        // var currentDate = new Date();
        // var month = currentDate.getMonth() + 1;
        // var year = currentDate.getFullYear();
        
        var db = app.data.db;
        // if (db) {
        //   app.dialog.alert('db is OK!');
        // }
        
        // db.transaction(function(tx) {
        //   tx.executeSql('insert into setup (nama, blnsaldo, thnsaldo) values (?, ?, ?);', ['Nama Usaha Anda',month,year]);
        // }, function(error) {
        //   app.dialog.alert('insert error: ' + error.message);
        // });      

        // hitung selisih periode yang telah lewat
        
        db.transaction(function(tx) {
          tx.executeSql('select kdbar, nama, satuan, hbeli, hpokok2, hjual, stawal, saldo, mstock from stock order by nama;', [], function(ignored, res) {

            // $$('.gtotal').text(res.rows.length);
            for (var i = 0; i < res.rows.length; i++) {
              items.push({ kdbar: res.rows.item(i).kdbar,
                           nama: res.rows.item(i).nama,
                           satuan: res.rows.item(i).satuan,
                           hbeli: res.rows.item(i).hbeli,
                           hpokok: res.rows.item(i).hpokok,
                           hpokok2: res.rows.item(i).hpokok2,
                           hjual: res.rows.item(i).hjual,
                           stawal: res.rows.item(i).stawal,
                           saldo: res.rows.item(i).saldo,
                           mstock: res.rows.item(i).mstock
                          });
            }
          
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
                    '<div class="item-after">Rp{{hjual}}<br>{{saldo}} {{satuan}}</div>' +
                  '</a>' +
                '</li>',
              // Item height
              //height: app.theme === 'ios' ? 63 : 73,
            });

            $$('.item-basket').on('click', function () {
              var li = $$(this).parents("li");
              var kode = li.find('input').val();
              // console.log(kode)
              app.methods.addItem(kode)
              // app.dialog.alert('Tes')
            });                      
          });
        }, function(error) {
          app.dialog.alert('select error: ' + error.message);
        });
      }).catch(function (err) {
        // error! :(
        console.log(err);
      });//*/
      
      // $$('#my-login-screen [name="mbrid"]').val(localStorage.getItem('mbrid'));
      // $$('#my-login-screen [name="nohp"]').val(localStorage.getItem('nohp'));

      /*
      this.data.push = PushNotification.init({
        "android": {
            "senderID": "857182253756" //"597497239727"
        },
        "ios": {
            "sound": true,
            "vibration": true,
            "badge": true
        },
        "windows": {}
      });

      var push = this.data.push;

      push.on('registration', function(data) {

        var oldRegId = localStorage.getItem('RegId');
        if (oldRegId !== data.registrationId) {
            // Save new registration ID
            localStorage.setItem('RegId', data.registrationId);
            // Post registrationId to your app server as the value has changed
            // app.dialog.alert('Registrasi Id berhasil!');
        }

      });

      push.on('notification', function(data) {
        
        // show message
        app.dialog.alert(data.message, 'Sistem POS');
        
        // update info saldo
        setTimeout(function () {

          // http://localhost/
          app.request.get('http://localhost/dagang/member/saldo/'+ app.data.mbrid, function (res) {
          
            var data = JSON.parse(res);
        
            if (data.status) {
              $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
              app.data.saldo = parseInt(data.saldo);
              app.data.bonus = parseInt(data.bonus);
            } else {
              app.dialog.alert(data.message, 'Sistem POS');
            }
          });
        }, 1000);
      });
      
      
      //run admob
      if( /(android)/i.test(navigator.userAgent) ) {
        this.data.admobid = { // for Android
          banner: 'ca-app-pub-1170231320150532/4785613972', //RedagroBanner
          interstitial: 'ca-app-pub-xxxxxxxxxxxxx/oooooooooooo'
        };
      } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
        this.data.admobid = { // for iOS
          banner: 'ca-app-pub-xxxxxxxxxxxxx/oooooooooooo',
          interstitial: 'ca-app-pub-xxxxxxxxxxxxx/oooooooooooo'
        };
      } else {
        this.data.admobid = { // for Windows Phone
          banner: 'ca-app-pub-xxxxxxxxxxxxx/oooooooooooo',
          interstitial: 'ca-app-pub-xxxxxxxxxxxxx/oooooooooooo'
        };
      }
     
      if ( AdMob ) {
     
        // this will create a banner on startup
        AdMob.createBanner( {
          adId: this.data.admobid.banner,
          adSize: 'SMART_BANNER',
          position: AdMob.AD_POSITION.BOTTOM_CENTER,
          // isTesting: true, // TODO: remove this line when release
          autoShow: false,
          overlap: false,
          // offsetTopBar: false,
          bgColor: 'white'
        } );
      }//*/
    },     
  },
  // App routes
  routes: routes,
  // Enable panel left visibility breakpoint
  panel: {
    leftBreakpoint: 960,
  },
});

// Init/Create left panel view
var mainView = app.views.create('.view-left', {
  url: '/'
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

// create searchbar
var searchbar = app.searchbar.create({
  el: '.searchbar',
  searchContainer: '.list-lookup',
  searchIn: '.item-title',
  on: {
    search(sb, query, previousQuery) {
      // console.log(query, previousQuery);
    }
  }
});

/*
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
        '<div class="item-after">Rp{{hjual}}<br>{{saldo}} {{satuan}}</div>' +
      '</a>' +
    '</li>',
  // Item height
  //height: app.theme === 'ios' ? 63 : 73,
});

$$('.item-basket').on('click', function () {
  var li = $$(this).parents("li");
  var kode = li.find('input').val();
  // console.log(kode)
  app.methods.addItem(kode)
  // app.dialog.alert('Tes')
});*/

// var swiper = app.swiper.create('.swiper-container', {
    // speed: 400,
    // //slidesPerView: auto,
    // loop: true,
    // //autoHeight: true,
    // shortSwipes: false,
    // longSwipes: false,
    // //effect:'fade'
    // //spaceBetween: 100
// });

// swiper.autoplay.start();

$$('.barcode-scan1').on('click', function () {
     
  bScan = true;

  cordova.plugins.barcodeScanner.scan(
    function (result) {
        // app.methods.editItem(result.text);
        app.dialog.alert("We got a barcode\n" +
              "Result: " + result.text + "\n" +
              "Format: " + result.format + "\n" +
              "Cancelled: " + result.cancelled);
        bScan = false;
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

$$('.barcode-scan2').on('click', function () {
     
  bScan = true;

  cordova.plugins.barcodeScanner.scan(
    function (result) {
        // app.methods.editItem(result.text);
        app.dialog.alert("We got a barcode\n" +
              "Result: " + result.text + "\n" +
              "Format: " + result.format + "\n" +
              "Cancelled: " + result.cancelled);
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

var ac_more = app.actions.create({
  grid: true,
  buttons: [
    [
      {
        text: 'Pending',
        icon: '<img src="img/histori.png" width="48"/>',
        onClick: function () {
          app.dialog.alert('Pending clicked')
        }
      },
      {
        text: 'Load Pending',
        icon: '<img src="img/histori.png" width="48"/>',
        onClick: function () {
          app.dialog.alert('Load pending clicked')
        }
      },
      {
        text: 'Sync Data',
        icon: '<img src="img/histori.png" width="48">',
        onClick: function () {
          app.dialog.alert('Sync clicked')
        }
      },
    ],
    [
      {
        text: 'Button 1',
        icon: '<img src="http://lorempixel.com/96/96/fashion/4" width="48"/>'
      },
      {
        text: 'Button 2',
        icon: '<img src="http://lorempixel.com/96/96/fashion/5" width="48">'
      },
      {
        text: 'Button 3',
        icon: '<img src="http://lorempixel.com/96/96/fashion/6" width="48">'
      },
    ]
  ]
});

$$('.ac-more').on('click', function () {
  ac_more.open();
});

var ac_share = app.actions.create({
  buttons: [
    {
      text: '<div class="list"><ul><li><div class="item-content">'+
      '<div class="item-media"><img class="material-icons" src="img/whatsapp.png" /></div>'+
      '<div class="item-inner">'+
        '<div class="item-title-row">'+
          '<div class="item-title">Whatsapp</div>'+
        '</div>'+
        '<div class="item-text"></div>'+
      '</div>'+
    '</div></li></ul></div>',
      onClick: function () {
        var msg = 'Ayo download aplikasi POS yang mudah dan praktis untuk usahamu!\n\n' +
        'https://play.google.com/store/apps/details?id=com.app.pos';
        window.plugins.socialsharing.shareViaWhatsApp(msg, null, null, null, function(e){
          app.dialog.alert("Sharing failed with message: " + e, "Sistem POS");
        })
      }
    },
    {
      text: '<div class="list"><ul><li><div class="item-content">'+
      '<div class="item-media"><img class="material-icons" src="img/telegram.png" /></div>'+
      '<div class="item-inner">'+
        '<div class="item-title-row">'+
          '<div class="item-title">Telegram</div>'+
        '</div>'+
        '<div class="item-text"></div>'+
      '</div>'+
    '</div></li></ul></div>',
      onClick: function () {
        var msg = 'Ayo download aplikasi POS yang mudah dan praktis untuk usahamu!\n\n' +
        'https://play.google.com/store/apps/details?id=com.app.pos';
        window.plugins.socialsharing.shareVia('org.telegram.messenger', msg, null, null, null, null, function(e){
          app.dialog.alert('Sharing failed with message: ' + e, 'Sistem POS');
        })
      }
    },
    {
      text: '<div class="list"><ul><li><div class="item-content">'+
      '<div class="item-media"><img class="material-icons" src="img/facebook.png" /></div>'+
      '<div class="item-inner">'+
        '<div class="item-title-row">'+
          '<div class="item-title">Facebook</div>'+
        '</div>'+
        '<div class="item-text"></div>'+
      '</div>'+
    '</div></li></ul></div>',
      onClick: function () {
        var msg = 'Ayo download aplikasi POS yang mudah dan praktis untuk usahamu!\n\n' +
        'https://play.google.com/store/apps/details?id=com.app.pos';
        window.plugins.socialsharing.shareViaFacebook(msg, null, null, null, function(e){
          app.dialog.alert("Sharing failed with message: " + e, "Sistem POS");
        })
      }
    },
    /*{
      text: '<div class="list"><ul><li><div class="item-content">'+
      '<div class="item-media"><img class="material-icons" src="img/twitter.png" /></div>'+
      '<div class="item-inner">'+
        '<div class="item-title-row">'+
          '<div class="item-title">Twitter</div>'+
        '</div>'+
        '<div class="item-text"></div>'+
      '</div>'+
    '</div></li></ul></div>',
      onClick: function () {
        var msg = 'Ayo download aplikasi POS yang mudah dan praktis untuk usahamu!' +
        'https://play.google.com/store/apps/details?id=com.app.pos';
        window.plugins.socialsharing.shareViaTwitter(msg, null, 'https://twitter.com/', null, function(e){
          app.dialog.alert("Sharing failed with message: " + e, "Sistem POS");
        })
      }
    },*/
    {
      text: '<div class="list"><ul><li><div class="item-content">'+
      '<div class="item-media"></div>'+
      '<div class="item-inner">'+
        '<div class="item-title-row">'+
          '<div class="item-title">Cancel</div>'+
        '</div>'+
        '<div class="item-text"></div>'+
      '</div>'+
    '</div></li></ul></div>',
      color: 'red',
    },
  ]
});

$$('.ac-share').on('click', function () {
  ac_share.open();
});

// Login Screen
$$('#my-login-screen .login-button').on('click', function () {
  
  var mbrid = $$('#my-login-screen [name="mbrid"]').val();
  if (mbrid == '') {
      app.dialog.alert('Masukkan ID member anda.', 'Login Member');
      return;
  }
  
  var nohpx = $$('#my-login-screen [name="nohp"]').val();
  if (nohpx == '') {
      app.dialog.alert('Masukkan nomor handphone anda.', 'Login Member');
      return;
  }

  var rgx_nohp = /[08][0-9]{9,}/;
  var nohp = nohpx.trim().match(rgx_nohp);
  if (!nohp) {
      app.dialog.alert('Input data nomor handphone belum benar.', 'Login Member');
      return;
  }

  var pin = $$('#my-login-screen [name="pin"]').val();
  if (pin == '') {
      app.dialog.alert('Masukkan nomor PIN anda.', 'Login Member');
      return;
  }
  
  app.preloader.show();

  var formData = app.form.convertToData('.login-form');

  var regId = localStorage.getItem('RegId');
  formData.gcmid = regId;

  // app.request.setup({
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Headers': 'origin, content-type, accept',
  //     'content-type': 'application/x-www-form-urlencoded',
  //     'server': 'Apache/2.4.7 (Win32) OpenSSL/1.0.1e PHP/5.6.12'
  //   }
  // })
  
  // http://localhost/
  app.request.post('http://localhost/dagang/auth/login', formData, function (res) {
    
    app.preloader.hide();
    var data = JSON.parse(res);

    if (data.status) {
    
      localStorage.setItem('mbrid', mbrid);
      localStorage.setItem('nohp', nohp);
      // console.log('localStorage.setItem')

      app.loginScreen.close('#my-login-screen');
      
      app.data.mbrid = mbrid;
      app.data.nohp = nohp;
      app.data.pin = pin;
      app.data.token = data.token;
      
      // kosongkan isian nomor pin
      $$('#my-login-screen [name="pin"]').val('');
      
      app.request.get('http://localhost/dagang/member/saldo/'+mbrid, function (res) {
          
        var data = JSON.parse(res);
    
        if (data.status) {
          $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
          app.data.saldo = parseInt(data.saldo);
        } else {
          app.dialog.alert(data.message, 'Akun Saya');
        }
      });

      if ( AdMob ) {
     
        // this will create a banner on startup
        AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
      }


    } else {
      app.dialog.alert(data.message, 'Login Member');
    }
  });
});

$$('a.label-register').on('click', function () {
  // Close login screen
  app.loginScreen.close('#my-login-screen');
  app.loginScreen.open('#my-reg-screen');
});


// Registrasi member
$$('#my-reg-screen .register-button').on('click', function () {
  
  var nama = $$('#my-reg-screen [name="nama"]').val();
  if (nama == '') {
      app.dialog.alert('Masukkan nama lengkap anda.', 'Registrasi Member');
      return;
  }
  
  var rgx_nama = /^[a-zA-Z]'?([a-zA-Z]|\,|\.| |-)+$/;
  var namax = nama.trim().match(rgx_nama);
  if (!namax) {
    app.dialog.alert('Input data nama belum benar.', 'Registrasi Member');
    return;
  }

  var nohpx = $$('#my-reg-screen [name="nohp"]').val();
  if (nohpx == '') {
      app.dialog.alert('Masukkan nomor handphone.', 'Registrasi Member');
      return;
  }

  var rgx_nohp = /[08][0-9]{9,}/;
  var nohp = nohpx.trim().match(rgx_nohp);
  if (!nohp) {
    app.dialog.alert('Input data nomor handphone belum benar.', 'Registrasi Member');
    return;
  }

  app.preloader.show();
  
  var regId = localStorage.getItem('RegId');
  var formData = app.form.convertToData('.register-form');

  formData.mbrid = 1;
  formData.gcmid = regId;
  
  app.request.post('http://localhost/dagang/member', formData, function (res) {
    
    app.preloader.hide();
    
    var data = JSON.parse(res);

    if (data.status) {
      
      // simpan data nomor handphone
      localStorage.setItem('mbrid', data.mbrid);
      localStorage.setItem('nohp', nohp);

      app.data.mbrid = data.mbrid;
      app.data.nohp = data.nohp;

      // set data ke form login
      $$('#my-login-screen [name="mbrid"]').val(data.mbrid);
      $$('#my-login-screen [name="nohp"]').val(nohp);

      app.loginScreen.close('#my-reg-screen');
      app.loginScreen.open('#my-login-screen');
    
      setTimeout(function () {
        app.dialog.alert(data.message, 'Registrasi Member');
      }, 2000);

    } else {
      app.dialog.alert(data.message, 'Registrasi Member');
    }
  });
});

$$('a.label-login').on('click', function () {
  // Close register screen
  app.loginScreen.close('#my-reg-screen');
  app.loginScreen.open('#my-login-screen');
});

$$('#my-login-screen').on('loginscreen:opened', function (e, loginScreen) {
  // set data ke form login
  $$('#my-login-screen [name="mbrid"]').val(localStorage.getItem('mbrid'));
  $$('#my-login-screen [name="nohp"]').val(localStorage.getItem('nohp'));
});

$$(document).on('backbutton', function (e) {
  e.preventDefault();
  // for example, based on what and where view you have
  if (app.views.main.router.url == '/') {
    if (!bScan) {
      navigator.app.exitApp();
    }
  } else {
    mainView.router.back();
  }
});

$$('#my-login-screen').on('loginscreen:open', function (e, loginScreen) {

  if ( AdMob ) {
    // this will create a banner on startup
    AdMob.hideBanner();
  }
});

app.on('pageInit', function (page) {

  $$('input').on('focus', function () {
    
    $$('.kb').css('height', '280px');
    //var limit = $$(window).height() - 280;

    if ($$(this).offset().top > 280) {
      $$('.page-content').scrollTop($$(this).offset().top-168);
    }
  });

  $$('input').on('blur', function () {
    $$('.kb').css('height', '0px');
  });
});
