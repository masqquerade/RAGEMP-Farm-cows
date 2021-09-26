// --------------------------

mp.events.addCommand('pos', (player) => {
    let pos = player.position
    console.log(`${pos.x.toFixed(3)}, ${pos.y.toFixed(3)}, ${pos.z.toFixed(3)}`)
})

mp.events.add('playerReady', (player) => {
    player.position = new mp.Vector3(2022.142, 4977.518, 41.233)
    player.call('loadPeds')
})

mp.events.addCommand('anim', (player, _, anim) => {
    player.playScenario(anim)
})

// --------------------------
let status = true

let colshape = mp.colshapes.newSphere(2022.142, 4977.518, 41.233, 2, 0)
mp.markers.new(2, new mp.Vector3(2022.142, 4977.518, 41.233), 1,
    {
        visible: true,
        dimension: 0
    })

function playerEnterColshapeHandler(player, shape) {
    if (status) {
        if (shape == colshape) {
            player.call('startWork::client')
        }
    } else if (!status) {
        if (shape == colshape) {
            player.outputChatBox('Уволиться решил? Хрен тебе! Иди работай, огузок!! :D') // ПЕРЕДЕЛАТЬ :DDD
        }
    }
}

mp.events.add('playerEnterColshape', playerEnterColshapeHandler)

// --------------------------

mp.events.add('startWork::server', (player) => {
    status = false
    player.notify('Вы устроились на работу.')
    player.farmWork = 3
    player.outputChatBox('Отправляйтесь к коровам, подоите их.')
})

mp.events.add('endWork::server', (player) => {
    player.notify('Вы завершили работу.')
    player.farmWork = 0
    status = true
})

mp.events.add('setAnimation::server', (player, state, type) => {
    if (parseInt(type) == 1 && state) {
        player.playScenario('WORLD_HUMAN_BUM_WASH')
    } else if (parseInt(type) == 1 && !state) {
        player.stopAnimation()
    } else if (parseInt(type) == 2 && state) {
        player.playScenario('PROP_HUMAN_PARKING_METER')
    } else if (parseInt(type) == 2 && !state) {
        player.stopAnimation()
    }

})

