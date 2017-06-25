const q = document.querySelector.bind(document)

var interval;
const checkIpAddress = (times) => {
    times = times || 10
    var i = 0
    if (interval) {
        clearInterval(interval)
        interval = undefined
    }
    interval = setInterval(() => {
        fetch('https://ipinfo.io/json')
            .then(res => res.json())
            .then(json => {
                q('.info-text').innerText = `${json.ip}/${json.country} (${i})`
                q('.info').classList = 'info info-success'
            })
            .catch(e => {
                q('.info').classList = 'info info-failure'
            })
        i += 1
        if (i > times - 1) {
            clearInterval(interval)
        }
    }, 2500)
}

[{ el: q('.btn-us'), profile: 'US' },
{ el: q('.btn-us2'), profile: 'US2' },
{ el: q('.btn-fr'), profile: 'FR' },
{ el: q('.btn-gb'), profile: 'GB' }].forEach(it => {
    const { el, profile } = it
    el.addEventListener('click', () => {
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profile: profile
            })
        })
            .then(res => res.json())
            .then(json => {
                if (json && json.status && json.status === 'error') {
                    return Promise.reject('error')
                }
                q('.info-text').innerText = `${json && json.profile || 'unknown'}`
                q('.info').classList = 'info info-success'
                checkIpAddress()
            })
            .catch(e => {
                q('.info').classList = 'info info-failure'
            })
    })
})

q('.btn-kill').addEventListener('click', () => {
    fetch('/kill', {
        method: 'POST'
    })
        .then(res => res.json())
        .then(json => {
            if (json && json.status && json.status === 'error') {
                return Promise.reject('error')
            }
            q('.info-text').innerText = `${json && json.profile || 'unknown'}`
            q('.info').classList = 'info info-success'
            checkIpAddress()
        })
        .catch(e => {
            q('.info').classList = 'info info-failure'
        })
})

q('.btn-check').addEventListener('click', () => {
    checkIpAddress()
})

checkIpAddress(1)