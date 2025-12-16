"use client"

import { useState } from "react"
import { Calendar, Check } from "lucide-react"

// Components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

// Providers
import { useLanguageSession } from "@/providers/language-provider"
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Define
import { LANGUAGE_LIST } from "@/define/language"

// Entity
import { FormMaster, FormFieldType, FormAnswer, FormAnswerValue } from "@/entity/product/form"
import { SimpleChat } from "@/entity/user/user-chat"

// Components
import ImageUploadView from "@/components/common/ImageUploadView"

// Logic
import * as UserProductPageServerLogic from "@/logic/server/user/user-product-page-server-logic"

interface Props {
  productId: string
  tokenId: number
  formMaster: FormMaster
  setSimpleChat: (simpleChat: SimpleChat) => void
}

export default function FormAnswerView({ productId, tokenId, formMaster, setSimpleChat }: Props) {
  const { getLocalizedText } = useLanguageSession()
  const { onFetch } = useDialog()

  const [answers, setAnswers] = useState<{ [fieldId: string]: FormAnswerValue }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateAnswer = (fieldId: string, value: string | string[] | number, images?: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [fieldId]: {
        fieldId,
        value,
        images
      }
    }))
  }

  const renderField = (field: any) => {
    const currentAnswer = answers[field.fieldId]

    switch (field.type) {
      case FormFieldType.TEXT_SHORT:
        return (
          <Input
            placeholder={getLocalizedText(field.title)}
            value={currentAnswer?.value as string || ''}
            onChange={(e) => updateAnswer(field.fieldId, e.target.value)}
            required={field.required}
          />
        )

      case FormFieldType.TEXT_LONG:
        return (
          <Textarea
            placeholder={getLocalizedText(field.title)}
            value={currentAnswer?.value as string || ''}
            onChange={(e) => updateAnswer(field.fieldId, e.target.value)}
            required={field.required}
            className="min-h-[100px]"
          />
        )

      case FormFieldType.SELECT_SINGLE:
        return (
          <Select
            value={currentAnswer?.value as string || ''}
            onValueChange={(value) => updateAnswer(field.fieldId, value)}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder={getLocalizedText(field.title)} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case FormFieldType.SELECT_MULTIPLE:
        return (
          <div className="space-y-2">
            {field.options?.map((option: string) => {
              const selectedValues = (currentAnswer?.value as string[]) || []
              const isChecked = selectedValues.includes(option)

              return (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.fieldId}-${option}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...selectedValues, option]
                        : selectedValues.filter(v => v !== option)
                      updateAnswer(field.fieldId, newValues)
                    }}
                  />
                  <label
                    htmlFor={`${field.fieldId}-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              )
            })}
          </div>
        )

      case FormFieldType.DATE:
        const dateValue = currentAnswer?.value ? new Date(currentAnswer.value as number) : undefined

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateValue && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateValue ? format(dateValue, "PPP", { locale: ja }) : getLocalizedText(LANGUAGE_LIST.SelectDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={dateValue}
                onSelect={(date) => updateAnswer(field.fieldId, date?.getTime() || 0)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case FormFieldType.IMAGE:
        const imageUrls = (currentAnswer?.images || []) as string[]

        return (
          <div className="space-y-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <ImageUploadView
                  image={url}
                  setImage={(newUrl) => {
                    const newImages = [...imageUrls]
                    newImages[index] = newUrl
                    updateAnswer(field.fieldId, '', newImages)
                  }}
                  type="form"
                  description={getLocalizedText(LANGUAGE_LIST.UploadImage)}
                  placeholder={getLocalizedText(LANGUAGE_LIST.Or)}
                />
              </div>
            ))}

            {imageUrls.length < (field.maxImages || 1) && (
              <Button
                variant="outline"
                onClick={() => {
                  const newImages = [...imageUrls, '']
                  updateAnswer(field.fieldId, '', newImages)
                }}
              >
                {getLocalizedText(LANGUAGE_LIST.AddImage)}
              </Button>
            )}
          </div>
        )

      default:
        return <div>{getLocalizedText(LANGUAGE_LIST.UnsupportedFieldType)}: {field.type}</div>
    }
  }

  const isFormValid = () => {
    return formMaster.fields.every(field => {
      if (!field.required) return true

      const answer = answers[field.fieldId]
      if (!answer) return false

      if (field.type === FormFieldType.SELECT_MULTIPLE) {
        return (answer.value as string[]).length > 0
      }

      if (field.type === FormFieldType.IMAGE) {
        return (answer.images || []).length > 0
      }

      return answer.value !== '' && answer.value !== 0
    })
  }

  const onSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: getLocalizedText(LANGUAGE_LIST.Error),
        description: getLocalizedText(LANGUAGE_LIST.PleaseFillRequiredFields),
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await onFetch(async () => {
        const formAnswer: FormAnswer = {
          answerId: '', // サーバー側で生成
          userId: '', // サーバー側で取得
          townId: '', // サーバー側で取得
          businessId: '', // サーバー側で取得
          productId: productId,
          tokenId: tokenId,
          formId: formMaster.formId,
          values: Object.values(answers),
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        const { simpleChat } = await UserProductPageServerLogic.answerForm(productId, tokenId, formAnswer)
        setSimpleChat(simpleChat)

        toast({
          title: getLocalizedText(LANGUAGE_LIST.Success),
          description: getLocalizedText(LANGUAGE_LIST.FormSubmitted),
        })
      })
    } catch (error) {
      toast({
        title: getLocalizedText(LANGUAGE_LIST.Error),
        description: getLocalizedText(LANGUAGE_LIST.FailedToSubmitForm),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{getLocalizedText(formMaster.title)}</h3>
        <p className="text-sm text-gray-600 mb-4">{getLocalizedText(formMaster.description).split("\n").map((line, index) => (
          <span key={index}>{line}<br /></span>
        ))}</p>
        <div className="space-y-4">
          {formMaster.fields.map((field) => (
            <div key={field.fieldId} className="space-y-2">
              <label className="text-sm font-medium">
                {getLocalizedText(field.title)}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={onSubmit}
            disabled={!isFormValid() || isSubmitting}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {isSubmitting ? getLocalizedText(LANGUAGE_LIST.Submitting) : getLocalizedText(LANGUAGE_LIST.SubmitAnswer)}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
