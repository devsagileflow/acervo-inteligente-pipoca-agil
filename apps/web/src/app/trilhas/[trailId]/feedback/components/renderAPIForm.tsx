"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
};

export const RenderAPIForm = ({ feedback_form, contentType, contentId }: Props) => {
  const router = useRouter();
  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading, isSubmitSuccessful },
  } = useForm<CreateFeedbackResponseBody>({
    resolver: zodResolver(createFeedbackResponseBodySchema) as Resolver<CreateFeedbackResponseBody>,
    defaultValues: {
      contentId: contentId,
      contentType: contentType,
      answers: feedback_form.questions?.map((question) => ({
        questionId: question.id,
        type: question.questionType,
        value: question.questionType === "STARS" ? 0 : "",
        isRequired: question.isRequired,
      })) as CreateFeedbackResponseBody["answers"],
    },
  });

  console.log("errors:", errors);

  const onSubmit = async (data: CreateFeedbackResponseBody) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-30 flex max-w-250 flex-col items-center justify-center gap-8"
    >
      {false && !isSubmitSuccessful ? (
        <>
          {feedback_form.questions
            ?.sort((a, b) => a.position - b.position)
            .map((question, index) => (
              <div key={index} className="flex w-full flex-col gap-4">
                {index === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-12">
                    <Image src={"/svg/fi-rr-comment.svg"} alt={"Feedback"} width={80} height={80} />
                    <div className="flex w-full items-center justify-center rounded-tr-3xl rounded-b-3xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-1">
                      <div className="flex w-full items-center justify-center rounded-tr-3xl rounded-b-3xl bg-[#0F172A]">
                        <p className="px-20 py-8 text-center text-3xl font-bold text-[#F1F5F9]">
                          {question.label}
                          {question.isRequired ? <span className="text-[#FBBF24]">*</span> : null}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full rounded-tr-3xl rounded-b-3xl bg-[#0F172A]">
                    <p className="text-3xl text-[#F1F5F9]">
                      {question.label}
                      {question.isRequired ? <span className="text-[#FBBF24]">*</span> : null}
                    </p>
                  </div>
                )}
                {(question.questionType === "LIKE_DISLIKE" && (
                  <div>
                    <button>Like</button>
                    <button>Dislike</button>
                  </div>
                )) ||
                  (question.questionType === "TEXT" && (
                    <>
                      <Textarea
                        placeholder="Escreva aqui sua resposta"
                        className="h-68 text-4xl"
                        {...register(`answers.${index}.value`)}
                      />
                      {errors.answers?.[index]?.message && (
                        <p className="mt-2 text-center text-red-500">
                          {errors.answers[index].message}
                        </p>
                      )}
                    </>
                  )) ||
                  (question.questionType === "MULTIPLE_CHOICE" && (
                    <div>
                      {question.options?.map((option, optionIndex) => (
                        <label key={optionIndex}>
                          <input
                            type="radio"
                            {...register(`answers.${index}.optionIds`)}
                            value={option.id}
                          />
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
                          <input
                            type="radio"
                            {...register(`answers.${index}.optionId`)}
                            value={option.id}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  )) ||
                  (question.questionType === "STARS" && (
                    <div>
                      <RatingControlled
                        initialValue={
                          getValues(`answers.${index}.value`)
                            ? (getValues(`answers.${index}.value`) as number)
                            : 0
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
                        <p className="mt-2 text-center text-red-500">
                          {errors.answers[index].message}
                        </p>
                      )}
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
            width={415}
            height={368}
          />
          <p className="text-3xl font-bold text-[#F1F5F9]">
            Recebemos seu feedback com <span className="text-[#FBBF24]">sucesso</span>!
          </p>
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer rounded-4xl bg-linear-to-r from-[#FFF9E9] to-[#FBBF24] p-1"
          >
            <div className="flex items-center justify-center rounded-4xl bg-[#0F172A]">
              <p className="px-22 py-4 text-xl font-bold text-[#FBBF24]">
                CONTINUAR{" "}
                {contentType === "TRAIL" ? "TRILHA" : contentType === "VIDEO" ? "VÍDEO" : ""}
              </p>
            </div>
          </button>
        </div>
      )}
    </form>
  );
};
