var visitedCountries = ['IN', 'TR', 'NP', 'AE'];
var visitedCities = [
    // 2022
    // Turkey
    { name: "Istanbul", coords: [41.0082, 28.9784] },
    { name: "Kuşadası", coords: [37.8579, 27.2610] },
    { name: "Pamukkale", coords: [37.9137, 29.1187] },
    { name: "Antalya", coords: [36.8969, 30.7133] },
    { name: "Cappadocia", coords: [38.3535, 35.0911] },

    // 2021
    // India
    { name: "Indore", coords: [22.7196, 75.8577] },
    { name: "Spiti Valley", coords: [32.2461, 78.0349] },
    { name: "Pondicherry", coords: [11.9416, 79.8083] },
    { name: "Diu", coords: [20.7144, 70.9874] },
    { name: "Kolkata", coords: [22.5726, 88.3639] },
    
    // 2019
    // UAE
    { name: "Dubai", coords: [25.2048, 55.2708] },
    { name: "Abu Dhabi", coords: [24.4539, 54.3773] },

    // 2018
    // India
    { name: "Gokarna", coords: [14.5479, 74.3188] },
    { name: "Darjeeling", coords: [27.0410, 88.2663] },
    { name: "Sikkim", coords: [27.5330, 88.5122] },
    
    // 2017
    // India
    { name: "Chittorgarh", coords: [24.8829, 74.6230] },
    { name: "Mount Abu", coords: [24.5926, 72.7156] },
    { name: "Udaipur", coords: [24.5854, 73.7125] },
    { name: "Jaisalmer", coords: [26.9157, 70.9083] },
    { name: "Jodhpur", coords: [26.2389, 73.0243] },
    { name: "Amritsar", coords: [31.6340, 74.8723] },
    { name: "Kodaikanal", coords: [10.2381, 77.4892] },

    // 2016
    // India
    { name: "Wayanad", coords: [11.6854, 76.1320] },
    { name: "Matheran", coords: [18.9887, 73.2712] },

    // 2015
    // India
    { name: "Pune", coords: [18.5204, 73.8567] },
    { name: "Mahabaleshwar", coords: [17.9307, 73.6477] },    

]

var isMarkersAdded = true;
var map = new jsVectorMap({
    selector: "#map",
    map: "world_merc",
    focusOn: {
        regions: ['IN', 'RS'],
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
    regionLabelStyle: {
        initial: {
            fill: 'red',
            fontFamily: 'Poppins',
            fontWeight: 500,
            fontSize: 13,
        },
        hover: {fill: 'red'},
        selected: {},
        selectedHover: {}
    },
    selectedRegions: visitedCountries,
    markers: visitedCities,
    markerStyle: {
        initial: {
        //   stroke: "#676767",
        //   strokeWidth: 1,
        //   fill: '#ff5566',
          fillOpacity: 1
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
    })

    var markerBtn = document.getElementById("marker-btn");
    markerBtn.addEventListener("click", () => {
        toggleMarkers(markerBtn);
    })
}

function toggleMarkers(markerBtn) {
    isMarkersAdded = !isMarkersAdded;

    if (isMarkersAdded) {
        map.addMarkers(visitedCities);
        markerBtn.innerHTML = "Hide Cities";
    } else {
        map.removeMarkers();
        markerBtn.innerHTML = "Display Cities";
    }
}
