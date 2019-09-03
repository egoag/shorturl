const arrRemove = (arr, item) => {
  const index = arr.indexOf(item)
  if (index < 0) return arr
  return arr.slice(0, index).concat(arr.slice(index + 1))
}

export {
  arrRemove
}
