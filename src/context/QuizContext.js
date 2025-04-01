import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();
const TIME_PER_QUESTION = 30;
const initialState = {
  questions: [],
  status: "Loading",
  //? 1 it can be loading, error, active, finished
  index: 0,
  //?2 to show question one by as we need to keep track of it , so we use state
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
  //5 here set seconds null initially cox we have to set it for acc to question
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * TIME_PER_QUESTION,
        // 6. here when its active , we get question array and for per question we gave 30 seconds and putting capital variable here , its convention
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
        //?3 this is how we do complex states in reducer and it should be there not inside the component
        // the points should be here in newAnswer
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "active",
      };
    //4. this will reset everything back to initial state but need to preserve the question and status should be in active not ready state//
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
        // 5. won't let it go to below zero
      };
    default:
      throw new Error("Action Unknown");
  }
}
function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const totalQuestions = questions.length;
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({ type: "dataReceived", payload: data });
      })
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  const totalPoints = questions.reduce((prev, curr) => prev + curr.points, 0);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highScore,
        secondsRemaining,
        dispatch,
      }}
    >
      {/* In this application, dispatch is being passed as part of the value in the QuizContext.Provider so that any component consuming the context can directly dispatch actions to update the state. This approach provides flexibility and allows child components to trigger state updates without needing to define additional functions in the context provider. */}
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (!context || context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}

export { QuizProvider, useQuiz };
