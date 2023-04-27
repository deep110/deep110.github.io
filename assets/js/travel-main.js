var visitedCountries = ['IN', 'TR', 'NP', 'AE', 'VN'];

var visitedCities = {
    "2022": [
        // Kerala
        { name: "Munnar", coords: [10.0889, 77.0595], image: "munnar.webp", post: "2022-12-04-kerala.html#munnar", date: "Nov, 2022" },
        { name: "Alleppey", coords: [9.4981, 76.3388], image: "alleppey.webp", post: "2022-12-04-kerala.html#alleppey", date: "Oct, 2022" },
        { name: "Kanyakumari", coords: [8.0883, 77.5385], image: "kanyakumari.webp", post: "2022-12-04-kerala.html#kanyakumari", date: "Oct, 2022" },
        { name: "Kovalam", coords: [8.3988, 76.9820], image: "kovalam.webp", post: "2022-12-04-kerala.html", date: "Oct, 2022" },

        // Nepal
        { name: "Kathmandu", coords: [27.7172, 85.3240], image: "kathmandu.webp", date: "Aug, 2022" },

        // Turkey
        { name: "Cappadocia", coords: [38.3535, 35.0911], image: "cappadocia.webp", post: "2022-05-13-turkey.html#cappadocia", date: "May, 2022" },
        { name: "Antalya", coords: [36.8969, 30.7133], image: "antalya.webp", post: "2022-05-13-turkey.html#antalya", date: "May, 2022" },
        { name: "Pamukkale", coords: [37.9137, 29.1187], image: "pamukkale.webp", post: "2022-05-13-turkey.html#pamukkale", date: "May, 2022" },
        { name: "Ephesus", coords: [37.94111, 27.34194], image: "ephesus.webp", post: "2022-05-13-turkey.html#kusadasi", date: "May, 2022" },
        { name: "Kuşadası", coords: [37.8579, 27.2610], image: "kusadasi.webp", post: "2022-05-13-turkey.html#kusadasi", date: "May, 2022" },
        { name: "Istanbul", coords: [41.0082, 28.9784], image: "istanbul.webp", post: "2022-05-13-turkey.html", date: "April, 2022" },
    ],
    "2021": [
        { name: "Kolkata", coords: [22.5726, 88.3639], image: "kolkata.webp", date: "Dec, 2021" },
        { name: "Diu", coords: [20.7144, 70.9874], image: "diu.webp", date: "Nov, 2021" },
        { name: "Pondicherry", coords: [11.9416, 79.8083], image: "pondicherry.webp", date: "Oct, 2021" },
        { name: "Chandrataal", coords: [32.4824, 77.6157], image: "chandrataal.webp", date: "Sept, 2021" },
        { name: "Spiti Valley", coords: [32.2461, 78.0349], image: "spiti-valley.webp", date: "Sept, 2021" },
        { name: "Manali", coords: [32.2432, 77.1892], image: "manali.webp", date: "Sept, 2021" },
        { name: "Indore", coords: [22.7196, 75.8577], image: "indore.webp", date: "Sept, 2021" },
    ],
    "2019": [
        // United Arab Emirates
        { name: "Abu Dhabi", coords: [24.4539, 54.3773], image: "abu-dhabi.webp", post: "2019-11-28-uae.html#dubai", date: "Nov, 2019" },
        { name: "Dubai", coords: [25.2048, 55.2708], image: "dubai.webp", post: "2019-11-28-uae.html#abu-dhabi", date: "Nov, 2019" },
    ],
    "2018": [
        { name: "Sikkim", coords: [27.5330, 88.5122], image: "sikkim.webp", date: "Nov, 2018" },
        { name: "Darjeeling", coords: [27.0410, 88.2663], image: "darjeeling.webp", date: "Nov, 2018" },
        { name: "Gokarna", coords: [14.5479, 74.3188], image: "gokarna.webp", date: "Feb, 2018" },
    ],
    "2017": [
        { name: "Kodaikanal", coords: [10.2381, 77.4892], image: "kodaikanal.webp", date: "Oct, 2017" },
        { name: "Amritsar", coords: [31.6340, 74.8723], image: "amritsar.webp", date: "March, 2017" },
        { name: "Jodhpur", coords: [26.2389, 73.0243], image: "jodhpur.webp", date: "Jan, 2017" },
        { name: "Jaisalmer", coords: [26.9157, 70.9083], image: "jaisalmer.webp", date: "Jan, 2017" },
        { name: "Mount Abu", coords: [24.5926, 72.7156], image: "mount-abu.webp", date: "Jan, 2017" },
        { name: "Udaipur", coords: [24.5854, 73.7125], image: "udaipur.webp", date: "Jan, 2017" },
        { name: "Chittorgarh", coords: [24.8829, 74.6230], image: "chittorgarh.webp", date: "Jan, 2017" },
    ],
    "2016": [
        { name: "Wayanad", coords: [11.6854, 76.1320], image: "wayanad.webp", date: "Dec, 2016" },
        { name: "Mahabaleshwar", coords: [17.9307, 73.6477], image: "mahabaleshwar.webp", date: "June, 2016" },
        { name: "Pune", coords: [18.5204, 73.8567], image: "pune.webp", date: "June, 2016" },
    ],
    "2015": [
        { name: "Shimla", coords: [31.1048, 77.1734], image: "shimla.webp", date: "Jan, 2015" },
        { name: "Nainital", coords: [29.3919, 79.4542], image: "nainital.webp", date: "Oct, 2015" },
        { name: "Rishikesh", coords: [30.0869, 78.2676], image: "rishikesh.webp", date: "Nov, 2015" },
    ],
}

