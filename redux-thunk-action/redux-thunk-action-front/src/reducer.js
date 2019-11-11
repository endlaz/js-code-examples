import { SET_LIST } from './actions'

const initailState = {
  count: 0,
  pages: 1,
  rows: []
}
const reducer = (state = initailState, action = {}) => {
  switch (action.type) {
    case SET_LIST:
      return {...state, ...action.payload}
    default:
      return state;
  }
}

export default reducer
