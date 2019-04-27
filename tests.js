
const start = new Date('2000-01-01T00:00:00');

getFormattedTime(start, new Date('2000-01-01T00:00:03')) === '3s' || oops();
getFormattedTime(start, new Date('2000-01-01T00:00:10')) === '10s' || oops();
getFormattedTime(start, new Date('2000-01-01T00:27:01')) === '27m 1s' || oops();
getFormattedTime(start, new Date('2000-01-01T00:46:59')) === '46m 59s' || oops();
getFormattedTime(start, new Date('2000-01-01T01:02:45')) === '1h 2m 45s' || oops();
getFormattedTime(start, new Date('2000-01-01T23:19:08')) === '23h 19m 8s' || oops();

function oops() {
    throw new Error('oops');
}
