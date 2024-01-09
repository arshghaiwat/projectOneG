document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([21.149835, 439.086456], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    var drawnLayer = new L.FeatureGroup().addTo(map);

    var drawControl = new L.Control.Draw({
        draw: {
            polyline: true,
            polygon: false,
            marker: false,
            circlemarker: false,
            circle: false,
            rectangle: false,
        },
        edit: {
            featureGroup: drawnLayer,
        }
    });
    map.addControl(drawControl);

    document.getElementById('addHighwayBtn').addEventListener('click', function () {
        map.addLayer(drawnLayer);
        drawnLayer.clearLayers();
        drawControl._toolbars.draw._modes.polyline.handler.enable();
    });

    document.getElementById('deleteHighwayBtn').addEventListener('click', function () {
        map.addLayer(drawnLayer);
        drawnLayer.clearLayers();
        drawControl._toolbars.edit._modes.remove.handler.enable();
    });

    map.on('draw:created', function (e) {
        var type = e.layerType;
        var layer = e.layer;

        if (type === 'polyline') {
            drawnLayer.addLayer(layer);
            var highwayName = prompt('Enter highway name:');
            layer.bindPopup(highwayName);
            saveHighwayToDatabase(layer.toGeoJSON(), highwayName);
        }
    });

    map.on('draw:deleted', function (e) {
        deleteHighwayFromDatabase(e.layers.toGeoJSON());
    });

    function saveHighwayToDatabase(geoJSON, name) {
        fetch('/api/saveHighway', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ geoJSON, name }),
        });
    }

    function deleteHighwayFromDatabase(geoJSON) {
        fetch('/api/deleteHighway', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ geoJSON }),
        });
    }
});
