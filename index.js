#! /usr/bin/env node
const IconService = require('icon-sdk-js')
const ora = require('ora')
const cluster = require('cluster')
const CPUs = require('os').cpus()
const argv = require('yargs')
    .alias('i', 'input')
    .argv

let input = argv.input ? argv.input.toString().toLowerCase() : '', tries = 0, msg

const newWallet = () => {
    const wallet = IconService.IconWallet.create()
    return { address: wallet.getAddress(), privateKey: wallet.getPrivateKey() }
}

const isHex = (a) => !a.length ? true : (/^[0-9a-f]+$/g).test(a)

const testWallet = (a, callback) => {
    let wallet = newWallet()
    while (!(wallet.address.substr(2, a.length) === a)) {
        callback()
        wallet = newWallet()
    }
    return wallet
}

const exitHandler = () => {
    for (let id in cluster.workers) cluster.workers[id].process.kill()
    process.exit()
}

if (cluster.isMaster) {
    input.length > 40
    ? (console.log('%s is too long',input), process.exit(9))
    : input === 'true'
    ? (console.log('you forgot something'), process.exit(9))
    : !isHex(input)
    ? (console.log('%s is not a hex. Please use [0-9][a-f]',input), process.exit(9))
    : msg = ora('let\'s get it started').start()
    
    for (let i = 0; i < CPUs.length; i++) {
        proc = cluster.fork({input})
        proc.on('message', data => {
            data.wallet
            ? (msg.info("Address:"+data.wallet.address),
               msg.info("Private Key:"+data.wallet.privateKey),
               msg.succeed("Success!"),
               exitHandler())
            : data.trying? tries++ : tries=0
        })
    }
    setInterval(()=>{msg.text = "TESTs: " + tries + "/s";tries = 0},1000)
} else {
    const cycle = process.env
    while (true) {
        process.send({wallet: testWallet(cycle.input, () => process.send({trying: true}))})
    }
}
process.stdin.resume()
process.on('exit', exitHandler.bind(null,{}))
process.on('SIGINT', exitHandler.bind(null, {}))
process.on('SIGUSR1', exitHandler.bind(null, {}))
process.on('SIGUSR2', exitHandler.bind(null, {}))
process.on('uncaughtException', exitHandler.bind(null, {}))
