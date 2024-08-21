const socket = io('https://real-time-backend-production.up.railway.app');
if(navigator.geolocation){
navigator.geolocation.watchPosition((position)=>{
    const {latitude, longitude} = position.coords;
    socket.emit('send-location', {latitude, longitude})
},
(error)=>{
    console.log(error)
},{
    enableHighAccuracy :true,
     timeout: 200,
     maximumAge : 0
}

)

}
const map =  L.map("map").setView([0,0], 10)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution : "Sheryians Coding School"
}).addTo(map)
const markers = {}

socket.on("recive-data", (data)=>{
    const {id, latitude, longitude} = data
    map.setView([latitude, longitude], 16)
    if(markers[id]){
            markers[id].setLatLng([latitude, longitude])
    }else{
        markers[id] = L.marker([latitude, longitude]).addTo(map)
    }
})

socket.on("user-disconnect", (id) =>{
    if(markers[id]){
    map.removeLayer(markers[id])
    delete markers[id]
    }
})
