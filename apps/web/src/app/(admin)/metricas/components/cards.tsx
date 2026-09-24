import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui";
import { FeedbackForm, FeedbackResponse } from "@acervo/schemas";

type Props = {
  feedbackForm: FeedbackForm;
  feedbackResponses: FeedbackResponse[];
};

const FEEDBACK_QUESTION_GLOBAL_TRAIL_ID = "feedback-question-global-trail-01";

const SimpleCard = ({ title, content }: { title: string; content: React.ReactNode }) => (
  <div className="max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
    <h3 className="text-sm font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
      {title}
    </h3>
    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{content}</p>
  </div>
);

export const FeedbackFormCard = ({ feedbackForm, feedbackResponses }: Props) => {
  const feedbackResponsesCount = feedbackResponses?.length ?? 0;
  const { sumResponseScore, minResponseScore, maxResponseScore } = feedbackResponses.reduce(
    (acc, response) => {
      const responseScore =
        response.answers
          ?.filter((answer) => answer.questionId === FEEDBACK_QUESTION_GLOBAL_TRAIL_ID)
          .reduce((subSum, answer) => subSum + (answer.value as number), 0) ?? 0;
      acc.sumResponseScore += responseScore;
      acc.minResponseScore += responseScore <= 3 ? 1 : 0;
      acc.maxResponseScore += responseScore >= 4 ? 1 : 0;
      return acc;
    },
    { sumResponseScore: 0, minResponseScore: 0, maxResponseScore: 0 },
  );
  const averageResponseScore =
    feedbackResponsesCount > 0 ? sumResponseScore / feedbackResponsesCount : 0;
  const faq: { questionLabel: string; answers: string[] }[] =
    feedbackForm.questions
      ?.filter((question) => question.id !== FEEDBACK_QUESTION_GLOBAL_TRAIL_ID)
      .map((question) => {
        const questionAnswers = feedbackResponses
          .flatMap((response) => response.answers)
          .filter((answer) => answer && answer.questionId === question.id)
          .map((answer) => (answer && String(answer.value)) ?? "")
          .filter((answer) => answer !== "");
        return { questionLabel: question.label, answers: questionAnswers };
      }) || [];

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-muted-foreground text-xl font-bold">Resumo do Feedback</p>
      <div className="flex flex-wrap gap-4">
        <SimpleCard title="Total de respostas" content={feedbackResponsesCount} />
        <SimpleCard title="Média das avaliações" content={averageResponseScore.toFixed(1)} />
        <SimpleCard title="Avaliações baixas (<=3)" content={minResponseScore} />
        <SimpleCard title="Avaliações altas (>=4)" content={maxResponseScore} />
      </div>
      <Accordion className="lg:w-1/2" aria-label="FAQ items" multiple>
        {faq.map(({ questionLabel, answers }, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{questionLabel}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              <ul>
                {answers.map((answer, answerIndex) => (
                  <li key={answerIndex}>{answer}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
