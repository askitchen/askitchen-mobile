// Dom7
var $$ = Dom7;

// var AdMob = null;

var details = [];
var items   = [];

var bBackPressed = false;

// Framework7.use(Framework7Keypad);

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.askitchen', // App bundle ID
  name: 'ASKITCHEN', // App name
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
      mbrid: 6, //null,
      email: null,
      pwd: null,

      endpoint: null,
      context: 1,

      total_items: 0, // total item cart

      total: 0,
      tax: 0,
      shipcost: 0,
      gtotal: 0,

      currentDate: null,
      lastURL: null,
      
      bLogedIn: false,
      token: null,
      push: null,
    };
  },
  // App root methods
  methods: {
    // helloWorld: function () {
      // app.dialog.alert('Hello World!');
    // },
    calcTotal: function(kode) {

      app.data.total = 0;

      for (var l = 0; l < details.length; l++) {

        if (details[l].disc > 0) { // diskon persen

          var discrp = details[l].qty * details[l].hjual * details[l].disc / 100;

          details[l].net = details[l].hjual - (discrp / details[l].qty);
          details[l].jumlah = (details[l].qty * details[l].hjual) - discrp;

        } else {

          // var disc = (details[l].discrp * 100 / details[l].qty) / (details[l].qty * details[l].hjual);
          
          details[l].net = details[l].hjual - (details[l].discrp / details[l].qty);          
          details[l].jumlah = (details[l].qty * details[l].hjual) - details[l].discrp;
        }

        app.data.total += details[l].jumlah;

        // hitung diskon global
        if (app.data.disc > 0) {
          app.data.tmpdiscrp = app.data.total * app.data.disc / 100;
          app.data.gtotal = app.data.total - app.data.tmpdiscrp;
        } else {
          app.data.tmpdisc = app.data.discrp * 100 / app.data.total;
          app.data.gtotal = app.data.total - app.data.discrp;
        }
      }
      app.data.gtotal = app.data.total;
      $$('.gtotal').text(app.data.gtotal.toLocaleString('ID'));
    },
  },
  on: {

    init: function () { // sama dengan onDeviceReady
      
      /*
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
      }

      copyDatabaseFile('data.db').then(function () {
        // success! :)
        app.data.db = window.sqlitePlugin.openDatabase({name: 'data.db'});
        // var currentDate = new Date();
        // var month = currentDate.getMonth() + 1;
        // var year = currentDate.getFullYear();
        
        var db = app.data.db;
        if (db) {
          app.dialog.alert('db is OK!');

          // $$('.item-basket').on('click', function () {
          //   var li = $$(this).parents("li");
          //   var kode = li.find('input').val();
          //   // console.log(kode)
          //   app.methods.addSalesItem(kode)
          //   // app.dialog.alert('Tes')
          // });                      
        }
      }).catch(function (err) {
        // error! :(
        console.log(err);
      }); //*/
      

      /*
      this.data.push = PushNotification.init({
        "android": {
            "senderID": "857182251234"
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
        
        var db = app.data.db;
    
        if (db) {
          
          var now = new Date();
          var date = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate();
          var time = now.getHours() + ":" + now.getMinutes()
          
          db.transaction(function(tx) {
              db.transaction(function(tx) {
                tx.executeSql('insert into notifikasi (tgl, jam, info) values (?, ?, ?);', [date, time, data.message]);
              }, function(error) {
                app.dialog.alert('insert error: ' + error.message);
              });
          });
        }
        
        // show message
        app.dialog.alert(data.message, 'ASKITCHEN');
        
      });//*/
    },     
  },
  // App routes
  routes: routes,
  // Enable panel left visibility breakpoint
  panel: {
    leftBreakpoint: 960,
  },
});


// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

// $$('.barcode-scan1').on('click', function () {
     
//   bBackPressed = true;

//   cordova.plugins.barcodeScanner.scan(
//     function (result) {
//         app.methods.findItem(result.text);
//         // app.dialog.alert("We got a barcode\n" +
//         //       "Result: " + result.text + "\n" +
//         //       "Format: " + result.format + "\n" +
//         //       "Cancelled: " + result.cancelled);
//     },
//     function (error) {
//         app.dialog.alert("Scanning failed: " + error);
//     },
//     {
//         preferFrontCamera : false, // iOS and Android
//         showFlipCameraButton : false, // iOS and Android
//         showTorchButton : true, // iOS and Android
//         torchOn: true, // Android, launch with the torch switched on (if available)
//         saveHistory: false, // Android, save scan history (default false)
//         prompt : "Place a barcode inside the scan area", // Android
//         resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
//         formats : "EAN_13,CODE_128,QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
//         orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
//         disableAnimations : true, // iOS
//         disableSuccessBeep: false // iOS and Android
//     }
//   );
// });


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
        var msg = 'Download this app for all your kitchen equipments!\n\n' +
        'https://play.google.com/store/apps/details?id=com.app.askitchen.mobile';
        window.plugins.socialsharing.shareViaWhatsApp(msg, null, null, null, function(e){
          app.dialog.alert("Sharing failed with message: " + e, 'ASKITCHEN');
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
        var msg = 'Download this app for all your kitchen equipments!\n\n' +
        'https://play.google.com/store/apps/details?id=com.app.askitchen.mobile';
        window.plugins.socialsharing.shareVia('org.telegram.messenger', msg, null, null, null, null, function(e){
          app.dialog.alert('Sharing failed with message: ' + e, 'ASKITCHEN');
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
        var msg = 'Download this app for all your kitchen equipments!\n\n' +
        'https://play.google.com/store/apps/details?id=com.app.askitchen.mobile';
        window.plugins.socialsharing.shareViaFacebook(msg, null, null, null, function(e){
          app.dialog.alert("Sharing failed with message: " + e, 'ASKITCHEN');
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
        var msg = 'Download this app for all your kitchen equipments!' +
        'https://play.google.com/store/apps/details?id=com.app.askitchen.mobile';
        window.plugins.socialsharing.shareViaTwitter(msg, null, 'https://twitter.com/', null, function(e){
          app.dialog.alert("Sharing failed with message: " + e, 'ASKITCHEN');
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

$$(document).on('backbutton', function (e) {

  e.preventDefault();

  // for example, based on what and where view you have
  if (app.views.main.router.url == '/') {
    
    if (!bBackPressed) {
      
      bBackPressed = true;

      // show toast
      var toast = app.toast.create({
        text: 'Press back once again to exit.',
        on: {
          opened: function () {
            // console.log('Toast opened')
          }
        }
      })
    } else {
      
      if (app.data.bLogedIn) {
        request.get("https://askitchen.com/api/v1/auth/logout", function(res) {});
      }

      navigator.app.exitApp();
    }
  } //else {
  //   if (app.views.main.router.url == '/beli/') {
  //     app.dialog.alert('aduh')
  //   } else
  //   mainView.router.back();
  // }
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