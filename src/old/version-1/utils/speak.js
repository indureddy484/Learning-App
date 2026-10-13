export function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN"; // English (India)
  utterance.rate = 0.45;    // Slower for child-like feel
  utterance.pitch = 1.8;    // Higher pitch for cartoon tone
  speechSynthesis.speak(utterance);
}
