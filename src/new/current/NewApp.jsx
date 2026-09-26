import MatchingGame from "./components/MatchingGame";

function NewApp({ onBack }) {
  return (
    <MatchingGame onBack={onBack} />
  );
}

export default NewApp;