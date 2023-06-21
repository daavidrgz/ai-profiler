export function formatBytes(bytes: number, decimals = 2) {
	if (!+bytes) return '0 Bytes'

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function formatTime(millis: number) {
	const seconds = Math.floor(millis / 1000)
	const millisecondsLeft = millis % 1000

	if (seconds < 60) return `${seconds}.${millisecondsLeft} s`

	const minutes = Math.floor(seconds / 60)
	const secondsLeft = seconds % 60

	if (minutes < 60) return `${minutes}m ${secondsLeft}.${millisecondsLeft} s`

	const hours = Math.floor(minutes / 60)
	const minutesLeft = minutes % 60

	return `${hours}h ${minutesLeft}m ${secondsLeft}.${millisecondsLeft} s`
}
