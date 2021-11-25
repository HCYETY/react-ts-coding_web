import { GET_EXAM } from "useRedux/constant";

const initState = { exam: 'hello'};

export default function examReducer(preState = initState, action: { type: string; exam: string }) {
  switch(action.type) {
    case GET_EXAM:
      return { exam: action.exam };
    default:
      return preState;
  }
}