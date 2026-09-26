import jsPDF from "jspdf";

const generateQuizPDF = (questions, numQuestions = 6) => {
  const doc = new jsPDF();
  doc.setFont("Comic Sans MS", "normal");

  const selectedQuestions = questions.slice(0, numQuestions);
  let y = 30;
  let qPerPage = 3;
  let questionCount = 0;

  selectedQuestions.forEach((q, idx) => {
    if (questionCount === qPerPage) {
      doc.addPage();
      y = 30;
      questionCount = 0;
    }

    doc.setFontSize(16);
    doc.text(`${idx + 1}. ${q.question}?`, 20, y);
    y += 10;

    q.options.forEach((opt, i) => {
      doc.text(`${String.fromCharCode(65 + i)}) ${opt}`, 30, y);
      y += 10;
    });

    y += 10;
    questionCount++;
  });

  doc.save("Number_Sense_Quiz_Worksheet.pdf");
};

export default generateQuizPDF;
