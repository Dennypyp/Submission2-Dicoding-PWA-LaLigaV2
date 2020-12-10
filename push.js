let webPush = require("web-push");

const vapidKeys = {
    "publicKey": "BLcjHTFqFE1pZGiEDzyWQJnuE6IhFnzpxdfliH8ebRIVw_EU7eOpkpdzbf99gftWLbb-_3kB0NZ0p0OFI468wTs",
    "privateKey": "hV6O--NJ-Sp3bHNAJH1jpzwbEy6EMvvAwVD0B_9GcAM"
};

webPush.setVapidDetails(
    'mailto:denny.pyp11@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

let pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/fLkmYWyP_M4:APA91bFZ685X0nq62RVaGt_ZgL6wSCq1mphG0IShzWL2A5kgKr5NwvvzYJnNTIYnEfoPKFXruXJCZNJDsKyolkYzsE9HXwbgfsom_SvahFghLIV8_2AT_YW65LaoTDzOR0VT20BdbM_Q",
    "keys": {
        "p256dh": "BNWbhbekcOBjflM3rZrOMm3ApaOxZ1t/0f42/E1Jvgw+PtIuux79uoLIcsCthiDFSoF2G86Ce/oBtqHXXFGPun4=",
        "auth": "76Wnutev/gHOXZ43MlpYWg=="
    }
};

let payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

let options = {
    gcmAPIKey: "231054452926",
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);