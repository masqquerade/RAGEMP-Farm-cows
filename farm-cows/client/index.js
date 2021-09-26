let currentWork = 0
var indexx = 0
let localPlayer = mp.players.local
let cowPos = [
    { x: 2122.831, y: 5030.790, z: 42.142 },
    { x: 2118.605, y: 5020.835, z: 41.746 },
    { x: 2106.699, y: 5018.898, z: 41.557 },
    { x: 2106.171, y: 5026.116, z: 41.536 }
]

let cowWork = {

    cowPositions: [
        { x: 2122.831, y: 5030.790, z: 42.142 },
        { x: 2118.605, y: 5020.835, z: 41.746 },
        { x: 2106.699, y: 5018.898, z: 41.557 },
        { x: 2106.171, y: 5026.116, z: 41.536 }
    ],

    storagePosition: [
        { x:2157.575, y: 5017.376, z: 41.526 }
    ],

    cowColshape: null,
    cowMarker: null,
    cowBlip: null,
    idx: indexx,

    cowStorageColshape: null,
    cowStorageBlip: null,
    cowStorageMarker: null,

    CowWork() {
        let points = this.cowPositions
        if (this.idx < points.length) {
            this.cowColshape = mp.colshapes.newSphere(points[this.idx].x, points[this.idx].y, points[this.idx].z, 1, 0)
            this.cowMarker = mp.markers.new(1, new mp.Vector3(points[this.idx].x, points[this.idx].y, points[this.idx].z - 1), 1, {
                color: [44, 128, 239, 150]
            })
            this.cowBlip = mp.blips.new(1, new mp.Vector3(points[this.idx].x, points[this.idx].y, points[this.idx].z),
                {
                    name: 'Корова',
                    scale: 1,
                    color: [44, 128, 239, 150],
                    dimension: 0,
                })
            
            this.idx++
        } else {
            let point = this.storagePosition
            this.cowStorageColshape = mp.colshapes.newSphere(point[0].x, point[0].y, point[0].z, 1, 0)
            this.cowStorageMarker = mp.markers.new(1, new mp.Vector3(point[0].x, point[0].y, point[0].z - 1), 1, {
                color: [44, 128, 239, 150]
            })
            this.cowStorageBlip = mp.blips.new(304, new mp.Vector3(point[0].x, point[0].y, point[0].z),
            {
                name: 'Хранилище',
                scale: 1,
                color: 73,
                dimension: 0,
            })
        }
    },

    EnterColshape(shape) {
        if (shape == this.cowColshape) {
            mp.events.callRemote('setAnimation::server', true, 1)
            setTimeout(() => {
                mp.events.callRemote('setAnimation::server', false, 1)
                this.cowColshape.destroy()
                this.cowMarker.destroy()
                this.cowBlip.destroy()
                this.CowWork()
            }, 5000)
        } else if (shape == this.cowStorageColshape) {
            this.idx = 0
            mp.events.callRemote('setAnimation::server', true, 2)
            setTimeout(() => {
                mp.events.callRemote('setAnimation::server', false, 2)
                this.cowStorageColshape.destroy()
                this.cowStorageMarker.destroy()
                this.cowStorageBlip.destroy()
                mp.events.callRemote('endWork::server')
            }, 5000)
        }
    },
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

mp.events.add('loadPeds', () => {
    for(let i = 0; i < cowPos.length; i++) {
        mp.peds.new(0xFCFA9E1E, new mp.Vector3(cowPos[i].x, cowPos[i].y, cowPos[i].z), getRandomInt(300), localPlayer.dimension);
    }
})

mp.events.add('startWork::client', () => {
    mp.gui.chat.push('started')
    mp.events.callRemote('startWork::server')
    cowWork.CowWork()
})

mp.events.add('playerEnterColshape', (shape) => {
    cowWork.EnterColshape(shape)
})
