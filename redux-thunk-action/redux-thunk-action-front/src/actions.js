import * as request from 'superagent';
const baseURL = 'http://localhost:4000';

export const SET_LIST = 'SET_LIST';

export const fetchList = (page = 1) => {
  return (dispatch) => {
    request.get(`${baseURL}/movies?page=${page}`)
      .then(response => {
        dispatch({
          type: SET_LIST,
          payload: response.body
        })
      })
  }
}

export const addMovie = (title, page = 1) => {
  return (dispatch) => {
    request.post(`${baseURL}/movies`)
      .send({ title })
      .then(() => {
        dispatch(fetchList(page));
      })
      .catch(console.error);
  }
}

export const deleteMovie = (id, page = 1) => {
  return (dispatch) => {
    request.delete(`${baseURL}/movies/${id}`)
      .then(() => {
        dispatch(fetchList(page));
      })
      .catch(console.error);
  }
}