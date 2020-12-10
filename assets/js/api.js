const baseUrl = "https://api.football-data.org/v2";
const apiToken = "99aabc83daa040e8bdcc0720b451a301";
const idLiga = 2014;

const endpoint_klasemen = `${baseUrl}/competitions/${idLiga}/standings?standingType=TOTAL`;
const endpoint_tanding = `${baseUrl}/competitions/${idLiga}/matches?status=SCHEDULED`;
const endpoint_detailClub = `${baseUrl}/teams/`;
const endpoint_detailTanding = `${baseUrl}/matches/`;
const endpoint_detailPemain = `${baseUrl}/players/`;

const typeTeam = "team";
const typeMatch = "match";
const typePlayer = "player";
const dbFavTeam = "favorite_team";
const dbFavMatch = "favorite_match";
const dbFavPlayer = "pemain_favorit";

function status(response) {
    if (response.status !== 200) {
        console.log("[API.js][status] Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}
function json(response) {
    return response.json();
}

function error(error) {
    console.log("[API.js][error] Error : " + error);
}

function fetchAPI(endpoint) {
    return fetch(endpoint, {
        headers: {
            "X-Auth-Token": apiToken
        }
    });
}

function getKlasemen() {
    return new Promise(function (resolve, reject) {
        if ("caches" in window) {
            caches.match(endpoint_klasemen).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        getHasilKlasemen(data);
                        resolve(data);
                    });
                }
            });
        }

        fetchAPI(endpoint_klasemen)
            .then(status)
            .then(json)
            .then(function (data) {
                getHasilKlasemen(data);
                resolve(data);
            })

            .catch(error);
    });
}



function getTeamDetail(idTeam) {
    return new Promise(function (resolve, reject) {
        if ("caches" in window) {
            caches.match(endpoint_detailClub + idTeam).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        getHasilClub(data);
                        resolve(data);
                    });
                }
            });
        }

        fetchAPI(endpoint_detailClub + idTeam)
            .then(status)
            .then(json)
            .then(function (data) {
                getHasilClub(data);
                resolve(data);
            })
            .catch(error);
    });
}



function getDetilPemain(idPemain) {
    return new Promise(function (resolve, reject) {
        if ("caches" in window) {
            caches.match(endpoint_detailPemain + idPemain).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        getHasilDetilPemain(data);
                        resolve(data);
                    });
                }
            });
        }

        fetchAPI(endpoint_detailPemain + idPemain)
            .then(status)
            .then(json)
            .then(function (data) {
                getHasilDetilPemain(data);
                resolve(data);
            })
            .catch(error);
    });
}

function tabFavorit(type) {
    if (type == typeTeam) {
        getAllFavorites(dbFavTeam).then(function (data) {
            getHasilClubFavorit(data);
        });
    }
    else if (type == typePlayer) {
        getAllFavorites(dbFavPlayer).then(function (data) {
            getHasilPemainFavorit(data);
        });
    }
}

function getFavoriteById(ID, type) {
    if (type == typeTeam) {
        getById(ID, dbFavTeam).then(function (data) {
            getHasilClub(data);
        });
    }
    else if (type == typePlayer) {
        getById(ID, dbFavPlayer).then(function (data) {
            getHasilDetilPemain(data);
        })
    }
}