"use client";

import {
  ContentType,
  FeedbackForm,
  FeedbackResponse,
  feedbackResponseSchema,
} from "@acervo/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { Resolver, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui";

type Props = {
  form: FeedbackForm;
  content: ContentType;
  contentId: string;
};

export const RenderAPIForm = ({ form, content, contentId }: Props) => {
  const router = useRouter();
  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading, isSubmitSuccessful },
  } = useForm<FeedbackResponse>({
    resolver: zodResolver(feedbackResponseSchema) as Resolver<FeedbackResponse>,
  });

  const onSubmit = async (data: FeedbackResponse) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!isSubmitSuccessful ? (
        <>
          {form.questions
            ?.sort((a, b) => a.position - b.position)
            .map((question, index) => (
              <div key={index}>
                <div className="m-8 flex items-center justify-center rounded-tr-3xl rounded-b-3xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-1">
                  <div className="flex w-full items-center justify-center rounded-tr-3xl rounded-b-3xl bg-[#0F172A]">
                    <p className="px-6 py-3 text-center text-3xl text-[#F1F5F9]">
                      {question.label}
                      {question.isRequired ? <span className="text-[#FBBF24]">*</span> : null}
                    </p>
                  </div>
                </div>
                {(question.questionType === "LIKE_DISLIKE" && (
                  <div>
                    <button>Like</button>
                    <button>Dislike</button>
                  </div>
                )) ||
                  (question.questionType === "TEXT" && <Textarea />) ||
                  (question.questionType === "MULTIPLE_CHOICE" && (
                    <div>
                      {question.options?.map((option, optionIndex) => (
                        <label key={optionIndex}>
                          <input type="radio" name={`question-${index}`} value={option.id} />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  )) ||
                  (question.questionType === "SCALE_0_10" && (
                    <div>
                      <input type="range" min="0" max="10" />
                    </div>
                  )) ||
                  (question.questionType === "SINGLE_CHOICE" && (
                    <div>
                      {question.options?.map((option, optionIndex) => (
                        <label key={optionIndex}>
                          <input type="radio" name={`question-${index}`} value={option.id} />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  )) ||
                  (question.questionType === "STARS" && (
                    <div>
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <button key={starIndex}>{starIndex + 1} Star</button>
                      ))}
                    </div>
                  ))}
              </div>
            ))}
          <button
            className="h-10 w-64 cursor-pointer rounded-4xl bg-linear-to-r from-[#0F172A] to-[#6C3DBF]"
            type="submit"
            disabled={isSubmitting || isLoading}
          >
            <span className="font-bold text-[#FBBF24]">
              {isSubmitting || isLoading ? "ENVIANDO..." : "ENVIAR FEEDBACK"}
            </span>
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <Image
            src="/img/form-submit-successful.png"
            alt="Form submit successful"
            width={200}
            height={200}
          />
          <p className="text-3xl font-bold">
            Recebemos seu feedback com <span className="text-[#FBBF24]">sucesso</span>!
          </p>
          <button
            onClick={() => router.push("/")}
            className="rounded-2xl bg-linear-to-r from-[#FFF9E9] to-[#FBBF24] p-1"
          >
            <div className="flex h-10 w-64 items-center justify-center rounded-2xl bg-[#0F172A]">
              <p className="font-bold text-[#FBBF24]">
                CONTINUAR {content === "TRAIL" ? "TRILHA" : content === "VIDEO" ? "VÍDEO" : ""}
              </p>
            </div>
          </button>
        </div>
      )}
    </form>
  );
};