var citiesCoords = [];
for (var item in visitedCities) {
    citiesCoords.push(...visitedCities[item])
};

// load world map
var worldMapData = JSON.parse(loadFileAjaxSync("/assets/maps/world-map.json"));
jsVectorMap.addMap("world_merc", worldMapData);

var isMarkersAdded = true;
var map = new jsVectorMap({
    selector: "#map",
    map: "world_merc",
    focusOn: {
        regions: ['IN', 'RS', 'VN'],
        animate: true
    },
    regionStyle: {
        initial: {
            fill: '#d6d6d6',
            strokeWidth: 1.5,
            fillOpacity: 1,
        },
        selected: { fill: '#707070' },
        hover: { fill: '#8a8a8a' },
    },
    selectedRegions: visitedCountries,
    markers: citiesCoords,
    markerStyle: {
        initial: {
            strokeWidth: 3,
        },
        hover: {},
        selected: {},
        selectedHover: {}
    },
    onLoaded(map) {
        onMapLoaded(map);
    }
});

function onMapLoaded(map) {
    window.addEventListener('resize', () => {
        map.updateSize()
    });

    var markerBtn = document.getElementById("marker-btn");
    markerBtn.addEventListener("click", () => {
        toggleMarkers(markerBtn);
    });

    addPlaces();
};

function toggleMarkers(markerBtn) {
    isMarkersAdded = !isMarkersAdded;

    if (isMarkersAdded) {
        map.addMarkers(citiesCoords);
        markerBtn.innerHTML = "Hide Cities";
    } else {
        map.removeMarkers();
        markerBtn.innerHTML = "Display Cities";
    }
};

function addPlaces() {
    var countryContainer = document.getElementById("places-container");
    const cities = Object.keys(visitedCities).sort().reverse();

    cities.forEach(yearTravel => {
        var countryDiv = document.createElement("div");

        // add heading
        var heading = document.createElement("h2");
        heading.id = yearTravel.toLowerCase();
        heading.innerHTML = "<b>" + yearTravel + "</b>";
        countryDiv.appendChild(heading);

        // add its cities
        var citiesDiv = document.createElement("div");
        citiesDiv.classList.add("cities-container");
        visitedCities[yearTravel].forEach((city) => {
            var cityDiv = document.createElement("div");
            cityDiv.classList.add("img-city");

            // add image
            var cityImg = document.createElement("img");
            cityImg.src = "/assets/images/travel/home/" + city["image"];
            cityImg.alt = city["name"];
            cityImg.width = 325;
            cityImg.height = 325;
            cityDiv.appendChild(cityImg);

            // add city heading
            var headingDiv = document.createElement("div");
            headingDiv.classList.add("img-city-header");

            var locationTag = document.createElement("img");
            locationTag.src = "/assets/images/location.svg";
            locationTag.alt = "location-icon";
            locationTag.width = 16;
            locationTag.height = 16;
            headingDiv.appendChild(locationTag);

            var locationName = document.createElement("div");
            locationName.innerHTML = city["name"] + " - " + city["date"];
            headingDiv.appendChild(locationName);


            cityDiv.appendChild(headingDiv);
            citiesDiv.appendChild(cityDiv);

            cityDiv.addEventListener("click", () => {
                if (city["post"]) {
                    window.location = "/posts/travel/" + city["post"];
                } else {
                    snackbar("No Travel Log for " + city["name"]);
                }
            })
        });
        countryDiv.appendChild(citiesDiv);

        countryContainer.appendChild(countryDiv);
        countryContainer.appendChild(document.createElement("br"));
    });
};
