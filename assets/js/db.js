function cekDatabase(idb) {
    var dbPromised = idb.open("LaLiga", 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(dbFavTeam)) {
            var teamsObjectStore = upgradeDb.createObjectStore(dbFavTeam, {
                keypath: "id"
            });

            teamsObjectStore.createIndex("team_name", "name", {
                unique: false
            });
        }

        if (!upgradeDb.objectStoreNames.contains(dbFavPlayer)) {
            var playerObjectStore = upgradeDb.createObjectStore(dbFavPlayer, {
                keypath: "id"
            });

            playerObjectStore.createIndex("player_name", "name", {
                unique: false
            });
        }
    });

    return dbPromised;
}

function addToFavorite(data, storeName) {
    var dataPrimaryKey;
    if (storeName == dbFavTeam) {
        dataPrimaryKey = data.id;
    }
    else if (storeName == dbFavPlayer) {
        dataPrimaryKey = data.id;
    }

    cekDatabase(idb)
        .then(function (db) {
            var tx = db.transaction(storeName, "readwrite");
            var store = tx.objectStore(storeName);

            store.put(data, dataPrimaryKey);

            return tx.complete;
        })
        .then(function () {
            M.toast({
                html: "+Ditambahkan ke Favorit",
            });
        });
}

function removeFromFavorites(ID, storeName) {
    console.log(ID + " " + storeName);
    cekDatabase(idb)
        .then(function (db) {
            var tx = db.transaction(storeName, "readwrite");
            var store = tx.objectStore(storeName);

            store.delete(ID);

            return tx.complete;
        })
        .then(function () {
            M.toast({
                html: "-Terhapus dari Favorit",
            });
        });

    location.reload();
}

function getAllFavorites(storeName) {
    return new Promise(function (resolve, reject) {
        cekDatabase(idb)
            .then(function (db) {
                var tx = db.transaction(storeName, "readonly");
                var store = tx.objectStore(storeName);

                return store.getAll();
            })
            .then(function (data) {
                resolve(data);
            });
    });
}

function getById(ID, storeName) {
    return new Promise(function (resolve, reject) {
        cekDatabase(idb)
            .then(function (db) {
                var tx = db.transaction(storeName, "readonly");
                var store = tx.objectStore(storeName);

                return store.get(ID);
            })
            .then(function (data) {
                resolve(data);
            });
    });
}