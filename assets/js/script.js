/* Register Service Worker */
if ("serviceWorker" in navigator) {
    registerServiceWorker();
    requestPermission();
} else {
    console.log("Peringatan ServiceWorker di script.js : Service Worker belum didukung browser ini.");
}

function registerServiceWorker() {
    return navigator.serviceWorker
        .register("/sw.js")
        .then(function (registration) {
            console.log("Notif Register ServiceWorker di script.js : Registrasi Service Worker berhasil.");
            return registration;
        })
        .catch(function (err) {
            console.error("Error Register ServiceWorker di script.js : Registrasi Service Worker gagal.", err);
        });
}

function requestPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(function (result) {
            if (result === "denied") {
                console.log("Error Request Permission di script.js : Fitur notifikasi tidak diizinkan.");
                return;
            }
            else if (result === "default") {
                console.error("Peringatan Request Permission di script.js : Pengguna menutup kotak dialog permintaan izin.");
                return;
            }

            if (("PushManager") in window) {
                navigator.serviceWorker.getRegistration().then(function (registration) {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array("BLcjHTFqFE1pZGiEDzyWQJnuE6IhFnzpxdfliH8ebRIVw_EU7eOpkpdzbf99gftWLbb-_3kB0NZ0p0OFI468wTs")
                    }).then(function (subscribe) {
                        console.log("Notif Request Permission di script.js : Berhasil melakukan subscribe");
                        console.log("Endpoint sementara: ", subscribe.endpoint);
                        console.log("p256dh key sementara: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("p256dh")))));
                        console.log("Auth key sementara: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("auth")))));
                    }).catch(function (e) {
                        console.error("Error Request Permission di script.js : Tidak dapat melakukan subscribe", e.message);
                    })
                })
            }
        });
    }
}
// =====================================================================


