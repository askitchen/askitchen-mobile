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

      data_21: null,
      data_22: null,
      data_23: null,
      data_24: null,
      data_25: null,
      data_26: null,
      data_27: null,
      data_28: null,

      data_01: null,
      data_02: null,
      data_03: null,
      data_04: null,
      data_05: null,
      data_06: null,
      data_07: null,
      data_08: null,

      total: 0,
      tax: 0,
      shipcost: 0,
      gtotal: 0,

      // currentGroup: 0,
      currentDate: null,
      
      bLogedIn: false,
      token: null,
      push: null,
      // admobid: {}
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
    findItem: function(kode, ctx) {

      var db = app.data.db;
      
      if (db) {
        db.transaction(function(tx) {
          tx.executeSql('select kdbar, mstock from stock where kdbar = ?;', [kode], function(ignored, res) {

            if (res.rows.length > 0) {
              if (ctx == 1) {
                addSalesItem(kode);
              } else {
                addPurchaseItem(kode);
              }
            }
          });
        }, function(error) {
          app.dialog.alert('select error: ' + error.message);
        });
      }
    },
    addSalesItem: function(kode) {
      
      function cekKode(xkode) {
        return xkode.kdbar == kode;
      }
      
      var found = items.filter(cekKode);
      // console.log('found: ', found)
      var found2 = details.filter(cekKode);
      // console.log('found2: ', found2)

      if (found2.length) {
        found2[0].qty++;
        // found2[0].jumlah = found2[0].qty * found2[0].hjual;
      } else
      {
        details.push({ kdbar: found[0].kdbar,
                                nama: found[0].nama,
                                qty: 1,
                                hpokok: found[0].hpokok2,
                                hjual: found[0].hjual,
                                disc: 0,
                                discrp: 0.0,
                                net: 0.0,
                                jumlah: found[0].hjual })
        // console.log(details)
      }
      
      // hitung total
      app.methods.calcTotal();

    },
    decSalesItem: function(kode) {
      
      function cekKode(xkode) {
        return xkode.kdbar == kode;
      }
      
      var found = items.filter(cekKode);
      // console.log('found: ', found)
      var found2 = details.filter(cekKode);
      // console.log('found2: ', found2)

      if (found2.length) {
        found2[0].qty--;
        // found2[0].jumlah = found2[0].qty * found2[0].hjual;
      }
      app.methods.calcTotal();
    },
    editItem: function(kode) {
      var db = app.data.db;
      
      db.transaction(function(tx) {
        tx.executeSql('select kdbar from stock where kdbar = ?;', [kode], function(ignored, res) {

          if (res.rows.length > 0) {
            app.router.navigate('/stock/'+kode+'/');
          }
        }, function(error) {
          app.dialog.alert('select error: ' + error.message);
        });
      });
    },
  },
  on: {

    init: function () { // sama dengan onDeviceReady
      
      this.request.get("https://askitchen.com/api/v1/category/sample/21", function(res) {
        var data = JSON.parse(res);
        app.data.data_01 = data.data;
        // console.log(app.data.data_01);
      
        app.request.get("https://askitchen.com/api/v1/category/sample/22", function(res) {
          var data = JSON.parse(res);
          app.data.data_02 = data.data;
      
          app.request.get("https://askitchen.com/api/v1/category/sample/23", function(res) {
            var data = JSON.parse(res);
            app.data.data_03 = data.data;
      
            app.request.get("https://askitchen.com/api/v1/category/sample/24", function(res) {
              var data = JSON.parse(res);
              app.data.data_04 = data.data;
              
              app.request.get("https://askitchen.com/api/v1/category/sample/25", function(res) {
                var data = JSON.parse(res);
                app.data.data_05 = data.data;
                
                app.request.get("https://askitchen.com/api/v1/category/sample/26", function(res) {
                  var data = JSON.parse(res);
                  app.data.data_06 = data.data;
                  
                  app.request.get("https://askitchen.com/api/v1/category/sample/27", function(res) {
                    var data = JSON.parse(res);
                    app.data.data_07 = data.data;
                    
                    app.request.get("https://askitchen.com/api/v1/category/sample/28", function(res) {
                      var data = JSON.parse(res);
                      app.data.data_08 = data.data;
                    });
                  });
                });
              });
            });
          });
        });
      });
      
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

      // this.router.app.request.get("https://askitchen.com/api/v1/category/sample/01", function(res) {
      //   // console.log(res);
      //   var data = JSON.parse(res);
      //   app.data.data01 = data.data;
      //   console.log(app.data.data01)
      // });
      
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
        app.methods.addSalesItem(kode)
        // app.dialog.alert('Tes')
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
        
        // update info saldo
        // setTimeout(function () {

        //   // http://localhost/
        //   app.request.get('http://localhost/askitchenweb/api/v1/member/saldo/'+ app.data.mbrid, function (res) {
          
        //     var data = JSON.parse(res);
        
        //     if (data.status) {
        //       $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
        //       app.data.saldo = parseInt(data.saldo);
        //       app.data.bonus = parseInt(data.bonus);
        //     } else {
        //       app.dialog.alert(data.message, 'ASKITCHEN');
        //     }
        //   });
        // }, 1000);
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

// var swiper = app.swiper.create('.swiper-container', { //.swiper-init.demo-swiper
//     speed: 400,
//     slidesPerView: 3,
//     loop: true,
//     //autoHeight: true,
//     // shortSwipes: false,
//     // longSwipes: false,
//     //effect:'fade'
//     //spaceBetween: 100
// });

// swiper.autoplay.start();

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

var ac_more = app.actions.create({
  grid: true,
  buttons: [
    [
      {
        text: 'Pending',
        icon: '<img src="img/histori.png" width="42"/>',
        onClick: function () {
          app.dialog.alert('Pending clicked')
        }
      },
      {
        text: 'Load Pending',
        icon: '<img src="img/histori.png" width="42"/>',
        onClick: function () {
          app.dialog.alert('Load pending clicked')
        }
      },
      {
        text: 'Bayar',
        icon: '<img src="img/payment.png" width="42">',
        onClick: function () {
          app.dialog.alert('Bayar clicked')
        }
      },
    ],
    [
      {
        text: 'Batal',
        icon: '<img src="img/cancel.png" width="42"/>',
        onClick: function () {
          details = [];
          app.methods.calcTotal();
        }
      },
      {
        text: 'Button 2',
        icon: '<img src="http://lorempixel.com/96/96/fashion/5" width="42">'
      },
      {
        text: 'Button 3',
        icon: '<img src="http://lorempixel.com/96/96/fashion/6" width="42">'
      },
    ]
  ]
});

// $$('.ac-more1').on('click', function () {
//   ac_more.open();
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
        'https://play.google.com/store/apps/details?id=com.app.askitchen';
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
        'https://play.google.com/store/apps/details?id=com.app.askitchen';
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
        'https://play.google.com/store/apps/details?id=com.app.askitchen';
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
        'https://play.google.com/store/apps/details?id=com.app.askitchen';
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