export const normalizeIpfsHash = (hash) => {
  if (hash.includes("ipfs://")) {
    return "https://ipfs.rarible.com/ipfs/" + hash.slice(7)
  } else {
    return hash
  }
}
export const commas = (x) => {
  return parseFloat(x).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

Number.prototype.toFixedNoRounding = function (n) {
  const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g")
  const a = this.toString().match(reg)[0]
  const dot = a.indexOf(".")
  if (dot === -1) {
    // integer, insert decimal dot and pad up zeros
    return a + "." + "0".repeat(n)
  }
  const b = n - (a.length - dot) + 1
  return b > 0 ? a + "0".repeat(b) : a
}

export const bytesToSize = (bytes) => {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  if (bytes == 0) return "0 Byte"
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i]
}