function back() {
    window.history.back();
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// =====================================================================
// Klasemen

function getHasilKlasemen(data) {
    let tableKlasemenHtml = "";

    data.standings.forEach(function (klasemen) {
        let tableKlasemen = "";

        klasemen.table.forEach(function (club) {
            club = JSON.parse(JSON.stringify(club).replace(/^http:\/\//i, 'https://'));

            tableKlasemen += `
                <tr>
                    <td class="center-align">${club.position}</td>
                    <td>
                        <a href="./detilClub.html?id=${club.team.id}">
                            <p style="display: flex; align-items: center;">
                                <img class="materialboxed" style="float:left; margin-right:20px" width="50" height="50" src="${club.team.crestUrl}">
                                ${club.team.name}
                            </p>
                        </a>
                    </td>
                    <td class="center-align">${club.playedGames}</td>
                    <td class="center-align">${club.won}</td>
                    <td class="center-align">${club.draw}</td>
                    <td class="center-align">${club.lost}</td>
                    <td class="center-align">${club.points}</td>
                    <td class="center-align">${club.goalsFor}</td>
                    <td class="center-align">${club.goalsAgainst}</td>
                    <td class="center-align">${club.goalDifference}</td>
                </tr>
            `;
        })

        tableKlasemenHtml += `
            <div class="card">
                <div class="card-content">
                    <table class="responsive-table striped centered">
                        <thead>
                            <tr>
                                <th class="center-align">Posisi</th>
                                <th class="center-align">Club</th>
                                <th class="center-align">Main</th>
                                <th class="center-align" title="Menang">M</th>
                                <th class="center-align" title="Seri">S</th>
                                <th class="center-align" title="Kalah">K</th>
                                <th class="center-align">Point</th>
                                <th class="center-align" title="Memasukkan Goal">MG</th>
                                <th class="center-align" title="Kemasukkan Goal">KG</th>
                                <th class="center-align" title="Selisih Goal">SG</th>
                            </tr>
                        </thead>

                        <tbody>
                            ` + tableKlasemen + `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });

    document.getElementById("klasemen").innerHTML = tableKlasemenHtml;
}

//=====================================================================================
// Club

function getHasilClub(data) {
    data = JSON.parse(JSON.stringify(data).replace(/^http:\/\//i, 'https://'));

    let tableOverviewHtml = "";
    let tableSquadHtml = "";

    tableOverviewHtml += `
        <tr>
            <td style="font-weight: bold;">Nama</td>
            <td>${data.name}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Nama Pendek</td>
            <td>${data.shortName}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Dibentuk</td>
            <td>${data.founded}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Singkatan Tiga Huruf</td>
            <td>${data.tla}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Alamat</td>
            <td>${data.address}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Telepon</td>
            <td>${data.phone}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Website</td>
            <td><a href="${data.website}" target="_blank">${data.website}</a></td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Email</td>
            <td><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Warna Club</td>
            <td>${data.clubColors}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Stadion</td>
            <td>${data.venue}</td>
        </tr>
    `;

    let number = 1;
    data.squad.forEach(function (squad) {
        tableSquadHtml += `
            <tr>
                <td class="center-align">${number}</td>
                <td>${squad.name}</td>
                <td class="center-align">
                ${squad.position}
                </td>
                <td class="center-align"><a href="./detilPemain.html?id=${squad.id}">Detail</a></td>
            </tr>
        `;
        number++;
    });

    document.getElementById("crestUrl").src = data.crestUrl;
    document.getElementById("nameHeader").innerHTML = data.name;
    document.getElementById("preloader").innerHTML = "";
    document.getElementById("tableOverview").innerHTML = tableOverviewHtml;
    document.getElementById("tableSquad").innerHTML = tableSquadHtml;
}

function getHasilDetilPemain(data) {
    let tableDetilPemainHtml = "";

    tableDetilPemainHtml += `
        <table class="striped">
            <thead></thead>
            <tbody>
                <tr>
                    <td style="font-weight: bold;">Nama</td>
                    <td>${data.name}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Nama Depan</td>
                    <td>${data.firstName}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Nama Belakang</td>
                    <td>${data.lastName}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Negara Kelahiran</td>
                    <td>${data.countryOfBirth}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Tanggal Lahir</td>
                    <td>${data.dateOfBirth}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Kebangsaan</td>
                    <td>${data.nationality}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Posisi</td>
                    <td>${data.position}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Nomor Punggung</td>
                    <td>${data.shirtNumber}</td>
                </tr>
            </tbody>
        </table>

        
    `;

    document.getElementById("preloader").innerHTML = "";
    document.getElementById("tablePlayerDetail").innerHTML = tableDetilPemainHtml;
}

function getHasilClubFavorit(data) {
    data = JSON.parse(JSON.stringify(data).replace(/^http:\/\//i, 'https://'));

    let tableClubFavoritHtml = "";
    let number = 1;

    tableClubFavoritHtml += `
        <table class="striped centered">
            <thead>
                <tr>
                    <th>Nomor</th>
                    <th>Nama Club</th>
                    <th>Hapus</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(function (team) {
        tableClubFavoritHtml += `
            <tr>
                <td>${number}</td>
                <td><a href="./detilClub.html?id=${team.id}&saved=true">${team.name}</a></td>
                <td>
                    <a class="waves-effect btn-small red" onclick="removeFromFavorites(${team.id}, 'favorite_team')">
                        <i class="large material-icons">delete</i>
                    </a>
                </td>
            </tr>
        `;

        number++;
    });

    tableClubFavoritHtml += `
            </tbody>
        </table>
    `;

    document.getElementById("favorite-item").innerHTML = tableClubFavoritHtml;
}

function getHasilPemainFavorit(data) {
    let tablePemainFavoritHtml = "";
    let number = 1;

    tablePemainFavoritHtml += `
        <table class="striped centered">
            <thead>
                <tr>
                    <th>Nomor</th>
                    <th>Nama Pemain</th>
                    <th>Hapus</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(function (player) {
        tablePemainFavoritHtml += `
            <tr>
                <td>${number}</td>
                <td><a href="./detilPemain.html?id=${player.id}&saved=true">${player.name}</a></td>
                <td>
                    <a class="waves-effect btn-small red" onclick="removeFromFavorites(${player.id}, 'pemain_favorit')">
                        <i class="large material-icons">delete</i>
                    </a>
                </td>
            </tr>
        `;

        number++;
    });

    tablePemainFavoritHtml += `
            </tbody>
        </table>
    `;

    document.getElementById("favorite-item").innerHTML = tablePemainFavoritHtml;
}

// ======================================================================================

