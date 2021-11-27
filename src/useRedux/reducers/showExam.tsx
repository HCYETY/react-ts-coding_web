import { GET_EMAIL, GET_EXAM, GET_PROGRAM_EXAM } from "useRedux/constant";

const initState = { exam: 'hello'};

export default function examReducer(preState = initState, action: { type: string; lookExam: string; lookEmail: string; programExam: string; }) {
  switch(action.type) {
    case GET_EXAM:
      return { lookExam: action.lookExam };
      case GET_EMAIL:
        return { lookEmail: action.lookEmail };
        case GET_PROGRAM_EXAM:
          return { programExam: action.programExam };
    default:
      return preState;
  }
}