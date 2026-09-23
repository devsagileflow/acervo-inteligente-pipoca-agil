"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";

import {
  ContentType,
  FeedbackForm,
  CreateFeedbackResponseBody,
  createFeedbackResponseBodySchema,
} from "@acervo/schemas";
import { RatingControlled } from "@/components/shadcn-studio";
import { Textarea } from "@/components/ui";

type Props = {
  feedback_form: FeedbackForm;
  contentType: ContentType;
  contentId: string;
  onClose: () => void;
};

const INTERSTITIAL_AFTER_INDEX = 1;

type Phase = "question" | "interstitial";

export const RenderAPIForm = ({ feedback_form, contentType, contentId, onClose }: Props) => {
  const {
    setValue,
    getValues,
    register,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading, isSubmitSuccessful },
  } = useForm<CreateFeedbackResponseBody>({
    resolver: zodResolver(createFeedbackResponseBodySchema) as Resolver<CreateFeedbackResponseBody>,
    defaultValues: {
      contentId: contentId,
      contentType: contentType,
      answers:
        feedback_form.questions?.map((question) => ({
          questionId: question.id,
          type: question.questionType,
          isRequired: question.isRequired,
        })) || [],
    },
  });

  const questions = useMemo(
    () => [...(feedback_form.questions ?? [])].sort((a, b) => a.position - b.position),
    [feedback_form.questions],
  );

  const [phase, setPhase] = useState<Phase>("question");
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = phase === "question" ? questions[questionIndex] : null;

  const onSubmit = async (data: CreateFeedbackResponseBody) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/api/feedback-forms/${feedback_form.id}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) console.error("Failed to submit feedback form response", response);
    } catch (error) {
      console.error("An error occurred while submitting the feedback form response", error);
    }
  };

  const goToNextStep = async () => {
    const isValid = await trigger(`answers.${questionIndex}`);
    if (!isValid) return;

    if (questionIndex === questions.length - 1) {
      handleSubmit(onSubmit)();
      return;
    }

    if (questionIndex === INTERSTITIAL_AFTER_INDEX) {
      setPhase("interstitial");
      return;
    }

    setQuestionIndex((current) => current + 1);
  };

  const goToPreviousStep = () => {
    setQuestionIndex((current) => Math.max(0, current - 1));
  };

  const handleInterstitialContinue = () => {
    setPhase("question");
    setQuestionIndex(INTERSTITIAL_AFTER_INDEX + 1);
  };

  const renderQuestionInput = (question: (typeof questions)[number], index: number) => {
    switch (question.questionType) {
      case "TEXT":
        return (
          <>
            <Textarea
              placeholder="Escreva aqui sua resposta"
              className="h-24 sm:h-40 w-full text-xs sm:text-base"
              {...register(`answers.${index}.value`)}
            />
            {errors.answers?.[index]?.message && (
              <p className="mt-2 text-center text-red-500 text-xs sm:text-sm">{errors.answers[index].message}</p>
            )}
          </>
        );
      case "STARS":
        return (
          <div>
            <RatingControlled
              initialValue={
                getValues(`answers.${index}.value`) ? (getValues(`answers.${index}.value`) as number) : 0
              }
              onChange={(value) =>
                setValue(`answers.${index}`, {
                  questionId: question.id,
                  type: question.questionType,
                  value,
                  isRequired: question.isRequired,
                })
              }
              precision={1}
            />
            {errors.answers?.[index]?.message && (
              <p className="mt-2 text-center text-red-500 text-xs sm:text-sm">{errors.answers[index].message}</p>
            )}
          </div>
        );
      case "MULTIPLE_CHOICE":
        return (
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" {...register(`answers.${index}.optionIds`)} value={option.id} />
                <span className="text-sm sm:text-base">{option.label}</span>
              </label>
            ))}
          </div>
        );
      case "SINGLE_CHOICE":
        return (
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" {...register(`answers.${index}.optionId`)} value={option.id} />
                <span className="text-sm sm:text-base">{option.label}</span>
              </label>
            ))}
          </div>
        );
      case "SCALE_0_10":
        return (
          <div className="w-full px-2">
            <input type="range" min="0" max="10" className="w-full" />
          </div>
        );
      case "LIKE_DISLIKE":
        return (
          <div className="flex gap-3 justify-center">
            <button type="button" className="px-4 sm:px-6 py-2 text-sm sm:text-base">Like</button>
            <button type="button" className="px-4 sm:px-6 py-2 text-sm sm:text-base">Dislike</button>
          </div>
        );
      default:
        return null;
    }
  };

  const stepperTotal = questions.length - (INTERSTITIAL_AFTER_INDEX + 1);
  const stepperPosition = question ? questionIndex - (INTERSTITIAL_AFTER_INDEX + 1) + 1 : null;
  const showStepperCounter = stepperPosition !== null && stepperPosition >= 1;

  return (
    <div className="flex w-full px-3 sm:px-0 max-w-sm sm:max-w-125 flex-col mx-auto">
      {isSubmitSuccessful ? (
        <div className="flex flex-col items-center gap-2 sm:gap-4 rounded-2xl sm:rounded-3xl border border-amber-400/60 bg-[#0c1225] p-4 sm:p-10">
          <div className="relative w-32 h-24 sm:w-48 sm:h-44">
            <Image 
              src="/img/form-submit-successful.png" 
              alt="Feedback enviado" 
              fill
              className="object-contain"
            />
          </div>
          <p className="text-center text-sm sm:text-2xl font-bold text-[#F1F5F9]">
            Recebemos suas respostas com <span className="text-[#FBBF24]">sucesso</span>!
          </p>
          <p className="text-center text-xs sm:text-base text-[#F1F5F9]">
            Seu feedback será considerado em nossas próximas melhorias.
          </p>
          <button
            onClick={onClose}
            className="cursor-pointer mt-1 hover:bg-gradient-t-r w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[15px] border-r-2 border-b-2 border-l-2 border-[#0F172A] bg-gradient-to-r from-[#0F172A] to-[#6C3DBF] px-5 sm:px-10 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold tracking-wide text-[#FBBF24] uppercase shadow-[0_15px_40px_0_rgba(0,0,0,0.25)] transition hover:border-[#FBBF24] hover:from-[#FFFFFF] hover:to-[#FBBF24] hover:text-[#0F172A]"
          >
            <div className="flex">
              <p className="font-bold">
                CONTINUAR {contentType === "TRAIL" ? "TRILHA" : contentType === "VIDEO" ? "VÍDEO" : ""}
              </p>
            </div>
          </button>
        </div>
      ) : phase === "interstitial" ? (
        <div className="flex flex-col items-center gap-3 sm:gap-5 rounded-2xl sm:rounded-3xl border border-amber-400/60 bg-[#0c1225] p-4 sm:p-10">
          <div className="relative w-28 h-20 sm:w-40 sm:h-32">
            <Image 
              src="/img/form-submit-successful.png" 
              alt="Feedback recebido" 
              fill
              className="object-contain"
            />
          </div>
          <p className="text-center text-sm sm:text-xl font-bold text-[#F1F5F9]">
            Recebemos seu feedback com <span className="text-[#FBBF24]">sucesso</span>!
          </p>
          <p className="text-center text-xs sm:text-base text-[#F1F5F9]">
            Ajude-nos a melhorar respondendo a {stepperTotal} perguntas rápidas sobre sua experiência.
          </p>
          <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <button 
              onClick={onClose} 
              className="cursor-pointer w-full sm:w-auto rounded-4xl border border-[#FBBF24] px-3 sm:px-6 py-1.5"
            >
              <span className="font-bold text-xs sm:text-sm text-[#FBBF24]">CONTINUAR TRILHA</span>
            </button>
            <button
              onClick={handleInterstitialContinue}
              className="cursor-pointer w-full sm:w-auto hover:bg-gradient-t-r inline-flex items-center justify-center gap-2 rounded-[15px] border-r-2 border-b-2 border-l-2 border-[#0F172A] bg-gradient-to-r from-[#0F172A] to-[#6C3DBF] px-5 sm:px-10 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold tracking-wide text-[#FBBF24] uppercase shadow-[0_15px_40px_0_rgba(0,0,0,0.25)] transition hover:border-[#FBBF24] hover:from-[#FFFFFF] hover:to-[#FBBF24] hover:text-[#0F172A]"
            >
              <span className="font-bold">RESPONDER</span>
            </button>
          </div>
        </div>
      ) : question ? (
        <div className="flex flex-col gap-3 sm:gap-6 rounded-2xl sm:rounded-3xl border border-amber-400/60 bg-[#0c1225] p-4 sm:p-10">
          {showStepperCounter && (
            <span className="text-center text-xs sm:text-sm text-white/60">
              {stepperPosition}/{stepperTotal}
            </span>
          )}

          <div className="flex flex-col items-center gap-2 sm:gap-6">
            <div className="relative w-9 h-9 sm:w-14 sm:h-14">
              <Image 
                src="/svg/fi-rr-comment.svg" 
                alt="Feedback" 
                fill
                className="object-contain"
              />
            </div>

            {questionIndex === 0 ? (
              <div className="flex w-full items-center justify-center rounded-tr-2xl sm:rounded-tr-3xl rounded-b-2xl sm:rounded-b-3xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-1">
                <div className="flex w-full items-center justify-center rounded-tr-2xl sm:rounded-tr-3xl rounded-b-2xl sm:rounded-b-3xl bg-[#0F172A]">
                  <p className="px-3 sm:px-8 py-2 sm:py-5 text-center text-xs sm:text-xl font-bold text-[#F1F5F9]">
                    {question.label}
                    {question.isRequired ? <span className="text-[#FBBF24]">*</span> : null}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center text-xs sm:text-xl text-[#F1F5F9] px-2">
                {question.label}
                {question.isRequired ? <span className="text-[#FBBF24]">*</span> : null}
              </p>
            )}
          </div>

          <div className="px-1 sm:px-0">
            {renderQuestionInput(question, questionIndex)}
          </div>

          <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {questionIndex > INTERSTITIAL_AFTER_INDEX + 1 ? (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="cursor-pointer w-full sm:w-auto rounded-4xl border border-[#FBBF24] px-4 sm:px-6 py-2"
              >
                <span className="font-bold text-xs sm:text-sm text-[#FBBF24]">VOLTAR</span>
              </button>
            ) : (
              <span className="hidden sm:block" />
            )}

            <button
              type="button"
              onClick={goToNextStep}
              disabled={isSubmitting || isLoading}
              className="cursor-pointer w-full sm:w-auto hover:bg-gradient-t-r inline-flex items-center justify-center gap-3 rounded-[15px] border-r-2 border-b-2 border-l-2 border-[#0F172A] bg-gradient-to-r from-[#0F172A] to-[#6C3DBF] px-6 sm:px-10 py-2 sm:py-2.5 text-xs sm:text-sm font-bold tracking-wide text-[#FBBF24] uppercase shadow-[0_15px_40px_0_rgba(0,0,0,0.25)] transition hover:border-[#FBBF24] hover:from-[#FFFFFF] hover:to-[#FBBF24] hover:text-[#0F172A]"
            >
              <span className="font-bold">
                {isSubmitting || isLoading
                  ? "ENVIANDO..."
                  : questionIndex === questions.length - 1
                    ? "ENVIAR FEEDBACK"
                    : questionIndex <= INTERSTITIAL_AFTER_INDEX
                      ? "ENVIAR FEEDBACK"
                      : "PRÓXIMA"}
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};