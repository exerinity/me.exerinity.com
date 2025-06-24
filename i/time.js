function up() {
    const now = new Date();
    const dow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const moy = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const ft = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
    const offset = -now.getTimezoneOffset() / 60;
    const sign = offset >= 0 ? '+' : '-';
    const abs = Math.abs(offset);
    const str = `${sign}${abs}`;
    const fd = `<strong>${dow[now.getDay()]}</strong>, ${moy[now.getMonth()]} ${now.getDate()}${gds(now.getDate())} ${now.getFullYear()} UTC${str}`;
    document.getElementById("time").innerHTML = `The time right now is <strong>${ft}</strong>. It's ${fd}`;
}

function gds(day) {
    if (day >= 11 && day <= 13) {
        return 'th';
    }
    const ldg = day % 10;
    switch (ldg) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

setInterval(up, 1000);
up();