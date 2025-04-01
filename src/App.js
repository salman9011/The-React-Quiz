import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import WelcomeScreen from "./WelcomeScreen";
import Questions from "./Questions";
import NextButton from "./NextButton";
import ProgressBar from "./ProgressBar";
import Finish from "./Finish";
import Footer from "./Footer";
import Timer from "./Timer";
import { useQuiz } from "./context/QuizContext";
function App() {
  const { status } = useQuiz();
  // we were only using reducer , lets combine that with context to avoid prop drilling as well, and for reference check folder
  return (
    <div className="app">
      <Header />

      <Main>
        {status === "Loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <WelcomeScreen />}
        {status === "active" && (
          <>
            <ProgressBar />
            <Questions />
            <Footer>
              <Timer />
              <NextButton />
            </Footer>
          </>
        )}
        {status === "finished" && <Finish />}
      </Main>
    </div>
  );
}
export default App;
