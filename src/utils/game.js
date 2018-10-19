const decode = (game) => {
  const data = atob(game.data)
  const [ name, board, state, player1Key, player2Key ] = data.split(',')

  return {
    address: game.address,
    name,
    board,
    state,
    player1Key,
    player2Key,
  }
}

const utils = {
  decode,
}

export default utils