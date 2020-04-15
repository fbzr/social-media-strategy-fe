import { axiosWithAuth } from "../utils/axiosWithAuth";
import Axios from "axios";
import CONSTANTS from "./constants";
import { v4 as uuidv4 } from "uuid";

export const login = (userData, cb) => (dispatch) => {
  dispatch({ type: CONSTANTS.USER_APICALL_START });

  Axios.post(
    `${process.env.REACT_APP_API_URL}/auth/login` ||
      "https://social-media-strategy.herokuapp.com/api/auth/login",
    userData
  )
    .then((response) => {
      dispatch({ type: CONSTANTS.USER_APICALL_SUCCESS });
      localStorage.setItem("token", response.data.token);
      cb("/");
    })
    .catch((error) => {
      dispatch({ type: CONSTANTS.USER_APICALL_FAILURE, payload: error.data });
    });
};

export const registerUser = (userData, cb) => (dispatch) => {
  dispatch({ type: CONSTANTS.USER_APICALL_START });
  Axios.post(
    `${process.env.REACT_APP_API_URL}/auth/register` ||
      "https://social-media-strategy.herokuapp.com/api/auth/register",
    userData
  )
    .then(async (response) => {
      dispatch({ type: CONSTANTS.USER_APICALL_SUCCESS });
      localStorage.setItem("token", response.data.token);
      cb("/");
      let res = await axiosWithAuth().get(`/users/user`);

      console.log(res.data.subject);
      await axiosWithAuth().post(`/topics/${res.data.subject}/user`, {
        id: `topic-${uuidv4()} topic-0`,
        title: "Drafts",
        user_id: res.data.subject,
        index: 0,
        cards: [
          {
            id: `card-${0}`,
            content:
              "This is an example of a post that you could draft. Feel free to express yourself!",
          },
        ],
      });

      // history.push("/");
    })
    .catch((error) => {
      dispatch({ type: CONSTANTS.USER_APICALL_FAILURE, payload: error.data });
      console.log("Error", error);
    });
};

export const currentUser = () => (dispatch) => {
  dispatch({ type: CONSTANTS.USER_APICALL_START });

  axiosWithAuth()
    .get(`/users/user`)
    .then((response) => {
      localStorage.setItem("CUSER", response.data.subject);

      dispatch({
        type: CONSTANTS.USER_APICALL_SUCCESS,
        currentUser: response.data,
      });
    })
    .catch((error) => {
      dispatch({ type: CONSTANTS.USER_APICALL_FAILURE, payload: error.data });
    });
};
